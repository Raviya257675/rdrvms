# Human approval record — all 18 decisions

**Overall status: PENDING — required sign-off evidence has not been supplied.**

The backend/product owner selected the flexible scoped architecture as a **preferred design direction** on 2026-11-09. This was permission to prepare a proposal, **not** acceptance of the 18 decisions, a delegation of supervisor authority, implementation permission, or database-execution authorization.

The original D-001–D-012 decisions in `docs/decisions/open-questions.md` remain OPEN unless individually resolved by authorized review. The existing approval-verification evidence for PRs #5, #6 and #7 contains generic review comments, not decision-specific sign-offs.

## Stage 1 — proposed independent backend development delegation

**GitHub review venue:** [Issue #8](https://github.com/Raviya257675/rdrvms/issues/8)

**Proposed scope only:** `feature/database-geography-stage1`, feature `005-domain-schema-design` and these three entities:

- E01 — `districts`
- E04 — `organizations`
- E05 — `organization_districts`

**Proposed permission:** After authorization is established and the exact Stage 1 design is accepted, the backend owner may write Prisma models and tests and generate migration SQL **offline**, within the reviewed synthetic-data, feature-branch scope. Repeated team-member signatures may be replaced for this delegated local-development scope **only if the authorized governance amendment explicitly permits that change**.

**Not included:** SQL execution, changes to shared/production databases, production deployment, protected-branch merge bypass, changes to security/privacy controls, or independent security review claims.

| Required authority | Actual reviewer | Role verification | Decision | Date | Evidence URL | Conditions |
|---|---|---|---|---|---|---|
| Authorized product/team scope authority | PENDING | PENDING | PENDING | — | — | — |
| Module-supervisor scope authority | PENDING | PENDING | PENDING | — | — | — |

**Decision evidence requirements:** Each authority must provide their own explicit decision (`APPROVED`, `REQUEST CHANGES`, or `REJECTED`), verified role, delegated scope, conditions, the reviewed document/commit, and whether the development-only governance amendment is accepted. A request from the backend owner or an ambiguous collaborator comment is **not** a grant of authority. Where team and supervisor approval are both required, both must be evidenced.

**Current delegation status: NOT GRANTED / UNVERIFIED.** Do not change this status merely because Issue #8 is open or a reviewer has said “Confirm that.”

## Stage 1 — backend-owner acceptance (only after delegation)

| Field | Value |
|---|---|
| Backend-owner identity | PENDING — enter the real name/account when signing |
| Recorded delegated authority | PENDING — link both required authorization comments |
| Reviewed schema revision | PENDING — enter the exact Git commit hash |
| Scope | E01 `districts`; E04 `organizations`; E05 `organization_districts` |
| Decisions | Stage 1 portions of D-S02 and D-S15 only |
| Reviewed fields, defaults, keys, constraints, indexes, referential actions | PENDING — verify against `entity-catalogue.md`, `identity-migration-stages.md`, `constraints-and-indexes.md` and the unaccepted 03B.0 `stage1-technical-corrections.md` |
| Decision | PENDING — `APPROVE`, `REQUEST CHANGES`, or `DEFER` after actual review |
| Decision date | PENDING |
| Evidence link | PENDING — link to the backend owner's own signed GitHub comment |
| Independent security review | NOT PERFORMED |
| Implementation authorization | NOT AUTHORIZED until delegation, design acceptance and applicable governance checks are complete |
| SQL/migration execution authorization | NOT AUTHORIZED — a separate exact-target, exact-SQL approval is required |

An actual backend-owner decision must reference the **specific reviewed commit and schema details**, not merely the three entity names. It must not claim acceptance of C-11, FR-027, session controls or any other excluded decision.

## Stage 1 — implementation and migration gates

| Gate | Current status | Evidence needed |
|---|---|---|
| Authorized product/team and module-supervisor delegation | PENDING | Explicit role-verified decisions with scope and conditions |
| Development-only governance amendment | PENDING | Approval by the relevant authority and adopted source change, if required |
| Backend-owner acceptance of exact Stage 1 schema | PENDING | Reviewed revision, D-S02/D-S15 subset, fields/FKs/checks/indexes and own sign-off |
| Local Prisma implementation and offline SQL generation | NOT AUTHORIZED | Valid delegation, recorded schema acceptance and compliance with active policy |
| Migration SQL execution | NOT AUTHORIZED | Separate reviewed SQL, verified disposable target, migration/recovery plan and explicit execution approval |
| Protected `main` merge or release | NOT AUTHORIZED BY THIS RECORD | Applicable GitHub reviews, CI, and release gates |

## Decision sign-off record

A signature covers only the accepted option, exact scope and values recorded in that row; it does not silently approve dependencies. **PROPOSED** and **PENDING** are not approvals. All evidence/name/date fields remain intentionally blank below.

| Decision | Original linked IDs / relationship | Preferred option | Deviations / exclusions / open values | Exact design approval scope | Required reviewer roles | Reviewer name(s) | Approval date | Evidence link | Approval status | Implementation authorization | Migration authorization |
|---|---|---|---|---|---|---|---|---|---|---|---|
| D-S01 | D-002; D-003; D-004 (related role/scope decisions; no original multi-role decision) | REPORTER + VOLUNTEER personal markers; separate scoped membership roles | No implicit coordinator/admin inheritance | Personal role catalogue and role-action separation only | Product + backend + independent security | | | | PROPOSED | NOT AUTHORIZED | NOT AUTHORIZED |
| D-S02 | D-004; D-002 (identity dependency) | One independent account; N:M memberships; explicit district grants; owner/org contexts | C-11 requires authoritative amendments; org-owned resources still scoped | Cardinalities, composite FKs and owner-versus-org checks; no routing choice | Product + backend + independent security + supervisor for C-11 | | | | PROPOSED | NOT AUTHORIZED | NOT AUTHORIZED |
| D-S03 | D-003; D-004; D-012 (revocation dependency; global actor absent from original register) | Org/district admins; separate E23 ACCOUNT_SECURITY_MANAGE | Global suspension/personal privilege removal only; no role addition/reactivation/delegation/ops | FR-027 actor/target boundary, minimum identity/audit access, E23 fields/constraints, C-03/C-11 amendments | Product + backend + supervisor + independent security | | | | PENDING | NOT AUTHORIZED | NOT AUTHORIZED |
| D-S04 | D-002; D-012 (related identity/session dependencies; no original hash/token policy decision) | Argon2id 19 MiB/t2/p1; single-use verification digest | Library, verification lifetime/channel/rate limits and normalization unresolved | FR-001 credential/consent/verification schema and exact parameters in security-parameters.md; no provider | Backend + product + independent security | | | | PROPOSED | NOT AUTHORIZED | NOT AUTHORIZED |
| D-S05 | D-012; D-010 (cleanup dependency) | PostgreSQL opaque digest sessions; 30m idle/12h absolute candidate | All parameters unapproved; CSRF storage/reissue must fit selected library | Token generation, expiry, rotation/revocation, cookie/env scope, origin/CSRF and auth_version policy | Backend + independent security + frontend/API for browser contract | | | | PROPOSED | NOT AUTHORIZED | NOT AUTHORIZED |
| D-S06 | D-002; D-004 | Authenticated reporter chooses approved active org/district | Routing and eligible reporter grant semantics OPEN | Intake ownership/routing and rejection of ambiguity only | Product + backend | | | | PENDING | NOT AUTHORIZED | NOT AUTHORIZED |
| D-S07 | D-005; D-007; D-010 | Verified district/type aggregates; coarse internal data; no precise MVP table | Public DTO/grid and privacy thresholds OPEN | Public location/field policy and optional P1 restricted point collection | Privacy + product + frontend/API + supervisor for privacy changes | | | | PENDING | NOT AUTHORIZED | NOT AUTHORIZED |
| D-S08 | D-004; D-006 (related reference/region decisions; no original unit/skill decision) | Normalized skills and stable units; no inferred certification/conversion | Actual vocabulary, fractional rules, bounds and eligibility OPEN | Reference data, matching rules and request_skills necessity | Product + backend | | | | PENDING | NOT AUTHORIZED | NOT AUTHORIZED |
| D-S09 | D-004 (scope dependency; no original capacity decision) | Capacity default 1; global active PENDING/ACCEPTED/IN_PROGRESS count | Upper bound, response grants and multi-volunteer workflow OPEN | Global profile locking and active-pair uniqueness; not quantity-as-slots | Product + backend + QA | | | | PENDING | NOT AUTHORIZED | NOT AUTHORIZED |
| D-S10 | D-004 (org scope dependency; no original stock decision) | P1 org-owned supplies; atomic reserve/release | Deferred; accounting/returns/request quantity policy OPEN | P1 only; no cross-org transfer or beneficiary domain | Product + backend | | | | PENDING | NOT AUTHORIZED | NOT AUTHORIZED |
| D-S11 | D-010; D-012 (session/owner access dependency) | Serialized owner stream; high-water REST recovery; inbox/outbox | Recovery API, retention floor/window and worker thresholds OPEN | FR-018–020 ordering/dedup/scope and gap behavior | Backend + QA + privacy + frontend/API | | | | PENDING | NOT AUTHORIZED | NOT AUTHORIZED |
| D-S12 | D-010; D-008 (operational role separation dependency) | Application append-only audit; separate runtime/owner/migration roles | No DBA-proof/cryptographic claim; actual grants unapproved | Audit shape/context, reader scope, effective privileges and maintenance boundary | Independent security + backend + ops | | | | PROPOSED | NOT AUTHORIZED | NOT AUTHORIZED |
| D-S13 | D-001; D-005; D-010; D-011 | Synthetic academic data only; reviewed configurable retention later | No numeric retention, purge, real-user pilot or compliance acceptance | Data classes, no automatic deletion, backup/rights review triggers; durations remain OPEN | Privacy + ops + product; qualified review before any real-user proposal | | | | PROPOSED | NOT AUTHORIZED | NOT AUTHORIZED |
| D-S14 | D-002; D-003; D-004 | C-02/C-04/C-05/C-06/C-07 candidate workflows | Reporter drafts, completion and state contracts still OPEN | Only exact actor/state/parent/closure changes signed individually | Product + supervisor + frontend/API + backend | | | | PENDING | NOT AUTHORIZED | NOT AUTHORIZED |
| D-S15 | D-004; D-012 (scope/session dependencies; no original enforcement decision) | FK/UQ/CHECK plus transaction-safe services and real PostgreSQL tests | No RLS/procedures/triggers/Preview feature silently added | Direct SQL boundary, common lock protocol, native object preservation and constraint catalogue | Backend + independent security + QA | | | | PROPOSED | NOT AUTHORIZED | NOT AUTHORIZED |
| D-S16 | D-006 (reference/API dependency; no original serialization decision) | Exact numeric(14,3); reviewed bounded JSON number or versioned decimal string | API representation remains OPEN; no chosen conversion | C-10 quantities, sequence strings and DTO bounds/versioning | Backend + frontend/API | | | | PENDING | NOT AUTHORIZED | NOT AUTHORIZED |
| D-S17 | D-010 (retention dependency; no original replay decision) | Persist small scoped digest/result; no automatic expiry | Replay window and pruning guarantees OPEN | Idempotency key scope, body binding, result reauthorization and terminal dedup | Backend + QA + privacy | | | | PENDING | NOT AUTHORIZED | NOT AUTHORIZED |
| D-S18 | D-001; D-003; D-004; D-012 | Restricted reviewed fictional offline bootstrap; no public self-grant | Global capability issuance and grant handover need separate approval; FR-006 UI stays P1 | Bootstrap actor/target manifest, E23 grant evidence, self-lockout/active-work safeguards; no runtime delegation | Product + backend + supervisor + independent security | | | | PROPOSED | NOT AUTHORIZED | NOT AUTHORIZED |

## Evidence rules and approval boundaries

Each required reviewer must provide their own name, date, exact accepted option and parameter set, deviations, and durable review link. Independent security review must be distinct from the backend owner's design preference. Supervisor approval is required for the C-11 constitutional interpretation and the proposed global FR-027 authority; amendments to authoritative sources require separately recorded authorization.

For D-S04/D-S05, either approve **all** relevant parameters in `security-parameters.md` or list precisely which remain unapproved. Verification lifetimes, delivery, rate limits, library choice, CSRF handling and development cookie behavior cannot be inferred.

Signing D-S13's synthetic-only boundary would not settle numeric retention periods. The unrelated D-S06–D-S11/D-S14/D-S16/D-S17 decisions remain pending unless reviewed in their own scope.

**Every row above currently states `NOT AUTHORIZED` for implementation and migration.** Constitutional or source amendments, reviewed feature-slice instructions, SQL review, disposable target identification, negative test evidence and independent SQL-execution authorization remain applicable as stated in the governing documents.

## Previously checked general GitHub reviews

- **03A.3:** The generic “Good” approval on PR #5 did not identify decisions or the necessary reviewer roles. See [approval-verification.md](approval-verification.md).
- **03A.4:** The generic “Thats okay” approval on PR #6 did not identify the required decision scope or security/supervisor authority. See [approval-verification.md](approval-verification.md#03a4-latest-identity-architecture-review-verification).
- **Stage 1 delegation:** The request and collaborator response in [Issue #8](https://github.com/Raviya257675/rdrvms/issues/8) have not established the required product/team and supervisor delegation; do not treat them as approvals unless the relevant authorized reviewers provide explicit decisions.

**Current verdict: BLOCKED for local Stage 1 implementation under the existing documented governance; SQL execution is separately unauthorized.** This file is a prepared approval record, not a grant of permission.

## 03B.0 technical corrections — no approval granted

[stage1-technical-corrections.md](stage1-technical-corrections.md) prepares responses to the six technical findings for E01/E04/E05 only. Exact whitespace/name handling, strict ASCII code format/C collation and vocabulary, identifier stability, reactivation consequences, district locking and effective reference-role privileges are PENDING human design/security acceptance. S1-01–S1-16 in [test-cases.md](test-cases.md) are PLANNED / NOT EXECUTED. Documentation checks cannot satisfy database or human-review gates.

The 03B.0 instruction authorizes draft-document corrections only; it supplies no delegation, exact design acceptance, reviewer identity/signature or implementation/SQL permission. All 18 D-S decision rows and evidence fields above remain unchanged. D-S02/D-S15 are not APPROVED; the proposed DEV-STAGE1 amendment is not adopted. Delegation remains NOT GRANTED / UNVERIFIED, implementation BLOCKED / NOT AUTHORIZED, SQL execution NOT AUTHORIZED and independent human security sign-off absent. Technical documentation may become READY FOR HUMAN DESIGN REVIEW without changing any of these states.
