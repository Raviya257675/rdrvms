# Smallest proposed identity-and-scope schema slice

Status: **BLOCKED FOR IMPLEMENTATION / PROPOSED FOR REVIEW**. This defines one future slice, not a migration instruction. Trace: FR-001/002/004/025/027/033/035; NFR-007/008/010/015/017/018/019/024/025; AT-001/002/004/025/027/033/035, SEC-001/002/003, NF-007/008/010/017/018/024/025. C-11 source reconciliation and the separate FR-027 actor approval are mandatory. FR-006 UI remains P1; P0 scope fixtures do not implement it.

## Observable boundary and exact entities

Candidate first schema slice is the smallest **12-entity** set that preserves the existing account/stream provisioning invariant and models selected identity, scope, restricted global authority and required audit. It installs no incidents, requests, assignments, profile/skill/unit domain, inventory, notifications/outbox or provider integration. It claims no FR-018/019 feature. No registration/suspension notification is emitted by this slice; if a signed requirement mandates one, add stream/inbox/outbox dependencies in the revised slice before enabling that behavior. Full authentication handlers and FR-027 behavior need their own signed feature spec/TDD/API readiness; merely creating these tables cannot satisfy those requirements.

| Entity (existing catalogue ID) | Exact required fields / relationships (all proposed) | Current approval state |
|---|---|---|
| districts E01 | M base; code/name/active; code unique | No domain field approved; fictional code list pending |
| organizations E04 | M; code/name/status; code unique | No fields or provisioning actor approved |
| users E02 | M; email_normalized/password_hash/display_name/status/email_verified_at/consent_version/consent_accepted_at/auth_version/retired_at | Owner preference selects independent identity only; normalization/consent/password/status/retirement policy unsigned |
| account_roles E03 | B; user_id→users, role; composite PK(user_id,role); REPORTER/VOLUNTEER only | Candidate multi-role direction selected; registration default/allowlist and removal policy unsigned |
| organization_districts E05 | B; org/district FKs, active; composite PK(org,district) | N:M candidate selected; actual operating grants unsigned |
| memberships E06 | M; user/org/granted_by FKs; role/status/revoked_at; unique user/org/role; composite anchors id/org and id/org/user | Candidate selected; grant authority, delegate boundaries/handover/self-lockout unsigned |
| membership_districts E07 | B; membership/org/district/active; PK(membership,district); composite membership/org and org/district FKs | Explicit scope candidate selected; grant rules unsigned |
| email_verification_tokens E12 | A; user FK, unique token_hash, email_normalized, expires_at, consumed_at | Digest direction selected; exact token lifetime/channel/rate policy unsigned |
| sessions E13 | A; user FK, unique token_hash, user_auth_version, csrf_secret_hash, last_seen_at, expires_at, absolute_expires_at, revoked_at | Opaque PostgreSQL direction selected; exact values/library/cookie/CSRF storage unsigned |
| notification_streams E18 | recipient PK/FK users, last_sequence, retention_floor, updated_at | Required by current candidate account provisioning; ordering/retention is D-S11 pending even with no inbox yet |
| audit_events E21 | A immutable; actor_kind/id, organization_id, authorization_context, target_type/id, action/request_id/reason_code, metadata_version/metadata | Metadata-safe audit required by source; exact shape/read authority/DB-role grants unsigned |
| account_security_grants E23 | M; user FK, fixed capability, status, granted_by/revoked_by FKs, review_reference/reason_code/revoked_at; unique(user,capability) | Entire global exception requires supervisor + independent security approval; preference is not authority |

M/A/B bases, types, bounds, defaults and FK delete/update actions are exactly those in entity-catalogue.md, including version>=1 and UTC timestamptz(3). This table does not authorize inventing optional profile fields or opaque session_data. D-S11 stream approval is an additional dependency of this 12-entity version; removing the stream to make an 11-entity alternative requires an explicit revised account lifecycle and review, not silent omission.

**Approved versus unapproved:** The implemented connectivity-only Prisma schema/readiness/shutdown baseline is existing behavior, unaffected. No proposed domain entity, attribute, relationship, auth/RBAC policy, database-role privilege or numeric security parameter has recorded implementation approval. The owner selected the architecture and authorized design preparation only. Therefore no row above is “approved for migration.”

## Proposed database enforcement

- PK/FK/UQ constraints for every row above; all FK UPDATE/DELETE actions RESTRICT. users.email_normalized and reference codes unique; account_roles PK; membership unique triple and non-partial composite anchors; grant bridge composite FKs prevent cross-org linking. No nullable organization membership or global role in account_roles.
- Row-local enum/constant checks, nonblank approved text bounds, positive versions/auth_version, ACTIVE→verified timestamp implication, retirement marker consistency, membership revocation timestamp consistency. E23 fixed ACCOUNT_SECURITY_MANAGE, status/revoker/time agreement, reviewed reference/reason required. An org Administrator row cannot be mistaken for E23.
- Session/token bytea digests length 32 and unique; created_at<expires_at for verification, consumed_at null or >=created_at; session created_at<=expires_at<=absolute_expires_at, last_seen_at>=created_at and revoked_at ordering. Service enforces current-time expiry/single-use/current-email/status/auth_version; CHECK does not enforce clocks or other rows.
- Stream 0<=retention_floor<=last_sequence. Audit actor-kind/actor FK, context/org consistency, required target/action/request/time and bounded object metadata; exact allowlisted actions and reason policy enforced server-side. Runtime audit INSERT/authorized SELECT only under reviewed effective-role separation; no UPDATE/DELETE/TRUNCATE, owner membership or DDL privileges.
- Required indexes: PK/UQ lookup paths; reverse district/org mapping; org-role-status-user membership lookup; district/org/membership grant lookup; token user/created_at; session user/revoked/expiry; audit target/org/request/actor; E23 issuer/revoker FKs. Cleanup indexes do not authorize cleanup. Complete covering FK-index inventory and names at DDL review, no Preview feature/extension required.

FKs prove row relationships, not actor authority. Current user/session, handler context, owner or current scoped grant and target policy must all pass. Global security command also checks active exact E23 grant and cannot grant itself authority, create orgs or perform operational work. Any direct privileged SQL path remains explicitly reviewed.

## Future RED tests and session checks

Run on a specifically authorized disposable PostgreSQL 17 target, never the readiness connection by assumption. Capture behavioral RED before implementing constraints/services and GREEN afterward; mocks cannot prove database races. All cases are PLANNED.

| Future proof | Existing trace / local scenarios | Required negative / race assertions |
|---|---|---|
| Independent identity and consent | AT-001; SC-01/02/38 | Duplicate canonical-email race has one winner; no privileged input accepted; consent stored; raw password/token/digest absent from response/log; unverified account cannot obtain privileged access |
| Two contexts and role boundaries | AT-004, SEC-001; SC-04/05/35 | Owner may access self without org; other owner denied; org resource without exact org/district/grant denied; multiple roles do not inherit; revoked/zero-district grants confer no scope |
| Global actor conflict | AT-027/035; SC-36/39/40 | Org Administrator denied global suspension; E23 holder denied org verification/assignments unless separately scoped; no global self-grant/delegation/reactivation; confirmed reasoned target command required |
| Verification atomicity | AT-001; SC-02/38 | Simultaneous consumers of one token: one success; expired/consumed/wrong-email token fails; distinct tokens cannot duplicate already-completed activation; rollback leaves no partial activation |
| Session expiry and fixation | AT-002/027; SC-03/37/39 | Boundary at 30m/12h as signed values; invalid digest/session UUID rejected; auth rotates chosen token; old token unusable; logout/revoke terminal; conditional touch cannot revive or extend absolute deadline; delayed login rechecks changed credentials/status |
| CSRF and browser scope | AT-002/004, SEC-003; SC-37 | Missing/wrong token, foreign/null origin, missing headers under reviewed fallback, pre-auth login CSRF rejected; trusted proxy/origin fixed; HttpOnly/Lax/host-only/path/Secure policy checked under local HTTP vs HTTPS; no credentialed wildcard CORS |
| Grant revocation races | AT-004/027; SC-25/39 | Sorted user→grant locks serialize mutation/rotation/touch with role/district/global capability removal; committed revoke invalidates subsequent REST/socket validation; no success side effects on loser |
| Audit role separation | AT-025/035, NF-010; SC-24 | Real runtime role cannot UPDATE/DELETE/TRUNCATE/ALTER audit, inherit owner or grant privileges; mandatory audit failure rolls back command; restricted audit read cannot use null org to browse all |
| Fictional bootstrap and repeatability | AT-033, SEC-002; SC-31/40 | Unrecognized/non-disposable target fails before writes; manifest contains no real PII/secrets; no public admin grant; rerun cannot reactivate/escalate/overwrite active records; bootstrap failure rolls back privilege/audit set |

The table covers future schema and service tests; executing none now is intentional. Socket checks and existing readiness/shutdown regression checks belong to future handler integration, not proof supplied by a migration-only test.

## Migration dependency order after approvals only

1. Freeze signed slice/spec, source amendments, exact field/constraint/index names, hashing/CSRF library approval, actor/grant matrix and fixture manifest. Approve target/isolation, SQL reviewer, backup/recovery ownership and test plan; no actual operator identity is invented here.
2. Read only target catalog/migration metadata with an approved credential-safe procedure later. Stop on unexpected objects/ownership or drift; do not assume the actual database is empty because Prisma has no models.
3. In a reviewed additive migration create districts and organizations; users; account_roles and organization_districts; memberships and its composite unique anchors; membership_districts; token/session tables and notification_streams; audit_events including context checks; account_security_grants after users. Build all required FK/UQ/CHECK/index objects. No E23 grant exists merely because the table exists.
4. Review/apply native audit-role privilege separation through approved operator-only changes; runtime receives no owner credentials. Verify effective privileges as runtime and separately as reviewed migration owner. Do not silently change infrastructure configuration to supply roles.
5. Rehearse blank isolated creation and known prior-schema additive upgrade, inspect PG catalog invariants, run invalid direct writes and controlled races, compare generated/native object preservation with pinned Prisma configuration. Old connectivity-only app remains compatible; domain endpoints remain unavailable until their own signed implementation.
6. Human-controlled fictional bootstrap only after schema/privilege checks and explicit manifest/target approval; run policy/fixture regressions, capture migration checksum and exact evidence. Any runtime handler enabling, deployment or migration to staging/prod-like requires a separate approved action.

## Bootstrap and recovery

Precreate an explicitly reviewed fictional operator account without using a public role selector; identity status/verification follows the approved fictional verification channel, never a general bypass. Operator reference must exist before granted_by FKs. In a reviewed transaction seed only allowlisted fictional organizations/districts, memberships/district grants and any separately approved E23 grant with review_reference/reason and audit. Initial self-issued offline grant is allowed only if the signed bootstrap policy explicitly says so. Do not mark a future operator or named human approved in this package.

The offline process has separate execution authority; the capability cannot reissue/delegate itself. No embedded passwords/tokens, provider calls, live records or automatic seeds on process startup. Use locally supplied ephemeral credentials with reviewed hashing and no output. Reruns must not modify existing authority/status/audit; fail safe and request human-directed reconciliation for drift. Last-operator/self-lockout, emergency recovery and active-work handover must be signed; until then block such changes.

Migration review must examine generated plus native SQL, effective role ownership/inheritance, name collisions, lock budgets, backup/restore evidence, prior/new app compatibility and forward fix. Additive app rollback leaves tables/history in place. No destructive down migration, table drop, reset or restore of acknowledged work as an automatic rollback. A reviewed forward fix or feature disable is preferred; recovery/restore requires human authority and isolated rehearsal. Numeric purge/retention schedules remain unsigned and no cleanup job is installed.

## Specific blocking decisions

- C-11: A01/A02 constitutional and agent-rule amendments and A03/A04 source matrix need supervisor + independent security + product/backend approval; original authority wording currently forbids treating owner resources as an exception.
- D-S03/D-S18: exact FR-027 actor/capability/target limits, issuance, self-lockout/recovery/handover and minimum account/audit views need supervisor/independent security approval. Org membership cannot substitute.
- D-S01/02: personal-role registration allowlist, membership/district grant authority and two-context policy need signed source alignment. FR-006 organization creation/provisioning authority stays OPEN and no management API is part of this slice.
- D-S04/D-S05: hashing dependency/library consent, all security-parameters.md values, email normalization/verification lifetime/delivery/rate limits, CSRF storage/reissue compatibility and cookie development policy need explicit approval.
- D-S11: account stream provisioning field/retention semantics required by this 12-entity slice need approval; this does not approve the future inbox/API design as implemented.
- D-S12/13/15: audit schema/actions/read scope and runtime/owner privilege separation; synthetic data classification and test artifact handling; exact native constraints and direct-write boundary need review. Numeric long-term retention/purge may remain open only if no purge/pilot occurs; do not infer retention approval.
- Exact physical migration plan/SQL, isolated target, TDD evidence, safe fixtures/recovery and separate implementation request are absent. Current schema and all database state remain untouched.

Other D-S06/07/08/09/10/14/16/17 choices block their dependent domain slices and are not silently closed by identity readiness. No migration or runtime implementation begins from this document.

## 03A.3 staging and evidence clarification

The detailed proposal is [identity-migration-stages.md](identity-migration-stages.md): Stage 1 has three reference/scope tables, Stage 2 four identity/membership tables, Stage 3 five token/session/stream/audit/global-grant tables. Its scalar/model/FK/native-check/index tables make the physical proposal reviewable; no executable schema exists. Earlier ordering above remains a dependency guide, not a requirement to install all 12 in one migration.

“Smallest 12-entity set” is conditional on retaining the current full identity/scope/global-actor and mandatory account-stream provisioning proposal; it is not a proof of the minimum first DDL transaction. Smaller schema-only stages are possible with all new endpoints and permanent bootstrap disabled. An 11-entity alternative omitting streams requires an explicit lifecycle amendment. This clarification accepts no new scope or policy.

No option-specific approval is verified in [approval-verification.md](approval-verification.md). All 18 decision verifications remain PENDING; fields, C-11 and global authority remain blocked. The general GitHub review is not a supervisor/security or parameter sign-off.
