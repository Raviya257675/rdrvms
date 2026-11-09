# Entity and attribute catalogue

Status: **all tables, field bounds and defaults below are proposals, not executable schema or approved policy**. Scope and alternatives: [spec.md](spec.md), [decisions-and-risks.md](decisions-and-risks.md). Exact SQL constraints/indexes and service responsibilities are in [constraints-and-indexes.md](constraints-and-indexes.md); transaction protocols are in [transactions.md](transactions.md).

## Conventions applying to every entry

- `NN` = NOT NULL; `?` = nullable; `PK`, `UQ`, `FK` identify keys. Unmarked defaults: none. Every FK uses PostgreSQL enforcement and proposed `ON DELETE RESTRICT`, `ON UPDATE RESTRICT`; any exception needs approval. Soft retirement does not remove FKs or grant access.
- **M** mutable aggregate/reference base: `id uuid PK NN`, `created_at timestamptz(3) NN default now()`, `updated_at timestamptz(3) NN default now()`, `version integer NN default 1 CHECK >=1`. IDs are server-generated UUIDs. Updates increment version and updated_at through the service; a default alone does not maintain updated_at.
- **A** append-created base: `id uuid PK NN`, `created_at timestamptz(3) NN default now()`. Additional fields may change only as explicitly stated (session expiry/revocation, notification read marker, outbox attempts). Audit fields never change through runtime application privileges.
- **B** bridge base: `created_at timestamptz(3) NN default now()` plus the listed composite PK. No unrelated UUID or version is needed; grant/profile/parent locks serialize edits. These internal rows and user-keyed profiles/streams are the explicit C-08 exceptions to LLD's generic resource shape.
- Text bounds here, except existing OpenAPI bounds, are proposed resource limits. Do not infer maximum skill counts, session ages, retention days or policy approvals from column widths. Timestamps are instants stored in UTC, not local wall-clock values. All free text is confidential/internal until reviewed; HTML is never trusted.
- No domain row stores victim/recipient identity, household ID, telephone, medical status or street address. Codes are stable, labels localizable later. JSON is restricted to versioned event/audit/result envelopes, not roles, skills, grants or relationships.

## Proposed MVP — 23 entities

### E01 — districts (M)

Purpose/trace: approved administrative geography for FR-005/007/010/014, NFR-007/009. Attributes: `code varchar(32) NN UQ`; `name varchar(100) NN`; `active boolean NN default true`. Candidate key is code; PK from M. Code/name are fictional-demo reference labels, not private addresses. No province, divisional secretariat or spatial hierarchy is implied.

Relationships: district 1:N organization_districts, membership_districts and incidents; 1:N optional home districts on profiles. Ownership: reference-data administrator only; public safe code/name can be published. Checks: nonblank code/name, stable canonical code format; retire via active=false, preserve historical references. Queries: code lookup via UQ; district-based boards via child indexes. Reference edits use version checks and audit; deletion/retention class R below.

### E02 — users (M)

Purpose/trace: FR-001/002/004/025/027/033, NFR-008/017.

| Attribute | PostgreSQL type / nullability / default | Notes |
|---|---|---|
| email_normalized | varchar(254) NN UQ | Canonicalized with approved email policy; never public |
| password_hash | text NN | Approved password-hashing library's encoded output; secret |
| display_name | varchar(100) NN | Internal; not reporter identity on public views |
| status | varchar(16) NN default 'UNVERIFIED' | CHECK UNVERIFIED, ACTIVE, SUSPENDED, RETIRED |
| email_verified_at | timestamptz(3) ? | ACTIVE requires nonnull; suspension retains verification history |
| consent_version | varchar(64) NN | Version of acknowledged registration notice |
| consent_accepted_at | timestamptz(3) NN | FR-001 initial acknowledgement, not blanket legal consent |
| auth_version | integer NN default 1 | CHECK >=1; increment on revocation-triggering changes |
| retired_at | timestamptz(3) ? | Required iff RETIRED; no hard deletion implied |

Relationships: 1:N roles, memberships, sessions/tokens, reports, assignments, notifications, audits; optional 1:1 profile; mandatory 1:1 notification stream after account creation. Email candidate uniqueness remains across retired records until deletion/reuse policy is approved. Ownership: owner-bound self-safe fields; global suspension requires the separately approved E23 account-security capability. Organization administrator membership cannot suspend a global identity or read unrelated accounts. No global admin boolean. State transitions UNVERIFIED→ACTIVE after valid verification; ACTIVE→SUSPENDED by separately authorized account-security workflow; restoration and retirement need additional explicit policy approval, with RETIRED terminal proposed. Identity transactions lock the user before mutating role/session status. Query by email uses UQ; no blanket status-only index without workload evidence. Retention U.

### E03 — account_roles (B)

Purpose/trace: personal capabilities FR-001/004/005; D-S01. Attributes: `user_id uuid NN FK users`; `role varchar(16) NN CHECK IN ('REPORTER','VOLUNTEER')`; PK `(user_id,role)`. Role markers do not authorize organization operations. Operational coordinator/organization-admin authority exists only in memberships. The separate E23 global account-security capability is neither a personal role nor an operational role. Multiple rows allow one account to report and volunteer; no single-role column or comma-separated role list.

Relationships: user 1:N markers. Owner: identity/admin service; self-registration allowed roles need explicit approval. Mutations lock user and revoke/increment auth state where required. Role removal must not delete profile/assignment history. PK supports own-role lookup; no additional index proposed. Retention U, audit every grant/revoke.

### E04 — organizations (M)

Purpose/trace: scope for FR-004/006/014/021; attributes `code varchar(32) NN UQ`, `name varchar(160) NN`, `status varchar(16) NN default 'ACTIVE' CHECK IN ('ACTIVE','INACTIVE')`. PK M; no unique organization name assumption.

Organization 1:N district mappings, memberships, incidents, requests, assignments and idempotency records; P1 inventory. Only approved admin operations manage it; no global role assumed. Inactivation blocks new scoped work and preserves history; active work requires human handover rather than cascade cancellation. Code lookup/UQ; scope-query indexes live on children. Edits lock org and check version; R retention. P0 may use reviewed fictional bootstrap rows without implementing P1 management UI.

### E05 — organization_districts (B)

Purpose/trace: D-004; FR-004/007/014; NFR-007. Attributes: `organization_id uuid NN FK organizations`, `district_id uuid NN FK districts`, `active boolean NN default true`; PK `(organization_id,district_id)`.

N:M org/district boundary. Incidents reference this pair; membership grants must reference it too. A valid FK is not proof the mapping is active. Admin service locks organization/mapping before deactivation and audits; no direct deletion in MVP. PK serves org lookup; reverse index `(district_id,organization_id)` serves approved intake routing. Public routing must use explicitly safe active org data only. Retention R.

### E06 — memberships (M)

Purpose/trace: FR-004/006/014/027; organization-specific role grants. Attributes: `user_id uuid NN FK users`; `organization_id uuid NN FK organizations`; `role varchar(24) NN CHECK IN ('VOLUNTEER','COORDINATOR','ADMINISTRATOR')`; `status varchar(16) NN default 'ACTIVE' CHECK IN ('ACTIVE','REVOKED')`; `granted_by uuid NN FK users`; `revoked_at timestamptz(3) ?`. Proposed `CHECK ((status='REVOKED') = (revoked_at IS NOT NULL))`.

Candidate UQ `(user_id,organization_id,role)` preserves document 06, permits several roles in each of several orgs. Additional UQ `(id,organization_id,user_id)` is a composite FK anchor for assignment actor identity; UQ `(id,organization_id)` anchors district grants. It is deliberate redundant indexing for declarative scope integrity, not a second business identity.

Relationships: each membership has explicit N district grants; role alone with zero district grants authorizes zero district operations. Only scoped administrators manage approved subordinate grants; bootstrap grant self-reference uses a pre-created fictional user in a reviewed transaction. Re-grant updates same row and audits history rather than duplicating revoked triples. Queries `(organization_id,role,status,user_id)` and the unique user triple. Lock relevant users, org and membership for changes; invalidate sessions/sockets according to D-S05. Retention U/W.

### E07 — membership_districts (B)

Purpose/trace: FR-004/006/014, NFR-007. Attributes: `membership_id uuid NN`, `organization_id uuid NN`, `district_id uuid NN`, `active boolean NN default true`; PK `(membership_id,district_id)`. Composite FK `(membership_id,organization_id)`→memberships `(id,organization_id)`; `(organization_id,district_id)`→organization_districts. These FKs make a cross-org district grant invalid even under direct SQL.

Membership N:M districts, limited to its organization. `organization_id` is a justified scope-integrity duplicate. Access requires active district, org, mapping, membership and grant; no wildcard or implicit “all districts.” Grant edits lock membership and audit; logical revocation active=false preserves references/history. Reverse index `(organization_id,district_id,membership_id)`. Scope information is internal, not public membership data. Retention U/W.

### E08 — volunteer_profiles (user-keyed mutable row)

Purpose/trace: FR-005/014/016. Attributes: `user_id uuid NN PK/FK users`; `home_district_id uuid ? FK districts`; `available boolean NN default false`; `capacity integer NN default 1 CHECK >=1`; `created_at`, `updated_at timestamptz(3) NN default now()`; `version integer NN default 1 CHECK >=1`.

Optional 1:1 user/profile; 1:N skill links and assignments. Capacity covers all active commitments across organizations, with PENDING reserving a slot. Profile is not evidence of a volunteer role, active account or scoped membership. Home region is coarse matching information; district grants determine permitted response area. Self can edit approved fields only; coordinators see minimal eligible-profile DTOs within scope. Sensitive/internal; never public. Query index `(home_district_id,available,user_id)` is optional after load evidence; capacity decisions always lock exact PK. Lowering capacity below active commitment count is rejected; setting unavailable blocks new work but does not silently cancel reservations. Retention U/W.

### E09 — skills (M)

Purpose/trace: FR-005/014; normalized taxonomy proposal. Attributes: `code varchar(64) NN UQ`, `label varchar(100) NN`, `active boolean NN default true`. User-claimed skills are not professional certification or dispatch eligibility. Admin-reviewed codes; retire rather than delete. Reference public labels may be safe; volunteer links are confidential. Code UQ and bridge indexes handle queries. Version/audit on taxonomy edits; R.

### E10 — volunteer_skills (B)

Attributes: `user_id uuid NN FK volunteer_profiles(user_id)`; `skill_id uuid NN FK skills`; PK `(user_id,skill_id)`. Trace FR-005/014. Profile 1:N links, skill 1:N links; reverse index `(skill_id,user_id)` supports eligible candidate search. Owner profile edits lock profile and audit; active work is not retroactively invalidated by skill edits. No public enumeration. Bridge changes are restricted to self-approved fields and scoped reads. Retention U/W.

### E11 — units (M)

Purpose/trace: FR-011/021/022; exact quantity validation. Attributes: `code varchar(16) NN UQ`, `label varchar(64) NN`, `dimension varchar(16) NN CHECK IN ('COUNT','MASS','VOLUME','TIME')`, `fractional_allowed boolean NN default false`, `active boolean NN default true`.

Unit 1:N requests/P1 items; code is candidate key. Code list and whether TIME is needed require D-S08 sign-off; unused dimensions need not be seeded. No automatic conversion or unit equivalence is implied. Fractional-unit validation is cross-row service policy under reference lock/version discipline, not an invalid cross-table CHECK. Used code semantics are immutable; create a new unit for a semantic change. Public labels safe; administrative writes only. R retention; UQ lookup only.

### E12 — email_verification_tokens (A)

Purpose/trace FR-001, AT-001. Attributes: `user_id uuid NN FK users`; `token_hash bytea NN UQ CHECK octet_length=32`; `email_normalized varchar(254) NN`; `expires_at timestamptz(3) NN`; `consumed_at timestamptz(3) ?`. CHECK expires_at>created_at and consumed_at IS NULL or consumed_at>=created_at. Token expiration is checked against current time by service, not a clock-dependent CHECK.

User 1:N token attempts; token binds current normalized email, is one-use, stored as digest only, consumed atomically with user verification. User lock serializes token consumption/account edits; generic failures hide account existence. No actual email provider or delivery authorized; fictional demo verification workflow needs D-S04 approval. UQ token lookup, `(user_id,created_at DESC)` and expiry cleanup index if approved. Secret table, no client/list exposure. Retention S.

### E13 — sessions (A)

Purpose/trace FR-002/004/027, NFR-008/017. Attributes: `user_id uuid NN FK users`; `token_hash bytea NN UQ CHECK octet_length=32`; `user_auth_version integer NN CHECK >=1`; `csrf_secret_hash bytea NN CHECK octet_length=32`; `last_seen_at timestamptz(3) NN default now()`; `expires_at timestamptz(3) NN`; `absolute_expires_at timestamptz(3) NN`; `revoked_at timestamptz(3) ?`. CHECK created_at<=expires_at<=absolute_expires_at, last_seen_at>=created_at, revoked_at NULL or >=created_at.

User 1:N sessions; internal UUID is not a cookie credential. Proposed random bearer token is delivered only in secure cookie and its digest stored; no arbitrary session JSON/roles snapshot. CSRF scheme/secret generation requires approval; no home-grown cryptographic protocol is implemented. Check current user auth_version/status and database memberships on access; expire by both idle and absolute limit. Touches can be throttled to bound writes but cannot revive expired/revoked sessions. Index `(user_id,revoked_at,expires_at)` for revocation/list; expires_at for reviewed cleanup. Rotation revokes old token and issues new atomically. Session properties are secret; token_hash is not returned. Retention S. Proposed idle/absolute limits, digest generation, cookie scope, rotation and CSRF review gates are in [security-parameters.md](security-parameters.md); none is approved.

### E14 — incidents (M)

Purpose/trace FR-007–010/013/023/025; NFR-009.

| Attribute | PostgreSQL type / nullability / default | Meaning |
|---|---|---|
| organization_id | uuid NN FK organizations | One accountable owner org; cross-org collaboration deferred |
| district_id | uuid NN FK districts | Composite FK with org→organization_districts |
| reporter_id | uuid NN FK users | Private reporting identity |
| title | varchar(160) NN | CHECK length 5..160, per OpenAPI; internal until safe review |
| description | varchar(3000) NN | Untrusted narrative; never default public |
| type | varchar(16) NN | CHECK FLOOD, LANDSLIDE, STORM, FIRE, OTHER from OpenAPI |
| approximate_lat / approximate_lon | numeric(5,2) NN each | Proposed coarse grid storage, range checks; not a privacy guarantee |
| occurred_at | timestamptz(3) ? | Optional claimed event time; created_at is server report timestamp |
| status | varchar(16) NN default 'UNVERIFIED' | CHECK UNVERIFIED, VERIFIED, REJECTED, ACTIVE, RESOLVED |
| review_decision | varchar(16) ? | CHECK VERIFIED or REJECTED when nonnull |
| reviewed_by | uuid ? FK users | Review actor, including rejection; policy requires coordinator scope |
| reviewed_at | timestamptz(3) ? | Server decision time |
| review_reason | varchar(1000) ? | Nonblank length>=5 if present; upper bound proposed |
| archived_at | timestamptz(3) ? | Explicit archive marker, not an authorization bypass |

Candidate UQ `(id,organization_id)` anchors request scope. Four review fields are all null for UNVERIFIED, all nonnull afterward; decision must match REJECTED or VERIFIED/ACTIVE/RESOLVED as appropriate. Transitions UNVERIFIED→VERIFIED/REJECTED; VERIFIED→ACTIVE→RESOLVED; no reopen/cancel in proposed MVP. Org/district/reporter immutable after intake except a separately approved correction workflow. Incident 1:N requests and audit targets. Own reporter/scoped staff/assigned responders have approved-field access; guest output is district/type aggregate only by default. Intake routing and coarse grid require D-S06/D-S07 decisions. Service coarsens before storage; database scale alone does not enforce safe collection/publication. Board indexes described separately; version and parent locks guard verification/child mutations. W retention.

### E15 — relief_requests (M)

Purpose/trace FR-011–014/023/025. Attributes: `organization_id uuid NN FK organizations`; `incident_id uuid NN`; `created_by uuid NN FK users`; `category varchar(64) NN`; `quantity numeric(14,3) NN CHECK >0`; `unit_id uuid NN FK units`; `priority varchar(8) NN CHECK IN ('LOW','MEDIUM','HIGH','CRITICAL')`; `notes varchar(2000) ?`; `status varchar(16) NN default 'DRAFT' CHECK IN ('DRAFT','APPROVED','IN_PROGRESS','FULFILLED','CANCELLED')`; `status_reason varchar(1000) ?`; `approved_by uuid ? FK users`; `approved_at timestamptz(3) ?`; `closed_by uuid ? FK users`; `closed_at timestamptz(3) ?`; `archived_at timestamptz(3) ?`.

Composite FK `(incident_id,organization_id)`→incidents `(id,organization_id)`; UQ `(id,organization_id)` for assignments/allocations. One incident has many needs; no request without a parent. Category taxonomy and fulfillment meaning require approval; quantity is not assumed to equal number of volunteer slots. Approved actor/time paired; approval required for APPROVED/IN_PROGRESS/FULFILLED, retained if later cancelled. FULFILLED/CANCELLED require close actor/time/reason; DRAFT→CANCELLED can have null approval. DRAFT→APPROVED→IN_PROGRESS→FULFILLED, active→CANCELLED subject to pending/active assignment handling. Parent verified guard and unit fractional rules live in service transaction. Scoped coordinator creates/approves/closes under proposed C-02; private notes never public. Index parent and scoped board; versioned writes with same-transaction audit/notifications. W retention.

### E16 — request_skills (B)

Purpose/trace FR-014 eligibility. Attributes `relief_request_id uuid NN FK relief_requests`, `skill_id uuid NN FK skills`; PK `(relief_request_id,skill_id)`. Request may require zero or many active skills, each of which a candidate must possess. This is an explicit proposal extending document 06's matching data; alternative is category-based fixed policy (D-S08). Only scoped coordinator edits on DRAFT/APPROVED before commitments, locking request; existing active work cannot be invalidated silently. Reverse index `(skill_id,relief_request_id)` only if query evidence needs it; PK handles eligibility lookup. Internal; W retention.

### E17 — assignments (M)

Purpose/trace FR-014–019/025; NFR-004/022. Attributes `organization_id uuid NN FK organizations`; `relief_request_id uuid NN`; `volunteer_id uuid NN FK volunteer_profiles(user_id)`; `coordinator_id uuid NN FK users`; `volunteer_membership_id uuid NN`; `coordinator_membership_id uuid NN`; `status varchar(16) NN default 'PENDING' CHECK IN ('PENDING','ACCEPTED','DECLINED','IN_PROGRESS','COMPLETED','CANCELLED')`; `assigned_at timestamptz(3) NN default now()`; `responded_at timestamptz(3) ?`; `started_at timestamptz(3) ?`; `ended_at timestamptz(3) ?`; `status_reason varchar(1000) ?`.

Composite FKs: `(relief_request_id,organization_id)`→requests `(id,organization_id)`; `(volunteer_membership_id,organization_id,volunteer_id)` and coordinator equivalent→memberships `(id,organization_id,user_id)`. Service verifies respective membership roles and active district grants; FKs alone do not confer authority.

Request 1:N assignments; volunteer 1:N assignments across orgs. Partial UQ `(relief_request_id,volunteer_id)` WHERE status IN (PENDING,ACCEPTED,IN_PROGRESS) prevents duplicate active pair. Active count across all requests/orgs must not exceed locked profile capacity. State transitions and timestamp requirements in constraints document. Only target volunteer accepts/declines; scoped coordinator cancels pending work. Active cancellation/reassignment/timeouts are not silently invented. Eligibility checked at assignment creation; reservation survives availability toggles, but suspended/revoked users cannot act. P1 predecessor link/reassignment described below. Index volunteer/status/time and request/status. W retention; immutable IDs/actors ensure history remains traceable.

### E18 — notification_streams (recipient-keyed mutable row)

Purpose/trace FR-019; NFR-005/022. Attributes: `recipient_id uuid NN PK/FK users`; `last_sequence bigint NN default 0`; `retention_floor bigint NN default 0`; `updated_at timestamptz(3) NN default now()`; CHECK `0<=retention_floor AND retention_floor<=last_sequence`.

Exactly one per new account; user 1:1 stream, stream 1:N notifications by recipient. Serializing sequence increments per recipient before commit prevents late-commit cursor gaps; this supporting entity is a proposed correctness mechanism, not user-facing functionality. Sequence is not PostgreSQL sequence allocation order. Owner may read safe cursor state; service alone increments; approved purge may advance floor. PK lookup, no extra indexes. Never reset/reuse sequence or delete stream while history/retry pointers exist. Retention N; normalized exception is the persisted monotonic counter explained in transactions.md.

### E19 — notifications (A)

Purpose/trace FR-018–020/023. Attributes: `recipient_id uuid NN FK notification_streams(recipient_id)`; `sequence bigint NN CHECK >0`; `organization_id uuid ? FK organizations`; `event_key uuid NN`; `kind varchar(64) NN`; `subject_type varchar(32) NN`; `subject_id uuid ?`; `payload_version integer NN default 1 CHECK >=1`; `payload jsonb NN`; `read_at timestamptz(3) ?`. UQ `(recipient_id,sequence)` and `(recipient_id,event_key,kind)`; CHECK read_at NULL or >=created_at, payload is object with bounded size (proposed 4096 bytes).

Every notification has one owner stream and at most one outbox row. Organization null only for identity/system messages. Subject references are logical typed pointers; validate in same domain transaction, authorize again on read, tolerate approved archival via a neutral tombstone. Store allowlisted IDs/status/version only, no exact point, raw text, contact, credentials or evidence URL. Revoked org access yields a neutral owner-only item without subject identifiers, not leaked history. Read marker changes NULL→timestamp once, never deletes row or changes sequence. Owner+current relevant scope evaluated on every page/ack. `(recipient_id,sequence)` supports safe replay; `(recipient_id,created_at DESC,id DESC)` supports existing LLD list shape; optional unread partial index. N retention with gap protocol.

### E20 — outbox_events (A)

Purpose/trace FR-018/019/031/032. Attributes: `notification_id uuid NN UQ FK notifications`; `event_type varchar(64) NN`; `payload jsonb NN`; `payload_version integer NN default 1`; `attempts integer NN default 0 CHECK >=0`; `next_attempt_at timestamptz(3) NN default now()`; `lease_token uuid ?`; `lease_until timestamptz(3) ?`; `processed_at timestamptz(3) ?`; `failed_at timestamptz(3) ?`; `last_error_code varchar(64) ?`. Lease fields paired; processed_at/failed_at mutually exclusive; object/size checks as notifications.

One row per notification's live publication intent; id UUID is stable socket eventId, notification supplies owner and domain pointer. No incident-only FK: assignments and identity notifications work without fake incident ancestry. Payload is minimal safe identifiers, not the authoritative domain state. Worker state alone is mutable; publication content immutable. Current recipient/scope must be revalidated before room emit. processed_at means the publication attempt completed, not that the browser received/acknowledged it. Polling/lease indexes and bounded retries in companion documents. Crash-safe retry can duplicate emit but cannot duplicate durable notifications. Exhaustion marks failed_at and alerts privately; REST still recovers. Retention O.

### E21 — audit_events (A, entirely append-only)

Purpose/trace FR-006/008/009/012/016/022/025/027/035; NFR-010/024. Attributes: `actor_kind varchar(8) NN CHECK IN ('USER','SYSTEM')`; `actor_id uuid ? FK users`; `organization_id uuid ? FK organizations`; `target_type varchar(32) NN`; `target_id uuid NN`; `action varchar(64) NN`; `request_id uuid NN`; `reason_code varchar(64) ?`; `metadata_version integer NN default 1`; `metadata jsonb NN`. USER requires actor_id; SYSTEM requires null actor_id and approved action. All target entity keys are UUID or have a UUID parent, so bridge audits target that parent with safe grant/skill codes in metadata.

Typed logical target IDs preserve history and allow varied aggregates; no false universal target FK is claimed. Audit insertion validates existing target or an approved attempted-access/system action. Reference/grant/status changes include old/new safe values, reason, actor and server time; never secrets, precise points, narrative copies, tokens or session hashes. Restricted audit readers must have explicit scope; reporter/volunteer cannot browse others' audits. Proposed additional attribute: `authorization_context varchar(24) NN CHECK IN ('OWNER','ORGANIZATION','ACCOUNT_SECURITY','SYSTEM')`. Organization is nonnull iff context is ORGANIZATION; SYSTEM context requires SYSTEM actor; OWNER and ACCOUNT_SECURITY require USER actor. ORGANIZATION may use USER or an explicitly approved SYSTEM action with a nonnull org. Owner/global account-security events have null org only with an explicit allowlisted action/context/target check. This discriminator does not grant access. Application DB role gets INSERT and policy-filtered SELECT, no UPDATE/DELETE/TRUNCATE, table ownership, grant option or inherited owner role; actual grants need later approval. SQL SELECT privilege alone does not filter rows, so service scope enforcement remains required without RLS. DDL owner can still tamper: this is not cryptographic/WORM immutability. Index target/time, org/time and request ID. A retention; legal hold/deletion decisions remain open.

### E22 — idempotency_records (A, immutable completed result)

Purpose/trace FR-016/022; NFR-022. Attributes `actor_id uuid NN FK users`; `organization_id uuid NN FK organizations`; `operation varchar(64) NN`; `key uuid NN`; `request_hash bytea NN CHECK octet_length=32`; `result_type varchar(32) NN`; `result_id uuid NN`; `response_status smallint NN CHECK BETWEEN 200 AND 299`; `response_payload jsonb NN`; `payload_version integer NN default 1`. UQ `(actor_id,organization_id,operation,key)` is the replay scope; body digest includes normalized command, target and expected versions.

Rows become visible only with successful domain commit; never persist a detached “processing” claim with unfinished result. Insert a fully specified candidate row in the same transaction and roll it back on any conflict/failure; concurrent duplicate inserts serialize via unique constraint. Existing winner is read/re-authorized after rollback. Typed logical result pointer covers assignments and later allocations; current authorization is always checked before replaying a minimal stored DTO. Reusing key with different body gives conflict; stable minimal tombstone retained rather than silently allowing unsafe key reuse. Fixed small payload limit proposed 4096 bytes. Actor/org FKs and UQ support lookups; no automatic TTL chosen. I retention; no passwords/tokens/raw request body stored.

### E23 — account_security_grants (M; separately gated)

Purpose/trace: FR-004/025/027/035, AT-004/025/027/035, NFR-007/010; D-S03/D-S18, related D-003/D-004 and revocation dependency D-012. This is the single additional requirement-backed entity needed to represent the selected restricted global account-security authority; it does not add a general permission engine.

Attributes beyond M: `user_id uuid NN FK users`; `capability varchar(32) NN CHECK = 'ACCOUNT_SECURITY_MANAGE'`; `status varchar(16) NN default 'ACTIVE' CHECK IN ('ACTIVE','REVOKED')`; `granted_by uuid NN FK users`; `review_reference varchar(256) NN CHECK nonblank`; `reason_code varchar(64) NN CHECK nonblank`; `revoked_by uuid ? FK users`; `revoked_at timestamptz(3) ?`. CHECK `(status='ACTIVE' AND revoked_by IS NULL AND revoked_at IS NULL) OR (status='REVOKED' AND revoked_by IS NOT NULL AND revoked_at IS NOT NULL AND revoked_at>=created_at)`. Partial revocation metadata is invalid in either state. UQ `(user_id,capability)`. All FKs RESTRICT; regrant updates the same row with a new reviewed reference and audit, never discards prior audit history.

User 1:N grants (currently at most one capability), user 1:N grants issued; optional revoker 1:N grants. **No organization_id column**: capability is a named global exception requiring supervisor and independent security approval, never a NULL-org membership. Current active/verified account, valid session and active exact capability are checked at each command. Permits only confirmed, reasoned global suspension, personal privilege removal and the minimum identity/related audit views needed for that action after contract approval. Does not permit reactivation, role addition, organization grants, coordinator work, broad audit browsing or grant delegation. Revoking org grants still requires their own scoped authority; global capability alone cannot edit them.

Only a separately reviewed offline human-controlled fictional bootstrap/maintenance procedure may install/revoke this grant. The capability itself cannot grant this capability. No public registration field, runtime self-grant or automatic Administrator-role inheritance. Bootstrap actor exists first; any initial self-issued record is an explicit offline, reviewed exception with evidence, not an API privilege. Failure to approve E23 blocks global FR-027 behavior rather than falling back to broad admins.

Lock subject and actor users in sorted order, then grant row for both account-security commands and grant revocation; increment affected user's auth_version, revoke sessions and append mandatory audit atomically. Grant revocation also invalidates the grant holder's sessions. Index `(user_id,status,capability)` is unnecessary over tiny per-user UQ; add granted_by/revoked_by FK indexes at DDL review. No capability-based global incident/profile/contact query. Secret-adjacent internal access; retention U/A, no physical purge policy approved.

## Ownership, archival and retention classes

These are policy categories, not approved durations or scheduled jobs. Every catalogue entry names its category. All hard-delete/cascade/purge behavior remains disabled until a reviewed policy defines retention, backups, legal holds and reconciliation/replay windows.

| Class | Entities | Proposed handling pending approval |
|---|---|---|
| R | districts, skills, units, organizations, organization_districts | Retire reference entries; keep code semantics and historical FKs; no cascade |
| U | users, account_roles, account_security_grants, memberships, membership_districts, volunteer_profiles, volunteer_skills | Suspend/revoke rather than erase history; minimize identifying data; any anonymization must preserve unique keys and actor references under reviewed policy |
| W | incidents, relief_requests, request_skills, assignments (and membership/profile history dependencies) | Terminal state plus archive marker where listed; retain audit-linked history; archival never makes a row public |
| S | sessions, email_verification_tokens, later reset tokens | Revoke/expire immediately for access; eventual physical purge only after approved security investigation/replay window |
| N | notification_streams, notifications | Keep offline recovery window; never delete unread actionable history silently; advance retention_floor atomically if approved purge occurs |
| O | outbox_events | Only terminal rows eligible for reviewed cleanup; never discard pending/leased publication intent; retain dedup/reconciliation references |
| A | audit_events | Runtime append-only, restricted readers; configurable reviewed retention/legal hold; do not claim protection from DBA tampering |
| I | idempotency_records | Preserve result identity/digest for documented replay guarantees; response compaction must not permit duplicate historical commands |

## P1 catalogue — six evaluated future entities, outside MVP

All share M or A as stated, RESTRICT FKs and the same sensitivity conventions. These designs are complete enough to review boundaries, but cannot be installed with the MVP without explicit phase approval.

| Entity / trace / purpose | Attributes in addition to base | Keys, relationships, checks and queries | Ownership, concurrency, exposure and retention |
|---|---|---|---|
| inventory_items (M), FR-021/022; organization supplies | organization_id uuid NN FK organizations; sku varchar(64) NN; label varchar(160) NN; category varchar(64) NN; unit_id uuid NN FK units; quantity_available numeric(14,3) NN default 0; active boolean NN default true | UQ(org,sku), UQ(id,organization_id); CHECK quantity_available>=0; item 1:N allocations; index(org,active,created_at DESC,id DESC) | Scoped coordinator/admin policy pending; no cross-org allocation; atomic conditional decrement under item lock; quantity is exact available balance, audited adjustments not silent overwrite; unit/category immutable after use; internal; W/R |
| allocations (M), FR-022; reserve/dispatch/consume/release | organization_id uuid NN; relief_request_id uuid NN; inventory_item_id uuid NN; quantity numeric(14,3) NN; status varchar(16) NN default RESERVED; created_by uuid NN FK users; status_reason varchar(1000) ?; dispatched_at/consumed_at/released_at timestamptz(3) ? each | Composite FKs(request,org) and (item,org); CHECK qty>0; status RESERVED/DISPATCHED/CONSUMED/RELEASED; temporal/reason checks; index(item,status), (request,status); no arbitrary pair uniqueness, because legitimate repeated batches may exist | Same-org and exactly same unit/category; no implicit conversion, request total accounting policy D-S10; reserve decrements available once, release restores only RESERVED once; consumed never restored; dispatched physical return deferred; audit+inbox/outbox+idempotency transaction; internal, no recipient PII; W |
| restricted_incident_locations (M), FR-024; optional precise responder point | incident_id uuid NN UQ; organization_id uuid NN; latitude numeric(9,6) NN; longitude numeric(9,6) NN; collection_reason varchar(500) NN; collected_by uuid NN FK users | Composite FK(incident,org); CHECK lat -90..90, lon -180..180; incident 0..1 restricted point; UQ incident lookup only; no spatial extension/index without justified query | Separate allowlisted repository/DTO, need-to-know assigned responder/scoped staff only, access audits without coordinate values; default not collected; explicit D-005 approval required; versioned correction; confidential W with separately approved shortest retention |
| evidence_files (M), FR-026; private upload metadata | incident_id uuid NN; organization_id uuid NN; uploaded_by uuid NN FK users; object_key varchar(512) NN UQ; media_type varchar(64) NN; byte_size bigint NN; status varchar(16) NN default PENDING; checksum bytea ?; verified_at timestamptz(3) ? | Composite FK(incident,org); CHECK 0<size<=5242880 (proposed 5 MiB interpretation); status PENDING/VERIFIED/REJECTED/DELETED; checksum length32 if present; index(incident,status), (status,created_at) for orphan review | Object store/integration costs separately approved; random keys, MIME/signature check, no supplied URL fetching; pending metadata then out-of-transaction scan/upload then versioned finalize; no public URLs/embedded blobs; private downloads/access audit; deletion/orphan policy D-011, W/S |
| password_reset_tokens (A), FR-003; one-use account recovery | user_id uuid NN FK users; token_hash bytea NN UQ length32; expires_at timestamptz(3) NN; consumed_at timestamptz(3) ? | User 1:N; expiry>created, consumed>=created; UQ token lookup; (user_id,created_at DESC), expires_at for reviewed cleanup | Generic account-existence response; lock user, consume token, change approved password hash, increment auth_version and revoke all sessions atomically; no external email service assumed; secret S |
| privacy_requests (M), FR-030; documented rights workflow | subject_user_id uuid NN FK users; submitted_by uuid NN FK users; kind varchar(16) NN; status varchar(16) NN default RECEIVED; assigned_admin_id uuid ? FK users; scope_organization_id uuid ? FK organizations; reason varchar(1000) ?; resolved_at timestamptz(3) ? | CHECK kind ACCESS/CORRECTION/DELETION; status RECEIVED/IN_REVIEW/RESOLVED/REJECTED; terminal requires resolved_at; index(subject_user_id,created_at DESC,id DESC), (status,created_at) | Own submission plus approved reviewer scope; cross-org subject rights require explicitly approved handling authority, not a null-org superuser bypass; no arbitrary PII payload; access corrections via audited workflow, no automatic cascades; confidential retention pending legal/privacy review |

P1 reassignment (FR-017) may add `supersedes_assignment_id uuid ? UQ FK assignments` and `response_due_at timestamptz(3) ?` to assignments after timeout/reassignment policy approval. One predecessor→at most one replacement, same org/request, no cycles, no erasure of original actor/history. Parent/profile locks and audit/inbox/outbox preserve atomic cancellation/replacement. No timeouts or new EXPIRED status are assumed in MVP.

No additional mandatory distribution, beneficiary, location-history, refresh-token, role-permission, analytics, message-provider or attachment-content entity follows from the current requirements. Revisit only with a traced feature/change request.
