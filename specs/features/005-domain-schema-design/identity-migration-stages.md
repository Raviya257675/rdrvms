# Identity migration proposal — three stages, Master Prompt 03A.3

Status: **PROPOSED / NEEDS APPROVAL**. No schema/migration/DDL generation or database access performed. [Approval verification](approval-verification.md) found no decision-specific approval; all fields, relationships, constraints, model names and object names below are unapproved candidates. This is the detailed physical-design companion to [identity-scope-readiness.md](identity-scope-readiness.md) and [migration-plan.md](migration-plan.md), not an instruction to execute them.

Trace: FR-001/002/004/025/027/033/035; scope support under FR-006 remains P1 management; NFR-005/007/008/010/015/017/018/019/024/025. E18 is an early supporting dependency for FR-019/NFR-005/022, not an implemented inbox. All canonical FR/NFR/AT IDs and existing scenario assertions are preserved. Supplemental test partitions below are proposed specifications linked to existing IDs, not executed tests or new canonical IDs.

03B.0 refines only Stage 1 in [stage1-technical-corrections.md](stage1-technical-corrections.md): seven explicit CHECK candidates, Unicode name blank detection, proposed strict ASCII code/C collation, district-first reference locking, role matrix and immutable-reference lifecycle. All new policy choices are PENDING; delegation is NOT GRANTED / UNVERIFIED and implementation/SQL remain NOT AUTHORIZED. Stage 2/3 inventories and broader D/C decisions are unaffected.

## Stage grouping and dependency audit

| Stage | Exact proposed Prisma model → PostgreSQL table | External FK dependencies | Enablement / fixtures |
|---|---|---|---|
| 1 | District → districts; Organization → organizations; OrganizationDistrict → organization_districts | None before stage; mapping references District/Organization created first | Schema only; no domain endpoints or live bootstrap |
| 2 | User → users; AccountRole → account_roles; Membership → memberships; MembershipDistrict → membership_districts | Organization and OrganizationDistrict from stage 1; User first within stage 2 | Schema only; no committed operational accounts/grants before stage 3 audit/stream support |
| 3 | EmailVerificationToken → email_verification_tokens; Session → sessions; NotificationStream → notification_streams; AuditEvent → audit_events; AccountSecurityGrant → account_security_grants | User from stage 2; Organization from stage 1 for audit | All 12 objects plus approved security/source/contract/TDD/target gates before any dependent identity endpoint or bootstrap |

The requested **3 + 4 + 5 = 12** grouping is FK-correct; no table reassignment is required. OrganizationDistrict must follow both parents. MembershipDistrict follows Membership's (id,organization_id) unique anchor and OrganizationDistrict's composite PK. Stage 3 has no mandatory forward FK into a future domain table. Audit target_id is a typed logical pointer, not a fictitious universal FK. E23 issuer/revoker/subject all reference User, not Membership.

These are three schema stages of one future approved identity slice, not three independently enabled product features. Installing stages 1/2 without data is compatible with current health/readiness-only runtime. Do not create operational users before the stage-3 mandatory stream/audit lifecycle is available; do not defer audit for grant writes. Stage-local constraint tests may use isolated rollback-only synthetic fixtures after explicit test authorization. Races requiring commits run only against the complete three-stage disposable schema with full audited user/stream provisioning; this is not permission to commit incomplete operational identities in an intermediate stage. The full offline bootstrap is deferred until all stages and privileges are verified.

## Prisma mapping and common field definitions

Names here are exact proposed model names with `@@map("table_name")`; scalar names remain the listed snake_case SQL column names, so no scalar @map alias is needed. String states are checked varchar, not a newly selected native enum. Use PostgreSQL foreignKeys relation mode (not emulated relations), no Preview flag, extension, generator/config change or new dependency. Logical Prisma relation fields do not create extra database columns. Full schema compilation, overlapping composite relation support, generated SQL and native-object preservation still require later pinned-version checks; this document is not compiled Prisma evidence.

| Base used below | Complete inherited field declarations | PostgreSQL nullability / defaults |
|---|---|---|
| M | id String @db.Uuid @id; created_at DateTime @db.Timestamptz(3); updated_at DateTime @db.Timestamptz(3); version Int | All NN; id service-generated UUID, no DB default; created_at/updated_at now(); version 1 and CHECK version>=1 |
| A | id String @db.Uuid @id; created_at DateTime @db.Timestamptz(3) | Both NN; id service-generated UUID, no DB default; created_at now() |
| B | created_at DateTime @db.Timestamptz(3) plus listed composite PK fields | NN, default now(); no synthetic UUID/version |
| S | No inherited fields; all NotificationStream fields listed explicitly | Recipient-keyed exception; no created_at/id/version |

Service-generated UUID means an explicitly supplied server UUID in future Prisma creates; no @default(uuid()) or database extension is silently selected. Date defaults map to @default(now()), scalar 1/0/true defaults to @default(1)/@default(0)/@default(true), string defaults to the quoted value via @default("VALUE"). None means no Prisma/SQL default (nullable omitted columns receive SQL NULL). updated_at/version updates are explicit service writes, not automatic @updatedAt or hidden triggers. M and A get named PK `<table>_pkey`; bridge/stream PKs are listed below. All scalar native annotations, widths, nullability, defaults and positive versions require approval.

Type mapping follows the [Prisma v7 schema reference](https://www.prisma.io/docs/orm/v7/reference/prisma-schema-reference); constraints remain PostgreSQL objects, see [PostgreSQL 17 constraints](https://www.postgresql.org/docs/17/ddl-constraints.html). Prisma scalar/relation declarations do not replace row-local CHECKs or application authorization. These references do not prove compatibility of an uncompiled schema against the installed pinned version.

## Complete model scalar inventory (all proposed)

Inherited M/A/B fields above plus each table's rows below define every proposed column. NN = NOT NULL; NULL = nullable. All values remain blocked pending sign-off; any field/policy variation must update this inventory, catalogue and tests before migration generation.

### Stage 1 — District / districts (E01, base M)

Both Stage 1 code columns retain varchar(32), with **proposed built-in deterministic C column collation** and exact full-string uppercase ASCII grammar from stage1-technical-corrections.md. This added native collation setting is PENDING acceptance and must later be pinned in reviewed SQL/catalog checks; it is not represented by the scalar annotation alone. Name bounds remain 100/160 with explicit B-aware nonblank checks and localized-text preservation.

| Scalar field | Proposed Prisma type/native annotation | PostgreSQL type | Nullability | Default |
|---|---|---|---|---|
| code | String @db.VarChar(32) | varchar(32) | NN | none |
| name | String @db.VarChar(100) | varchar(100) | NN | none |
| active | Boolean | boolean | NN | true |

### Stage 1 — Organization / organizations (E04, base M)

| Scalar field | Proposed Prisma type/native annotation | PostgreSQL type | Nullability | Default |
|---|---|---|---|---|
| code | String @db.VarChar(32) | varchar(32) | NN | none |
| name | String @db.VarChar(160) | varchar(160) | NN | none |
| status | String @db.VarChar(16) | varchar(16) | NN | 'ACTIVE' |

### Stage 1 — OrganizationDistrict / organization_districts (E05, base B)

| Scalar field | Proposed Prisma type/native annotation | PostgreSQL type | Nullability | Default |
|---|---|---|---|---|
| organization_id | String @db.Uuid | uuid | NN | none |
| district_id | String @db.Uuid | uuid | NN | none |
| active | Boolean | boolean | NN | true |

### Stage 2 — User / users (E02, base M)

| Scalar field | Proposed Prisma type/native annotation | PostgreSQL type | Nullability | Default |
|---|---|---|---|---|
| email_normalized | String @db.VarChar(254) | varchar(254) | NN | none |
| password_hash | String @db.Text | text | NN | none |
| display_name | String @db.VarChar(100) | varchar(100) | NN | none |
| status | String @db.VarChar(16) | varchar(16) | NN | 'UNVERIFIED' |
| email_verified_at | DateTime? @db.Timestamptz(3) | timestamptz(3) | NULL | none |
| consent_version | String @db.VarChar(64) | varchar(64) | NN | none |
| consent_accepted_at | DateTime @db.Timestamptz(3) | timestamptz(3) | NN | none |
| auth_version | Int | integer | NN | 1 |
| retired_at | DateTime? @db.Timestamptz(3) | timestamptz(3) | NULL | none |

### Stage 2 — AccountRole / account_roles (E03, base B)

| Scalar field | Proposed Prisma type/native annotation | PostgreSQL type | Nullability | Default |
|---|---|---|---|---|
| user_id | String @db.Uuid | uuid | NN | none |
| role | String @db.VarChar(16) | varchar(16) | NN | none |

### Stage 2 — Membership / memberships (E06, base M)

| Scalar field | Proposed Prisma type/native annotation | PostgreSQL type | Nullability | Default |
|---|---|---|---|---|
| user_id | String @db.Uuid | uuid | NN | none |
| organization_id | String @db.Uuid | uuid | NN | none |
| role | String @db.VarChar(24) | varchar(24) | NN | none |
| status | String @db.VarChar(16) | varchar(16) | NN | 'ACTIVE' |
| granted_by | String @db.Uuid | uuid | NN | none |
| revoked_at | DateTime? @db.Timestamptz(3) | timestamptz(3) | NULL | none |

### Stage 2 — MembershipDistrict / membership_districts (E07, base B)

| Scalar field | Proposed Prisma type/native annotation | PostgreSQL type | Nullability | Default |
|---|---|---|---|---|
| membership_id | String @db.Uuid | uuid | NN | none |
| organization_id | String @db.Uuid | uuid | NN | none |
| district_id | String @db.Uuid | uuid | NN | none |
| active | Boolean | boolean | NN | true |

### Stage 3 — EmailVerificationToken / email_verification_tokens (E12, base A)

| Scalar field | Proposed Prisma type/native annotation | PostgreSQL type | Nullability | Default |
|---|---|---|---|---|
| user_id | String @db.Uuid | uuid | NN | none |
| token_hash | Bytes @db.ByteA | bytea | NN | none |
| email_normalized | String @db.VarChar(254) | varchar(254) | NN | none |
| expires_at | DateTime @db.Timestamptz(3) | timestamptz(3) | NN | none |
| consumed_at | DateTime? @db.Timestamptz(3) | timestamptz(3) | NULL | none |

### Stage 3 — Session / sessions (E13, base A)

| Scalar field | Proposed Prisma type/native annotation | PostgreSQL type | Nullability | Default |
|---|---|---|---|---|
| user_id | String @db.Uuid | uuid | NN | none |
| token_hash | Bytes @db.ByteA | bytea | NN | none |
| user_auth_version | Int | integer | NN | none |
| csrf_secret_hash | Bytes @db.ByteA | bytea | NN | none |
| last_seen_at | DateTime @db.Timestamptz(3) | timestamptz(3) | NN | now() |
| expires_at | DateTime @db.Timestamptz(3) | timestamptz(3) | NN | none |
| absolute_expires_at | DateTime @db.Timestamptz(3) | timestamptz(3) | NN | none |
| revoked_at | DateTime? @db.Timestamptz(3) | timestamptz(3) | NULL | none |

### Stage 3 — NotificationStream / notification_streams (E18, base S)

| Scalar field | Proposed Prisma type/native annotation | PostgreSQL type | Nullability | Default |
|---|---|---|---|---|
| recipient_id | String @db.Uuid | uuid | NN | none |
| last_sequence | BigInt | bigint | NN | 0 |
| retention_floor | BigInt | bigint | NN | 0 |
| updated_at | DateTime @db.Timestamptz(3) | timestamptz(3) | NN | now() |

### Stage 3 — AuditEvent / audit_events (E21, base A)

| Scalar field | Proposed Prisma type/native annotation | PostgreSQL type | Nullability | Default |
|---|---|---|---|---|
| actor_kind | String @db.VarChar(8) | varchar(8) | NN | none |
| actor_id | String? @db.Uuid | uuid | NULL | none |
| organization_id | String? @db.Uuid | uuid | NULL | none |
| authorization_context | String @db.VarChar(24) | varchar(24) | NN | none |
| target_type | String @db.VarChar(32) | varchar(32) | NN | none |
| target_id | String @db.Uuid | uuid | NN | none |
| action | String @db.VarChar(64) | varchar(64) | NN | none |
| request_id | String @db.Uuid | uuid | NN | none |
| reason_code | String? @db.VarChar(64) | varchar(64) | NULL | none |
| metadata_version | Int | integer | NN | 1 |
| metadata | Json @db.JsonB | jsonb | NN | none |

### Stage 3 — AccountSecurityGrant / account_security_grants (E23, base M)

| Scalar field | Proposed Prisma type/native annotation | PostgreSQL type | Nullability | Default |
|---|---|---|---|---|
| user_id | String @db.Uuid | uuid | NN | none |
| capability | String @db.VarChar(32) | varchar(32) | NN | none |
| status | String @db.VarChar(16) | varchar(16) | NN | 'ACTIVE' |
| granted_by | String @db.Uuid | uuid | NN | none |
| review_reference | String @db.VarChar(256) | varchar(256) | NN | none |
| reason_code | String @db.VarChar(64) | varchar(64) | NN | none |
| revoked_by | String? @db.Uuid | uuid | NULL | none |
| revoked_at | DateTime? @db.Timestamptz(3) | timestamptz(3) | NULL | none |

## Primary keys, uniqueness and exact FK/relation inventory

Every FK below uses `onDelete: Restrict, onUpdate: Restrict`, with NOT DEFERRABLE validated enforcement proposed; no cascade, SET NULL, disabled triggers or relationMode=prisma. Nullable audit/revoker relations are optional; all other child-side Prisma relations are required. Every referenced composite key is an ordinary nonpartial PK/UQ. Child unique/profile existence does not enforce a mandatory reverse row (User→stream remains a service invariant).

| Stage/table | Proposed PK/UQ declarations / object names |
|---|---|
| 1 districts | id PK districts_pkey; code @unique(map: "districts_code_uq") |
| 1 organizations | id PK organizations_pkey; code @unique(map: "organizations_code_uq") |
| 1 organization_districts | @@id([organization_id,district_id], map: "organization_districts_pkey") |
| 2 users | id PK users_pkey; email_normalized @unique(map: "users_email_uq") |
| 2 account_roles | @@id([user_id,role], map: "account_roles_pkey") |
| 2 memberships | id PK memberships_pkey; @@unique([user_id,organization_id,role], map: "memberships_user_org_role_uq"); @@unique([id,organization_id], map: "memberships_id_org_uq"); @@unique([id,organization_id,user_id], map: "memberships_id_org_user_uq") |
| 2 membership_districts | @@id([membership_id,district_id], map: "membership_districts_pkey") |
| 3 email_verification_tokens | id PK email_verification_tokens_pkey; token_hash @unique(map: "email_verification_tokens_hash_uq") |
| 3 sessions | id PK sessions_pkey; token_hash @unique(map: "sessions_hash_uq") |
| 3 notification_streams | recipient_id @id(map: "notification_streams_pkey") |
| 3 audit_events | id PK audit_events_pkey; no false universal target FK/uniqueness |
| 3 account_security_grants | id PK account_security_grants_pkey; @@unique([user_id,capability], map: "account_security_grants_user_cap_uq") |

| Stage/table | Child columns → parent columns | Proposed Prisma relation field / paired parent field | Proposed FK name |
|---|---|---|---|
| 1 organization_districts | organization_id → organizations.id | organization / organization_districts | organization_districts_org_fk |
| 1 organization_districts | district_id → districts.id | district / organization_districts | organization_districts_district_fk |
| 2 account_roles | user_id → users.id | user / account_roles | account_roles_user_fk |
| 2 memberships | user_id → users.id | user / memberships, named MembershipSubject | memberships_user_fk |
| 2 memberships | granted_by → users.id | grantor / memberships_issued, named MembershipIssuer | memberships_grantor_fk |
| 2 memberships | organization_id → organizations.id | organization / memberships | memberships_org_fk |
| 2 membership_districts | (membership_id,organization_id) → memberships.(id,organization_id) | membership / district_grants | membership_districts_member_org_fk |
| 2 membership_districts | (organization_id,district_id) → organization_districts.(organization_id,district_id) | organization_district / membership_districts | membership_districts_org_district_fk |
| 3 email_verification_tokens | user_id → users.id | user / email_verification_tokens | email_verification_tokens_user_fk |
| 3 sessions | user_id → users.id | user / sessions | sessions_user_fk |
| 3 notification_streams | recipient_id → users.id | user / notification_stream (optional User backrelation, enforced provisioning invariant) | notification_streams_user_fk |
| 3 audit_events | actor_id → users.id (nullable) | actor / audit_events | audit_events_actor_fk |
| 3 audit_events | organization_id → organizations.id (nullable) | organization / audit_events | audit_events_org_fk |
| 3 account_security_grants | user_id → users.id | user / account_security_grants, named AccountSecuritySubject | account_security_grants_user_fk |
| 3 account_security_grants | granted_by → users.id | grantor / account_security_grants_issued, named AccountSecurityIssuer | account_security_grants_grantor_fk |
| 3 account_security_grants | revoked_by → users.id (nullable) | revoker / account_security_grants_revoked, named AccountSecurityRevoker | account_security_grants_revoker_fk |

Parents have list backrelations except User.notification_stream, which is optional in the physical Prisma relation because the FK cannot force a stream to exist. Future full-model backrelations (profiles, incidents, notifications etc.) are intentionally not declared as stage prerequisites. Inventory above has **16 FK constraints**, with no missing stage parent. The memberships id/org/user anchor is preserved for future assignments despite not being consumed by these 12 tables.

## Native CHECK inventory and enforcement boundary

Object names and exact row-local expressions below are proposed for review, not executable SQL files. For every M table add `<table>_version_ck` expression `version>=1`. **Stage 1 exception/refinement:** its exact seven CHECK candidates are listed in stage1-technical-corrections.md. The two `<table>_code_text_ck` expressions use its strict ASCII/C grammar and the two `<table>_name_text_ck` expressions use `char_length(translate(name, B, ''))>0` with its exact B literal inlined. These replace default-btrim shorthand for E01/E04; no redundant status/code nonblank checks are added. Exact W/B/code/collation choices are PENDING, not approved policy.

For other stages only, the earlier required-nonblank candidate remains `<table>_<column>_text_ck` with `length(btrim(column))>0`; nullable reason_code uses `reason_code IS NULL OR length(btrim(reason_code))>0`. These other-stage candidates are outside 03B.0 and must not be described as comprehensive Unicode whitespace validation. Varchar bounds cap stored text but PostgreSQL trailing-space/cast behavior is not a substitute for application length checks. Additional canonical email/other-code formats, stronger password limits and action/reason vocabularies remain OPEN.

| Stage / proposed constraint name | Candidate expression / native responsibility | Service-only or unresolved responsibility |
|---|---|---|
| 1 organizations_status_ck | status IN ('ACTIVE','INACTIVE') | Current org/district/mapping status evaluated on access |
| 2 account_roles_role_ck | role IN ('REPORTER','VOLUNTEER') | Registration allowlist, no self-elevation or operational role inheritance |
| 2 users_status_ck | status IN ('UNVERIFIED','ACTIVE','SUSPENDED','RETIRED') | Only approved old→new transitions; restoration/retirement policy unsigned |
| 2 users_active_verified_ck | status<>'ACTIVE' OR email_verified_at IS NOT NULL | Verification token/email/current state; no arbitrary direct activation |
| 2 users_auth_version_ck | auth_version>=1 | Atomically increment for approved revocations; version overflow fails closed and needs reviewed handling |
| 2 users_retired_ck | (status='RETIRED') = (retired_at IS NOT NULL) | No retirement/erasure endpoint authorized |
| 2 memberships_role_ck | role IN ('VOLUNTEER','COORDINATOR','ADMINISTRATOR') | Explicit scoped role-to-action policy, no global account suspension |
| 2 memberships_status_ck | status IN ('ACTIVE','REVOKED') | Active user/org/mapping/district/grants all required |
| 2 memberships_revocation_ck | (status='REVOKED') = (revoked_at IS NOT NULL) | Regrant/handover/audit; no historical row deletion |
| 3 email_verification_tokens_hash_ck | octet_length(token_hash)=32 | CSPRNG generation/digest policy unapproved; no raw credential |
| 3 email_verification_tokens_time_ck | expires_at>created_at AND (consumed_at IS NULL OR consumed_at>=created_at) | Current DB time, current email, atomic single-use; exact lifetime/resend/rate rules unsigned |
| 3 sessions_digest_ck | octet_length(token_hash)=32 AND octet_length(csrf_secret_hash)=32 | CSRF storage/reissue may require inventory revision after library review; cannot assume this field fits |
| 3 sessions_version_ck | user_auth_version>=1 | Recheck current user auth_version/status; roles not copied into session authority |
| 3 sessions_time_ck | created_at<=expires_at AND expires_at<=absolute_expires_at AND last_seen_at>=created_at AND (revoked_at IS NULL OR revoked_at>=created_at) | Strict idle/absolute boundary, conditional touch/rotation cannot revive/reextend; durations unsigned |
| 3 notification_streams_bounds_ck | 0<=retention_floor AND retention_floor<=last_sequence | User/stream provisioning atomic; no stream deletion/reset or purge policy approved |
| 3 audit_events_actor_ck | (actor_kind='USER' AND actor_id IS NOT NULL) OR (actor_kind='SYSTEM' AND actor_id IS NULL) | Approved actor/action/target; no system-actor impersonation |
| 3 audit_events_context_ck | authorization_context IN ('OWNER','ORGANIZATION','ACCOUNT_SECURITY','SYSTEM'); org nonnull iff context ORGANIZATION; OWNER/ACCOUNT_SECURITY require USER; SYSTEM context requires SYSTEM; ORGANIZATION allows USER or approved SYSTEM action | No null-org wildcard; owner/global audit reads explicitly restricted |
| 3 audit_events_metadata_ck | metadata_version>=1 AND jsonb_typeof(metadata)='object'; proposed additional bound octet_length(metadata::text)<=4096 | **4096-byte audit bound is a new unapproved physical-design candidate**, not an inherited numeric policy; target/action/reason allowlists and secret redaction need review |
| 3 account_security_grants_capability_ck | capability='ACCOUNT_SECURITY_MANAGE' | Narrow global suspension/personal privilege removal only after supervisor/security approval |
| 3 account_security_grants_revocation_ck | (status='ACTIVE' AND revoked_by IS NULL AND revoked_at IS NULL) OR (status='REVOKED' AND revoked_by IS NOT NULL AND revoked_at IS NOT NULL AND revoked_at>=created_at) | Offline-only issue/revoke/regrant, reviewed evidence, no runtime delegation or reactivation |

For audit_events_context_ck the exact proposed logical conjunction is: `(authorization_context IN ('OWNER','ORGANIZATION','ACCOUNT_SECURITY','SYSTEM')) AND ((authorization_context='ORGANIZATION')=(organization_id IS NOT NULL)) AND (authorization_context NOT IN ('OWNER','ACCOUNT_SECURITY') OR actor_kind='USER') AND (authorization_context<>'SYSTEM' OR actor_kind='SYSTEM')`, combined with audit_events_actor_ck. Context never bypasses target checks. Nonblank action/target_type/request ID, required high-impact reason and confirmation, authorization, active reference rows, allowed transitions and single-use semantics are not proven by these row checks. No CHECK subquery/clock-dependent expiry or cross-row count is proposed.

## Index inventory and catalog proof

All PK/UQ indexes above are already present in the proposal; do not create redundant single-column copies. Every additional index below is an ordinary B-tree (no partial predicate or extension is required for this identity slice). Proposed names map through @@index(..., map: "name") unless later native review requires otherwise. FK references do not automatically create child-side indexes.

| Stage/table | Additional index columns/order → proposed name |
|---|---|
| 1 organization_districts | (district_id,organization_id) → organization_districts_district_org_idx |
| 2 memberships | (organization_id,role,status,user_id) → memberships_org_role_status_user_idx; (granted_by) → memberships_grantor_idx. User-leading unique triple covers user FK |
| 2 membership_districts | (organization_id,district_id,membership_id) → membership_districts_org_district_member_idx. Composite PK covers membership-leading lookup |
| 3 email_verification_tokens | (user_id,created_at DESC) → email_verification_tokens_user_created_idx; (expires_at) → email_verification_tokens_expiry_idx |
| 3 sessions | (user_id,revoked_at,expires_at) → sessions_user_revoke_expiry_idx; (expires_at) → sessions_expiry_idx |
| 3 notification_streams | Recipient PK only |
| 3 audit_events | (target_type,target_id,created_at DESC,id DESC) → audit_events_target_created_idx; (organization_id,created_at DESC,id DESC) → audit_events_org_created_idx; (request_id) → audit_events_request_idx; (actor_id) → audit_events_actor_idx |
| 3 account_security_grants | (granted_by) → account_security_grants_grantor_idx; (revoked_by) → account_security_grants_revoker_idx. User/capability UQ covers subject FK |

Catalog assertions after each authorized stage must compare pg_class/pg_namespace/pg_attribute/pg_type/pg_attrdef, pg_constraint/pg_index/pg_indexes and effective role metadata against the exact reviewed inventory: schema/table names, every type/typmod, NN and defaults, ordered PK/UQ/FK keys and FK referenced columns, update/delete actions and validation/deferrability, CHECK definitions, index uniqueness/order/direction/access method/predicates/validity, owners/ACL/inheritance/SET ROLE paths. No unknown object or name collision is accepted silently. Confirm no native enum, extension, trigger, cascade or Prisma-emulated FK replaced the reviewed plan. FK UQs are ordinary nonpartial indexes. Assert stage table totals 3, then 7, then 12, excluding recognized pre-existing objects and Prisma migration metadata; actual target is never assumed empty.

## Stage-specific authorization, fixtures, tests and enablement

All tests in this section are **PLANNED / NOT EXECUTED**. On an expressly authorized disposable PostgreSQL 17 target, first capture behavioral RED then implement minimum GREEN. A passing schema compiler/mock is not a constraint, privilege or race proof. Do not alter canonical acceptance assertions or statuses to make these stages appear complete.

### Stage 1 operational gates

- **Authorization/approvals:** D-S02/D-S15 scoped geometry/integrity; D-S13/D-S18 fictional provisioning and audit path; related D-004/D-001. No organization administrator, public org-creation API or global creation authority is granted by inserting a table definition. Sign-off on exact reference fields/codes and nonblank checks required.
- **03B.0 review boundary:** Documentation corrections only. The DEV-STAGE1 governance change remains unadopted, delegation NOT GRANTED / UNVERIFIED and exact design acceptance PENDING. Proposed name/code/collation, immutable identifiers, reference lock/role matrix and lifecycle choices require explicit scoped review. D-S13/D-S18 bootstrap/audit behavior stays deferred; this correction grants neither a bootstrap nor a broader identity-policy exception.
- **Ordering/recovery:** District and Organization before OrganizationDistrict. Review one additive transactional stage and rollback of failure before commit in isolation. On later app rollback retain any acknowledged data; no DROP/down/reset. Stop stage chain on failed/colliding object; retain disabled domain features and inspect checksum/catalog before reviewed forward fix.
- **Fixtures:** After all stages/privileges, reviewed offline bootstrap can insert two fictional orgs/two approved district codes and permitted mappings with same-transaction audit; no committed pre-audit bootstrap in stage 1. Stage-local FK/UQ/CHECK tests use rollback-only isolated rows. No real names, victim locations or credentials.
- **Unit tests:** FR-004/NFR-007 policy rejects inactive org/district/mapping, absent explicit context and attempted role/wildcard inference; FR-033 fixture manifest/target guard; exact code/full-string and W/B/name-length rules only once signed. See S1-01–S1-16 in [test-cases.md](test-cases.md), all PLANNED / NOT EXECUTED.
- **Integration/negative tests:** AT-004/033, NF-007/017/019, SEC-001/002, SC-04/05/24/31/32/39/40: all required NULLs, invalid/missing UUIDs, duplicate codes/pairs, version 0/negative/defaults, blank/Unicode/length/status boundaries and RESTRICT parent UPDATE/DELETE fail; valid N:M succeeds. Wrong target/manifest and unauthorized FK-valid pairs fail before writes. Future role/SET ROLE/ownership, immutable identifier, inactive-pair reinsert/reactivation, district-retirement races and native preservation partitions have separate execution gates; no committed unaudited Stage 1 writer is introduced. Transaction failure leaves no partial stage in isolated rehearsal. No authentication endpoint exists from these tables.
- **Catalog assertions:** 3 planned tables; exact 18 NN fields/defaults, 3 PKs, 2 code UQs, 2 validated nondeferrable RESTRICT FKs, seven candidate CHECKs, proposed C code-column/UQ collations and reverse mapping B-tree, plus effective role/ownership review. No users, memberships or grant bootstrap yet. Native SQL CHECK/collation preservation through a later unrelated migration must be verified independently of Prisma schema-only diff.
- **Endpoint preconditions:** Existing liveness/SELECT-only readiness behavior unchanged; **all new domain endpoints remain unavailable** after stage 1.

### Stage 2 operational gates

- **Authorization/approvals:** D-S01/02/03/04/05/12/13/15/18 applicable user/grant/audit/session decisions and C-11 source amendments; related D-002/003/004/010/012. Declared org roles cannot confer global identity authority. Stage-2 schema presence is not an authorization to create real operational accounts or enable registration.
- **Ordering/recovery:** User, then AccountRole/Membership (including issuer User FK and unique anchors), then MembershipDistrict referencing both Membership and OrganizationDistrict. Stage 1 must be catalog-verified. Failure rolls back current stage; previous stages remain installed/disabled. Reviewed forward fix, never compensating by weakening constraints or dropping history.
- **Fixtures:** Only rollback-only isolated constraint fixtures before stage 3. After all stages, full bootstrap creates fictional operator User first, then personal roles/memberships/district grants plus stream/verification/audit as required in one transaction; grant issuer exists first. No permanent account may be committed without required stream/audit support. Use locally supplied ephemeral credentials with approved hash library, never committed/shared plaintext.
- **Unit tests:** AT-001/004/006/027/035, SEC-001, SC-01/04/35/36/40: independent multi-role identity; no org/district grants means no district operations; role/action matrix denies inheritance, other-owner access, self-elevation and org-admin global suspension; email canonicalization/consent limits and retirement/restoration only after signed policy.
- **Integration/negative tests:** Duplicate normalized-email and membership-triple races; multi-org/multi-role valid inserts; cross-org grant, missing issuer/subject, NULL keys, invalid role/status and revocation metadata, missing composite anchor rejected; parent deletion/update RESTRICT; revoked membership/district or inactive mapping denied by service even when FK-valid. Confirm caller cannot forge granted_by/user status/roles. Tests do not claim implemented FR-006 UI.
- **Catalog assertions:** Cumulative 7 tables; this stage adds 4 PKs, 1 email UQ plus 3 membership UQs, 6 FKs, exact composite order, positive versions/auth_version, user verification/retirement and membership role/revocation checks, two membership indexes and district-grant reverse index. Role vocabulary is checked varchar, no global role or nullable membership org.
- **Endpoint preconditions:** **All identity, organization-management and privileged endpoints remain unavailable** after stage 2; mandatory streams/audit/sessions/verification are not yet installed. Do not provision accounts merely to demonstrate this intermediate migration.

### Stage 3 operational gates

- **Authorization/approvals:** D-S01–05/D-S11–13/D-S15/D-S18 as used by the 12-entity slice, C-11 supervisor/constitutional + independent security review, signed source/API alignment and explicit implementation/target/SQL authorization. Exact Argon2id 19 MiB/t2/p1, ≥256-bit credential, digest, 30m/12h expiry, cookie/origin/CSRF/token controls remain review candidates in security-parameters.md; verification lifetime/channel/resend/limits still OPEN.
- **Ordering/recovery:** After verified stages 1/2, create AuditEvent, NotificationStream, EmailVerificationToken, Session and AccountSecurityGrant in reviewed stage-3 transaction; all parent FKs point to earlier stages. Apply/verify owner/runtime/bootstrap privilege separation before any fixture or endpoint writer. Audit row and grant installation must commit together in later bootstrap transaction. Failure grants no partial capability; fail closed and keep features unavailable.
- **Fixtures:** Full fictional matrix: unverified/active/suspended accounts, REPORTER+VOLUNTEER account, two orgs/districts, active/revoked/zero-district grants, E23 holder/nonholder, consumed/expired verification and session records with fixture clock, explicit review manifest. Every user gets one stream under provisioning. Insert no real notification/domain data outside slice; no email/SMS provider. Initial self-issued offline capability requires explicit signed exception and safe audit context; last-operator recovery and regrant remain blocked until reviewed. Rerun cannot elevate/reactivate or overwrite history.
- **Unit tests:** AT-001/002/004/025/027/033/035, SEC-001/002/003, NF-007/008/010/017/018/024/025: owner/org/global context policy, accepted parameter boundaries, digest handling, safe DTO/audit allowlists, pre-auth and session-bound CSRF/origin validation/reissue, revocation, confirmation=true/nonblank reason and expected user version; reason/state/CSRF/library choices signed first.
- **Integration/security/races:** SC-01/02/03/24/25/31/32/35–40: one canonical account; one token consumer/activation; user+role+stream+token+audit rollback if any insert fails; strict idle/absolute boundary and conditional touch; rotation/logged-out/suspended/changed-grant tokens fail; login/rotation/touch/capability commands serialize with user/grant revocation; no secrets/CSRF/digests in logs/DTOs. Wrong user/org/district, missing/forged/revoked E23 and generic org Administrator denied; no global delegation/reactivation/coordinator inheritance.
- **Supplemental negative partitions from consistency review:** Direct runtime INSERT/UPDATE/DELETE/TRUNCATE of E23 grant issuance/revoke/regrant denied under proposed offline-only role boundary (SC-40/AT-004/027/035); missing/false confirmation, blank reason, stale expectedVersion and overwritten grant-review history fail (SC-36/39/40); cross-session CSRF and lost-token reissue/restart behavior documented/tested after library choice (SC-37); verification resend invalidation/attempt limits concrete after approval (SC-38/SEC-003); partial/null/wrong audit context and revoker metadata rejected by native constraints (SC-24/40). Add controlled concurrent last-operator removal/suspension proof once its policy/serialization guard is signed; do not improvise a new lock/algorithm now.
- **Catalog assertions:** Cumulative 12 tables, stage adds 5 PKs, 3 UQs and 8 FKs; exact bytea/JSONB/bigint/timestamptz(3), no raw credential column; all listed checks/indexes and effective audit/E23 privilege boundaries. User 1:1 stream existence is tested transactionally, not falsely asserted as a reverse SQL FK.
- **Endpoint preconditions:** No endpoint is enabled merely because stage 3 exists. Require signed feature spec/actor/contract, completed RED/GREEN/security/concurrency/regression evidence, reviewed target/migration/rollback plan and separate explicit endpoint implementation/enabling authorization. Personal profile/inbox endpoints remain out of slice (their tables absent); org management remains P1. If any identity action requires notifications, revise approved slice to include inbox/outbox atomically before enabling it; stream alone is not FR-018/019 functionality.

## Effective privilege and migration safety proposal

For Stage 1 reference tables specifically, [stage1-technical-corrections.md](stage1-technical-corrections.md) supplies a PENDING runtime/owner/bootstrap/maintenance matrix: no runtime table access; future trusted offline writers only after separate authority/target/audit gates; no non-owner key/code/created_at UPDATE, DELETE/TRUNCATE or owner SET ROLE paths. Row-locking UPDATE privilege and owner/direct-SQL exceptions are explicit. No role/grant is installed or selected here.

Read-only runtime grant lookup is proposed for E23; runtime gets **no E23 INSERT/UPDATE/DELETE/TRUNCATE, owner role, grant option or alternate SECURITY DEFINER bypass**. Offline bootstrap/maintenance role alone may mutate grants under reviewed manifest, target, audit and revocation transaction. This extends the earlier audit-only role checklist as a **new unapproved privilege proposal**, not an installed permission change. Review schema/table ownership, PUBLIC privileges, role memberships, inherited/SET ROLE access, schema CREATE, function/search_path paths and default privileges; don't rely solely on direct ACL entries. Audit runtime gets INSERT plus policy-filtered SELECT, no mutation/destruction/DDL/owner paths; raw SELECT still does not enforce row scope. Database owner/superuser tampering remains outside the application append-only guarantee. [PostgreSQL 17 privileges](https://www.postgresql.org/docs/17/ddl-priv.html).

Per stage: approve isolated database and pinned prior migration state, inspect catalog without disclosing connection material, stop on unexpected objects, review generated/native SQL and checksums, freeze explicit transaction/lock/statement budgets compatible with existing one-second database bounds and bounded retries, rehearse injected failure and compatibility with old health-only app. Record backup/restore owner and isolated restoration proof before any staging/prod-like authorization. Do not assume an empty database or run schema push/reset. No grant SQL, table DDL, fixture or migration is executed here.

Separate schema installation from bootstrap and from endpoint enabling. Proposed migrations are additive; application rollback leaves tables/history intact. Rollback of an uncommitted stage and retained earlier installed stages are planned states. After acknowledged writes, disable feature and use reviewed forward fix; no automatic destructive down migration or backup restore that discards acknowledged work. Failed migration bookkeeping repair requires operator review against actual catalog and checksums; never mark an unapplied/partial stage successful to satisfy tooling. Retention/purge jobs and numeric durations remain unapproved; cleanup indexes do not authorize cleanup.

## Approved versus proposed and remaining blockers

| Scope | Verified accepted details | Proposed or blocked details |
|---|---|---|
| All 12 entities / 3 stages | None verified | Every model/scalar/native type/default/nullable field/PK/UQ/FK/CHECK/index/name and effective privilege listed above |
| Identity/scope policy | Owner preference only, not required final sign-off | C-11 source rules; D-S01/02 role/grant policy; D-S03/18 global actor/issuer/recovery/self-lockout/handover |
| Credentials/session/verification | None verified | D-S04/05 algorithms/library/normalization/lifetimes/CSRF storage/reissue/rate/channel/cookie/proxy parameters |
| Streams/audit/data enforcement | None verified | D-S11 provisioning/bounds; D-S12/13/15 audit allowlists/roles/metadata bound/synthetic handling/native object/transaction review; numeric retention stays open if no purge/pilot |
| Physical execution | None authorized | Target, actual SQL/checksum/rehearsal/lock budgets/backup recovery evidence; future RED/GREEN; explicit separate implementation and migration permissions |
| Other domain decisions | No new closures | D-S06–10/D-S14/D-S16/D-S17 remain pending for their own slices; no extra domain tables/DTOs included |

General PR #5 approval does not fill these gates. A planned stage grouping is not an accepted feature or a migration authorization. Final verdict for 03A.3: **NEEDS APPROVAL**; database implementation stays **BLOCKED**. Exact original links/reviewer requirements and evidence assessment are in [approval-record.md](approval-record.md) and [approval-verification.md](approval-verification.md).

## 03A.4 implementation authorization handoff

[identity-implementation-handoff.md](identity-implementation-handoff.md) now collects the current approval inventory (none verified), exact Stage 1 schema-only candidate, preserved 3/4/5 dependency order, 16 FK confirmation, remaining design constraints, native SQL/permission/fixture/RED/GREEN/catalog/recovery requirements and separate design/repository/SQL/endpoint authorization gates. All scalar/key/FK/check/index inventory above remains PROPOSED and unchanged; no generic review accepts it. Latest PR #6 evidence is assessed in approval-verification.md. Current verdict: NEEDS ADDITIONAL APPROVAL; no schema, migration or SQL execution authorized.
