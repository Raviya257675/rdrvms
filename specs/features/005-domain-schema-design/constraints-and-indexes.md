# Relational integrity, types and query design

Status: PROPOSED; no DDL, Prisma change, query execution or migration is authorized. [entity-catalogue.md](entity-catalogue.md) defines every proposed field and nullability. [transactions.md](transactions.md) defines cross-row invariants. The ER diagram shows 22 MVP tables, excludes six P1 tables and intentionally omits logical polymorphic subject/target/result arrows.

## Normalization and relationship review

Use normalized role, organization/district and skill bridges instead of JSON grant/skill arrays. A volunteer may belong to many organizations and hold several scoped roles. One incident has exactly one owning org and district; each request/assignment inherits that org. Profile home district is optional, while incident district is mandatory. No global admin capability or cross-org shared request is implicit.

Users have zero or one profile, many sessions/tokens and exactly one stream by account-provisioning transaction. A reverse FK cannot by itself require every user to have a stream; the provisioner and integrity tests enforce that lifecycle. Stream/notification recipient FKs enforce that notifications cannot lack a stream. An audit actor may be null only for an explicitly SYSTEM action. Logical audit targets, notification subjects and idempotency results use typed IDs without claiming a foreign key to every possible table.

The diagram uses optional user ends for reviewer/approver/closer fields and optional org ends for identity notifications/audits. Assignment membership FKs bind both user and org. Composite FK definitions below, not merely the picture, govern the joint keys. P1 allocations join requests and inventory within one org; optional precise points/evidence join incidents without widening the public aggregate.

Justified exceptions to normalization: inherited `organization_id` supports composite scope FKs; last status/reason fields cache current state while audit holds history; notification_streams.last_sequence is a serialized durable ordering counter; inventory quantity_available is a transactionally maintained balance; immutable notification/outbox payloads and idempotency response envelopes are bounded versioned snapshots. None is an alternate authorization source. No derived dashboard totals or copied private profile/contact fields are persisted.

## Prisma-to-PostgreSQL mapping proposal

| PostgreSQL concept | Proposed Prisma representation | Review implication |
|---|---|---|
| uuid PK/FK | String with @db.Uuid, @id/@@id, @relation | Server UUID generation; choose DB default only if direct SQL creation needs it; no extension needed for this design |
| varchar(n)/text | String @db.VarChar(n) / @db.Text | DTO length validation plus SQL limits; trim/nonblank checks where required |
| integer / smallint | Int @db.Integer / @db.SmallInt | Positive versions/capacity, bounded response codes; no floating-point counts |
| bigint | BigInt @db.BigInt | Sequence/size values serialized as bounded decimal strings where exposed; raw JS BigInt is not JSON |
| numeric(14,3) | Decimal @db.Decimal(14,3) | Exact quantities, not binary floating point; reject excess scale and out-of-range input before driver rounding |
| numeric(5,2) / numeric(9,6) | Decimal @db.Decimal(5,2) / (9,6) | Checked coordinates; server-approved coarsening, no PostGIS assumption |
| timestamptz(3) | DateTime @db.Timestamptz(3) | UTC serialization; server writes lifecycle times; API ISO 8601 |
| boolean | Boolean | Availability and active-grant flags are data, not client-supplied authorization |
| bytea | Bytes @db.ByteA | Token/request digests; never serialize in DTOs or logs |
| jsonb | Json @db.JsonB | Versioned allowlisted event/audit/result envelopes; object/size checks; no role or domain relationship blobs |
| checked varchar state | String + reviewed SQL CHECK | Propose CHECK sets matching current API enums, rather than native enums until transitions settle; Prisma validation alone does not enforce SQL values |
| ordinary composite keys/FKs/indexes | @@id/@@unique, @relation, @@index with explicit map names | Use PostgreSQL foreign keys, not relationMode=prisma emulation |
| row-local checks, partial indexes, grants | Reviewed native migration SQL after approval | Drift tests must retain objects not fully represented in Prisma schema |

Current Prisma v7 documentation lists CHECK constraints as unavailable in schema language; native SQL remains necessary. Its index documentation now describes partial indexes via a **Preview** feature. This proposal uses reviewed native SQL later rather than approving a preview flag or assuming the installed 7.10.1 supports every current syntax. [Prisma feature matrix](https://www.prisma.io/docs/orm/v7/reference/database-features), [Prisma indexes](https://www.prisma.io/docs/orm/v7/prisma-schema/data-model/indexes#configuring-partial-indexes-with-where).

Explicit native type annotations avoid relying on Prisma defaults, particularly timestamp versus timestamptz and default decimal precision. Mapping reference: [Prisma v7 schema API](https://www.prisma.io/docs/orm/v7/reference/prisma-schema-reference).

Decimal API decision C-10/D-S16: OpenAPI currently says quantity is JSON number. Proposed bounded three-decimal inputs can be validated exactly from their canonical decimal representation, and output converted only after a proven bounds/round-trip policy. Do not silently ship Prisma Decimal's default string serialization against that contract. Alternative: approved API change to decimal strings. Sequences are opaque cursor strings and do not require altering existing resource UUID IDs. These mappings are design choices, not generated/compiled evidence.

## Declarative constraints and FK anchors

| Key | Proposed constraint | Trace / reason |
|---|---|---|
| K01 | UNIQUE users.email_normalized; NOT NULL credential/consent; ACTIVE implies verified timestamp | FR-001, prevent duplicate accounts and bypass of verification |
| K02 | UNIQUE memberships(user_id,organization_id,role); composite grant FKs and assignment membership user/org FKs | FR-004/006/014, wrong-org and wrong-user link rejection |
| K03 | UNIQUE reference codes; PK bridge pairs; all references RESTRICT on delete/update | NFR-004/007/019, no duplicate grant links or silent history erasure |
| K04 | incidents UNIQUE(id,organization_id); FK(org,district) to organization_districts | FR-007/014, owned reporting and district boundary |
| K05 | requests FK(incident_id,organization_id); UNIQUE(id,organization_id); assignments/P1 allocations FK(request,org) | FR-011/014/022, cross-org chains rejected even via SQL |
| K06 | Partial UNIQUE assignments(relief_request_id,volunteer_id) WHERE status IN ('PENDING','ACCEPTED','IN_PROGRESS') | FR-016, NFR-004: one active pair; include PENDING reservations |
| K07 | CHECK positive request/allocation quantity, nonnegative inventory; profile capacity>=1, version>=1 | BR-03/06; fractional-unit policy still service-level |
| K08 | Incident type/state enums and review nullability/decision consistency; lat/lon ranges | FR-007/008/009, no “verified” row missing review metadata |
| K09 | Request state/approval/closure metadata and assignment lifecycle timestamp/reason checks | FR-012/015/016/025, locally impossible states rejected |
| K10 | UNIQUE session/token digests; byte length32; timestamp ordering and version bounds | FR-001/002/003/027, single-use/revoked/expiry behavior additionally in service |
| K11 | Notifications UNIQUE(recipient_id,sequence) and UNIQUE(recipient_id,event_key,kind); sequence>0; stream floor bounds | FR-018/019/020, owner ordering and durable deduplication |
| K12 | Outbox UNIQUE(notification_id); paired lease fields; terminal flags mutually exclusive; attempts>=0 | FR-018/019, one publication intent per inbox item |
| K13 | Idempotency UNIQUE(actor_id,organization_id,operation,key), digest length and success code bounds | NFR-022, no cross-actor/org replay collisions |
| K14 | Audit actor-kind consistency; mandatory request/target/action/time; object/size-limited metadata | FR-025/035, NFR-010/017; runtime INSERT-only privilege proposal |
| K15 | P1 item UNIQUE(org,sku), UNIQUE(id,org); allocations FK(item,org) and FK(request,org) | FR-021/022, no cross-org stock linking |

Composite referenced columns have explicit non-partial unique keys. Never use the active-pair partial unique index as an FK target. All child FK columns receive a covering leading-column index or a documented small reference/bridge exception; a foreign key is not itself a child lookup index.

Example constraint intent (documentation only, not a migration script):

```sql
CREATE UNIQUE INDEX assignments_active_pair_uq
ON assignments (relief_request_id, volunteer_id)
WHERE status IN ('PENDING', 'ACCEPTED', 'IN_PROGRESS');
```

No constraint like `CHECK(count(active_assignments)<=capacity)` or `CHECK(parent.status='VERIFIED')` is proposed: PostgreSQL CHECK expressions cannot safely enforce other-row/table state. Use FKs/unique constraints where possible and the shared transaction/lock protocol for aggregate rules. [PostgreSQL 17 constraints](https://www.postgresql.org/docs/17/ddl-constraints.html).

## State and timestamp checks versus workflow policy

| Aggregate | Proposed transitions | Row-local constraints | Required service policy |
|---|---|---|---|
| User | UNVERIFIED→ACTIVE, ACTIVE↔SUSPENDED, approved retirement terminal | ACTIVE has email_verified_at; retirement marker matches state | Verify token; scoped admin; suspension revokes sessions; no unapproved reactivation/role grants |
| Incident | UNVERIFIED→VERIFIED/REJECTED; VERIFIED→ACTIVE→RESOLVED | UNVERIFIED all review fields null; other states all review fields set; REJECTED decision=REJECTED, VERIFIED/ACTIVE/RESOLVED decision=VERIFIED | Scoped reviewer, reason>=5, version; block resolve with open needs/active commitments unless separately approved compensation |
| Request | DRAFT→APPROVED→IN_PROGRESS→FULFILLED; allowed nonterminal→CANCELLED | approval actor/time paired; required for approved/progress/fulfilled; close actor/time/reason required for terminal | Lock verified/active parent; positive quantity with valid unit; explicit coordinator closure; cancel pending assignments atomically; block cancellation while accepted/in-progress work needs human handover |
| Assignment | PENDING→ACCEPTED/DECLINED/CANCELLED; ACCEPTED→IN_PROGRESS→COMPLETED | accepted/declined/progress/completed require responded_at; progress/completed require started_at; terminal requires ended_at; DECLINED/CANCELLED nonblank reason; timestamp order assigned<=responded<=started<=ended for present fields | Only target can accept/decline; coordinator may cancel PENDING; role/session/version and parent guards; no implied direct ACCEPTED→COMPLETED or active cancellation without approved API/state change |
| Allocation P1 | RESERVED→DISPATCHED→CONSUMED; RESERVED→RELEASED | positive qty, required status timestamp; release reason; no consumed+released | Atomic reserve/release once; no restock of dispatched goods without approved physical return; units/categories agree |

A state CHECK validates allowed values and local metadata, not the old→new transition or actor rights. Those require services comparing prior state/version under locks. No state trigger silently claims to solve authorization. If privileged direct writes must enforce workflows too, approve dedicated procedures/triggers and a restricted write interface as a separate decision.

## Index and pagination inventory

All indexes are proposals, not performance proof. PK/UQ indexes already serve their leading-column paths; avoid duplicate single-column indexes. Mutable state filters add write cost; verify with realistic fictional datasets and EXPLAIN in a later disposable environment.

| Entity/query | Proposed index beyond PK and candidate UQs |
|---|---|
| users/login | email UQ only; status-only index deferred |
| account_roles | PK(user,role); no extra |
| districts/skills/units/organizations | code UQ; no unbounded text search/GIN by default |
| organization_districts/intake candidates | (district_id,organization_id) |
| memberships/org staff | (organization_id,role,status,user_id); unique user/org/role handles own scopes |
| membership_districts/scope lookup | (organization_id,district_id,membership_id); PK handles membership grants |
| volunteer_profiles/candidates | optional (home_district_id,available,user_id), only after workload validation |
| volunteer_skills/skill match | (skill_id,user_id) |
| verification tokens | (user_id,created_at DESC); expires_at for approved purge |
| sessions/revoke and purge | (user_id,revoked_at,expires_at); expires_at |
| incidents/coordinator board | (organization_id,district_id,status,created_at DESC,id DESC); (organization_id,type,created_at DESC,id DESC) if type-filter workload justifies |
| incidents/reporter and public aggregation | (reporter_id,created_at DESC,id DESC); (district_id,type,created_at DESC,id DESC) WHERE review_decision='VERIFIED' for approved aggregate query |
| relief_requests/incident and board | (incident_id,status); (organization_id,status,created_at DESC,id DESC); optional priority ordering index only with explicit priority rank and cursor contract |
| request_skills | PK(request,skill); reverse skill index deferred |
| assignments/own work and capacity | (volunteer_id,status,created_at DESC,id DESC); (relief_request_id,status); (organization_id,created_at DESC,id DESC); membership FK indexes if not covered |
| notification_streams | recipient PK only |
| notifications/recovery/list | UQ(recipient,sequence); (recipient_id,created_at DESC,id DESC); optional (recipient_id,sequence) WHERE read_at IS NULL; organization_id FK index |
| outbox/worker | (next_attempt_at,created_at,id) WHERE processed_at IS NULL AND failed_at IS NULL; lease_until for expired-lease query if plans justify |
| audit/investigation | (organization_id,created_at DESC,id DESC); (target_type,target_id,created_at DESC,id DESC); (request_id); actor_id FK index |
| idempotency/replay | unique scope key; organization_id FK index; actor leading column covered |
| P1 inventory and allocations | catalogue board/item/request indexes; created_by and unit FK indexes where not covered |
| P1 restricted points/evidence/reset/rights | catalogue parent/token/expiry/owner/work queue indexes; actor and org FK coverage as needed |

Complete the small remaining FK-index inventory during the first approved physical DDL review: incident reviewed_by; request created_by/approved_by/closed_by/unit_id; memberships granted_by; profile home_district; assignment coordinator_id. No blanket index on every scalar or JSON field. Query plans determine whether a multi-column FK anchor or index already covers each case.

Default resource-list order is immutable `(created_at DESC,id DESC)` with keyset predicate, bound filter set and approved default/max limit (proposal 25/100). Cursors include ordering values and filter/scope binding; never trust cursor values to grant scope. Timestamp lists offer stable ordering, not a snapshot or lossless event feed. Inbox reconciliation uses the stronger stream sequence protocol; audit incremental export likewise needs an approved snapshot strategy if lossless export is later required. Dashboard aggregates use the same visibility predicates as lists, never global restricted counts for public callers.

## Referential deletion and archival

Use RESTRICT throughout the proposed MVP, including users referenced by actor/reviewer/grant history and orgs referenced by domain rows. Runtime identity revocation is a status/session action, not DELETE. An approved rights/anonymization workflow may later change selected identifying attributes while preserving opaque IDs and audit integrity; do not cascade into assignments, notices, audit or replay records. Delete/retention jobs require reviewed ordering and cannot invalidate unread notification recovery or idempotency promises. No retention interval, RLS/grant installation or SQL deletion is authorized here.
