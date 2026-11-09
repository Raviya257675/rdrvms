# Identity executable-schema handoff — Master Prompt 03A.4

Verdict: **NEEDS ADDITIONAL APPROVAL**. Prepared on `docs/identity-architecture-signoff`, starting clean HEAD `73dc6a203ed2ba78f975dec57beb71c0c6f2ef2f`. This is a gated documentation handoff, not an approved executable schema, implementation instruction or SQL execution permission. [Latest evidence verification](approval-verification.md#03a4-latest-identity-architecture-review-verification) inspected PR #6 and its review/comments. Its generic “Thats okay.” approval establishes no accepted D-S option or required project role. No approved domain model/field/constraint or source amendment is verified.

Requirements: FR-001/002/004/025/027/033/035, scope-data support for FR-006, NFR-005/007/008/010/015/017/018/019/024/025. Stream support traces FR-019/NFR-005/022; no inbox or FR-018/019 implementation is included. Retain all original FR/NFR/AT/SEC/NF, D/C/E/K and SC IDs. No runtime behavior changed, so no artificial application RED/GREEN is claimed.

## Approved inventory versus candidate inventory

**Approved domain model inventory: empty. Approved domain field/relationship/constraint/privilege inventory: empty.** “Empty” describes verified acceptance, not removal of the proposed design. The existing connectivity/readiness/shutdown baseline remains unchanged. All 23 proposed MVP entities and six deferred P1 entities are preserved; only these 12 belong to the proposed identity foundation.

The full field/native type/nullability/default/key/FK/check/index inventory is in [identity-migration-stages.md](identity-migration-stages.md), “Complete model scalar inventory”, “Primary keys, uniqueness and exact FK/relation inventory”, “Native CHECK inventory” and “Index inventory”. It is not silently accepted by this handoff.

03B.0 refines only the proposed first-unit text/collation/lifecycle details in [stage1-technical-corrections.md](stage1-technical-corrections.md). It replaces earlier generic nonblank/code-format shorthand with seven exact CHECK candidates and proposed C collation on both code columns; 18 scalar fields and PK/UQ/FK/index topology stay unchanged. The district-first reference lock protocol, explicit runtime/owner/bootstrap/maintenance matrix, immutable identifiers and S1-01–S1-16 tests are also unaccepted candidates. This is documentation work, not acceptance of DEV-STAGE1, gate completion or a change to the blocked implementation verdict.

| Stage | Exact Prisma candidate → SQL table / catalogue ID | Verified approved fields/constraints | Principal requirement justification |
|---|---|---|---|
| 1 | District → districts / E01 | NONE | NFR-007 district scope; FR-005/007/010/014 downstream geography |
| 1 | Organization → organizations / E04 | NONE | FR-004 scope; FR-006 management stays P1 |
| 1 | OrganizationDistrict → organization_districts / E05 | NONE | FR-004/007/014; NFR-007 |
| 2 | User → users / E02 | NONE | FR-001/002/004/025/027/033 |
| 2 | AccountRole → account_roles / E03 | NONE | FR-001/004/005 |
| 2 | Membership → memberships / E06 | NONE | FR-004/006/014/027 |
| 2 | MembershipDistrict → membership_districts / E07 | NONE | FR-004/006/014; NFR-007 |
| 3 | EmailVerificationToken → email_verification_tokens / E12 | NONE | FR-001 |
| 3 | Session → sessions / E13 | NONE | FR-002/004/027; NFR-008/017 |
| 3 | NotificationStream → notification_streams / E18 | NONE | FR-019; NFR-005/022; early account-provisioning dependency |
| 3 | AuditEvent → audit_events / E21 | NONE | FR-025/035; NFR-010/024 |
| 3 | AccountSecurityGrant → account_security_grants / E23 | NONE | FR-004/025/027/035; NFR-007/010 |

## Smallest migration scope and endpoint boundary

**Currently authorized implementation/migration scope: none.** The smallest proposed handoff unit within the existing proposed three-stage plan is **Stage 1 only**: District, Organization and OrganizationDistrict, their approved-in-future columns/PKs/UQs/FKs/CHECKs and reverse district index. It is schema-only, additive and empty of operational/bootstrap data. This is not a claim that three tables are the mathematical minimum DDL transaction: a single parent could be installed earlier, but that would require an explicitly reviewed revised subdivision and would not complete this stage or the identity feature.

Stage 1 candidate columns (all unapproved; complete first-unit inventory):

| Table | Exact candidate columns / PostgreSQL nullability / default |
|---|---|
| districts | id uuid NN, no DB default, server UUID; created_at timestamptz(3) NN default now(); updated_at timestamptz(3) NN default now(); version integer NN default 1; code varchar(32) NN; name varchar(100) NN; active boolean NN default true |
| organizations | id uuid NN, no DB default, server UUID; created_at timestamptz(3) NN default now(); updated_at timestamptz(3) NN default now(); version integer NN default 1; code varchar(32) NN; name varchar(160) NN; status varchar(16) NN default ACTIVE |
| organization_districts | created_at timestamptz(3) NN default now(); organization_id uuid NN; district_id uuid NN; active boolean NN default true |

First-unit keys: districts(id), organizations(id), organization_districts(organization_id,district_id) PKs; unique code on each parent; FK organization_id→organizations.id and district_id→districts.id, both UPDATE/DELETE RESTRICT; version>=1, reviewed nonblank code/name bounds and organization status in ACTIVE/INACTIVE; index (district_id,organization_id). Exact proposed mapped names are retained in the staged inventory. UUID/native type/default/NN/check/index choices still require acceptance; no new enum/extension/Preview feature is authorized.

No new endpoint is enabled after Stage 1 or Stage 2. No permanent account or grant is provisioned before Stage 3 provides mandatory audit/stream/security persistence and reviewed effective privileges. Full identity completion requires all 12 entities and signed behavioral/API gates. Deferring E18 to make an 11-table feature changes the current account-stream lifecycle; deferring E23 postpones global FR-027 behavior. Neither variation is approved here. Existing health/readiness stays connectivity-only; table presence is not domain readiness.

## Physical FK dependency confirmation

The requested **3/4/5** grouping is valid against the proposed relational catalogue. All FKs have parents in the same or an earlier stage; no reassignment is needed. This is a documentation-level dependency confirmation, not an actual PostgreSQL catalog inspection.

| Stage | Required intra-stage creation order | FK constraints added | Required prior-stage objects |
|---|---|---|---|
| 1 | districts and organizations, then organization_districts | 2: org mapping→organization; mapping→district | None |
| 2 | users, then account_roles/memberships with their unique anchors, then membership_districts | 6: personal role→user; membership subject/issuer→users and org→organization; district grant→membership(id,org) and organization_districts(org,district) | organizations, organization_districts |
| 3 | audit_events, notification_streams, email_verification_tokens, sessions, account_security_grants; all references point backward to prior-stage parents | 8: audit actor→user/org→organization; stream/token/session→user; E23 subject/issuer/revoker→users | users, organizations |

Totals: **12 PKs, 9 additional UQs, 16 FKs**, with FK counts **2/6/8**, and cumulative domain table counts **3/7/12**. Membership unique(id,org) is required for district-grant FK; unique(id,org,user) is retained as the future assignment anchor. No FK forces User→NotificationStream reverse existence; provisioning/tests enforce it. Audit target IDs are typed logical references, not FK parents in future domain tables. All FK actions and deferrability/validation settings remain proposed.

## Unresolved design constraints before schema work

| Gate | Exact unresolved boundary / required review |
|---|---|
| D-S01/D-S02 and C-11 | Personal REPORTER/VOLUNTEER role allowlist, multi-org membership/district authority, owner versus organization target checks and safe DTOs. AGENTS/constitution still require organization/object checks; signed exact amendment wording and supervisor/independent security authority missing |
| D-S03/D-S18 and FR-027 | E23 ACCOUNT_SECURITY_MANAGE actor/target scope, minimum account/audit views, offline issuer/revoker/regrant permissions, confirmation/reason/user-version rules, self-lockout/last-operator recovery and active-work handover. Organization admin role cannot substitute for global authority; no delegation/reactivation/operational inheritance approved |
| D-S04/D-S05 | Email normalization/consent/password policy, hashing library/dependency approval and Argon2id 19MiB/t2/p1 candidate; ≥256-bit credential/digest policy; idle 30m/absolute 12h, rotation/revocation/touch; cookie/env/proxy/origin and CSRF storage/reissue/library compatibility. Verification lifetime/channel/resend/invalidation/attempt/rate limits remain unspecified |
| D-S11 | Mandatory account-stream provisioning, sequence/floor bounds and retention/recovery review; first slice has no notifications/outbox. If an identity action requires notices, expand its approved persistence dependencies before enablement |
| D-S12/D-S13/D-S15 | Audit actor/context/action/target/reason allowlists, metadata size candidate (4096 bytes not approved), read scope, effective owner/runtime/bootstrap/maintenance privileges; exact native CHECK/index/FK names and reviewed service transaction/lock/time budgets. Synthetic only; no purge/retention duration or real-user pilot approved |
| Physical and delivery gates | Approved field-by-field inventory/spec/source synchronization, pinned Prisma relation/native-SQL compatibility rehearsal, isolated target/owner, exact SQL review/checksums/recovery proof, separate repository implementation and SQL execution authorizations |

Related original D-001/002/003/004/010/012 remain OPEN; the full original register is unchanged. D-S06–10/D-S14/D-S16/D-S17 remain pending for their dependent domains. No new role/parameter/purge choice is introduced by preserving these gates.

## Native SQL and database permission handoff

PostgreSQL FK/UQ/PK/default/type objects should follow the future approved Prisma mapping; row-local CHECKs and effective privilege separation need reviewed native migration SQL where the chosen schema language cannot express the invariant. Use the staged inventory for exact candidate constraint/index names and expressions, including role/status vocabulary, verified/retired user metadata, digest byte lengths, ordered timestamps, positive versions, stream floor, audit actor/context and E23 revocation consistency. This identity slice requires no assignment partial index, geospatial extension, RLS/trigger/procedure or Preview feature. None is added or selected here.

Do not substitute SQL CHECK for authentication, current account/session/role/grant/ownership, one-time token consumption, current-time expiry, allowed transitions, cross-row active references, mandatory stream provisioning or high-impact confirmation. Those require signed service contracts and transaction/concurrency tests. Preserve native objects through reviewed migration/drift handling rather than silently dropping them because an ORM does not model them.

| Proposed database role boundary | Required permissions and denial proof (all unsigned) |
|---|---|
| Runtime | No DDL/ownership/grant option or inherited/SET ROLE owner paths; only feature-required DML after review. Audit INSERT and policy-filtered SELECT only; no audit UPDATE/DELETE/TRUNCATE/ALTER. E23 lookup only, no INSERT/UPDATE/DELETE/TRUNCATE or grant/regrant bypass |
| Migration owner/operator | Separately approved DDL/native constraint/index/ownership/ACL authority for specified target, unavailable to runtime; actual credentials/role names not inspected or selected here |
| Fictional bootstrap/maintenance | Separate human-controlled reviewed target/manifest; necessary user/scope/grant/session-revocation/audit writes in the same transaction after all dependencies. No runtime self-grant path or permanent shared credential |
| Retention/backup operations | Separate approval and effective access review; no purge job/cleanup authorization inferred from expiry indexes. Audit-owner/superuser tampering remains outside append-only application guarantee |

Rehearsal must test effective privileges, PUBLIC/default ACLs, inherited/SET ROLE owner reach, schema CREATE and any function/search_path bypass; direct ACL inspection alone is insufficient. No database roles/grants or infrastructure configuration change in this task.

## Synthetic fixtures and RED/GREEN sequence

Use approved fictional org/district aliases, UUIDs and example.test account identifiers only; no real victims, live account data, household points, provider calls or committed password/token values. Stage-local constraints can be tested with rollback-only isolated rows. Committing race tests and full bootstrap use the complete disposable three-stage schema and required user/role/token/stream/audit atomicity. Reruns must not elevate/reactivate/rewrite history. Full fixture manifest includes two orgs/districts, personal multi-role account, revoked/zero-district grants, active/unverified/suspended users, E23 holder/nonholder and controlled token/session clock partitions.

| Future test phase | Required falsifiable proof and existing identifiers | Enablement condition |
|---|---|---|
| Stage 1 RED→GREEN | Duplicate codes/mapping, NULL/missing parents, blank code/name, invalid organization status and parent UPDATE/DELETE RESTRICT fail; wrong target/manifest denied. FR-004/033, AT-004/033, SEC-001/002, SC-04/05/31/40 | Approved stage/spec and disposable target first; no endpoint/bootstrap enablement |
| Stage 2 RED→GREEN | Canonical-email/membership-triple races, multi-role/org valid grants, missing issuer/subject and cross-org composite grants fail; inactive/revoked/zero-district policy denies; org admin cannot suspend global identity. AT-001/004/006/027/035, SEC-001, SC-01/04/05/35/36/40 | Preserve audit/stream provisioning; commit-dependent races only after complete Stage 3 |
| Stage 3 RED→GREEN | Atomic account/token/stream/audit rollback, exactly-one verification, strict expiry/rotation/touch/revoke/login races, missing/foreign/cross-session CSRF/origin denial and reissue behavior; owner/global target privacy; confirmation/reason/stale-version denial; E23 SQL grant/regrant denied to runtime; partial actor/context/revoker metadata invalid; audit tampering denied; reviewed concurrent last-operator invariant. AT-001/002/004/025/027/033/035, SEC-001/002/003, SC-01/02/03/24/25/31/32/35–40 | Exact security/actor/role/native object policies signed, reviewed runtime/bootstrap roles, no raw secret output |
| Regression / compatibility | Native catalog/drift assertions, old health-only app compatibility, bounded readiness/shutdown and restart durability; secret/DTO/log minimization; isolated restore rehearsal. NF-005/007/008/010/017/018/019/024/025, SC-30/32/34 | Real captured command/target/migration/RED/GREEN evidence; no passing status from docs validation |

Write behavioral failing tests before future schema/service implementation, capture exact RED, implement minimally then GREEN and refactor without weakening/skipping assertions. No new test/coverage/CI/security-assessment result is claimed. The 40 existing scenario rows remain unchanged; full stage-specific planned partitions are in test-cases.md and identity-migration-stages.md.

## SQL catalog assertions and rehearsal/recovery

Future isolated catalog checks must assert expected schema/table/column names, native types/typmods (including timestamptz(3)), nullability/defaults, ordered PK/UQ/FK keys and parent anchors, CHECK definitions, FK RESTRICT actions/validation/deferrability, index order/direction/uniqueness/predicates/validity and effective owners/ACL/role inheritance. Compare exact reviewed inventory, not just object counts or Prisma validation. Stage totals 3→7→12 tables and 2→8→16 FKs exclude approved pre-existing objects and Prisma migration metadata; stop on unexpected state/collision/drift, never assume the real target is empty. No actual catalog was queried here.

Before a later authorized rehearsal: approve disposable target/credentials handling, known prior schema/migration hashes, complete generated plus native SQL, exact lock/statement/transaction/retry budgets compatible with current bounded connectivity, role separation, operator and rollback decision point. Rehearse clean install and prior-known upgrade, injected failure/rollback per stage, retained earlier-stage state, catalog/role checks, full bootstrap/rerun safety and old/new app compatibility. Pinned-version Prisma validate/generate/migration execution are future authorized work, not performed in this documentation handoff.

Before any staging/prod-like SQL action obtain the separately approved target/operator/SQL/checksum/backup/recovery record and isolated restore evidence. For additive app rollback retain installed tables/history and disable affected feature; after acknowledged writes prefer reviewed forward fix. No automatic DROP/down/reset, fake migration repair or restore discarding later writes. Recovery/restore/cleanup remains separately governed, never implicit in design approval.

## Implementation authorization checklist

These gates are distinct. “Approve design” does not authorize editing executable Prisma, generating migrations, running tests against a database or executing SQL. Authorize exactly the later activity/target; no check is completed merely by a generic PR review. TDD RED is required before future implementation and must be captured during an expressly authorized test phase; final GREEN/rehearsal evidence follows implementation rather than being fabricated as a prerequisite already met.

| Gate | Required concrete record / deliverable | Current state |
|---|---|---|
| A — Design | Per-decision actual reviewer/project role, accepted option/deviations, date, head/version, durable link, exact fields/constraints/policy scope; supervisor/security/constitutional approvals where required | PENDING |
| B — Authoritative synchronization | Specifically authorized AGENTS/constitution amendments if applicable; approved SRS/RBAC/ADR/architecture/security/API/spec/test/traceability changes; unresolved decisions retained | PENDING; none applied |
| C — Repository implementation | Explicit later instruction for exactly one approved slice and allowed files, pinned Prisma/dependency consent, test plan and restrictions. Stage 1 candidate boundary is the three listed tables with no runtime endpoints/bootstrap | NOT AUTHORIZED |
| D — Test/migration generation target | Explicit isolated disposable target and safe test lifecycle; reviewed planned schema/native object inventory, fixture policy, approved role/credential handling, lock budgets; record behavioral RED before minimal GREEN | NOT AUTHORIZED; RED not run |
| E — SQL execution | Separately approved exact SQL/checksum, target, operator, effective privileges, backup/recovery/rollback decision point, allowed data actions and environment | NOT AUTHORIZED |
| F — Completion/enabling | Captured GREEN/negative/concurrency/catalog/drift/compatibility/recovery results, code/SQL review, complete audit/stream dependencies, explicit endpoint/deploy authorization as applicable | NOT VERIFIED / NOT AUTHORIZED |

No production-like migration, runtime implementation, public alert or external contact begins from this file. Current first-safe handoff is reviewable but **NEEDS ADDITIONAL APPROVAL**. [Evidence](evidence.md) records actual documentation checks and changed-file inventory; they do not satisfy A–F.
