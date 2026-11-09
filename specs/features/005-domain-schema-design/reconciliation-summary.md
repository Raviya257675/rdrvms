# Human-selected architecture reconciliation — 03A.2

Status: **PROPOSED — READY FOR HUMAN SIGN-OFF**. This verdict means the review package is prepared; implementation is **BLOCKED**. Design authorization and preferred direction are supplied by the backend/product owner's Master Prompt 03A.2 on 2026-11-09. It supplies no reviewer signatures, independent security review, supervisor/constitutional ratification, source-change approval or migration permission.

Baseline: `feature/domain-schema-design`, clean HEAD `7498ced7d5e3db1baf6a9be7e8f946083acf2e6e`. The earlier 03 package and all FR/NFR/AT, C-01–C-11, D-001–D-012, D-S01–D-S18, E01–E22, K01–K15 and SC-01–SC-34 identifiers are preserved. E23/K16 and SC-35–SC-40 extend the proposed global account-security boundary and review tests only.

## Candidate architecture

One independent user may hold REPORTER and VOLUNTEER personal roles and multiple role-specific memberships in multiple organizations. Memberships have explicit district grants within organization_districts; zero grants means zero district authority. Personal role, profile existence, organization membership and operational capability are distinct. Operational capabilities are a fixed reviewed role/action policy in services, not an extra permission-engine table. The candidate retains PostgreSQL opaque sessions, single-use digest verification, atomic audit and relational integrity plus service transactions.

Two ordinary authorization contexts address C-11:

| Context | Mandatory candidate checks | Example / boundary |
|---|---|---|
| OWNER | Current session/account, owner ID and applicable personal role; safe field allowlist | Own /auth/me, own sessions and profile. Personal inbox belongs to owner; org-linked subject requires current org/district/object checks or neutral tombstone |
| ORGANIZATION | Current session/account; explicit active org, district/mapping, membership role, membership district grant and target relationship/ownership policy | Incidents, requests, assignments, inventory and org audit. Being reporter/assigned owner does not bypass org-target rules; intake routing remains D-S06 pending |

FR-027 needs a separate named ACCOUNT_SECURITY exception. Candidate actor is an active verified account with E23 `ACCOUNT_SECURITY_MANAGE`, installed only by a reviewed human-controlled offline procedure. It may perform confirmed global suspension/personal privilege removal and minimum associated identity/audit lookup. It cannot grant roles, create organizations, delegate this capability, reactivate users or perform coordinator operations. Org administrators may remove only approved in-scope org grants, not suspend global identities. NULL org never grants scope. Sign-off must approve both the ordinary owner context and this narrow global exception before authoritative wording changes.

## Model delta and preservation

The full candidate now has **23 MVP entities**, with **six P1 entities deferred**. E01–E22 remain justified by the original requirements. E23 account_security_grants adds only FR-027 authority persistence: user/capability uniqueness, actor FKs, reviewed grant reference, revocation/status checks, no organization wildcard. Audit adds an explicit authorization_context/org consistency rule. ER, catalogue, constraints, transaction locks and local traceability reflect those changes. The next slice proposes only the 12 required identity/scope/audit entities, not all 23.

Session/verification details are centralized in [security-parameters.md](security-parameters.md): Argon2id 19 MiB / 2 iterations / parallelism 1; ≥256-bit random session token and stored digest; proposed 30-minute idle and 12-hour absolute limits. All values, library choice, CSRF design, cookie environments and verification lifetime/channel/rate limits still require explicit approval.

## Review artifacts and disposition

- [Approval record](approval-record.md): all 18 rows, original links, preferred options, deviations, exact scope, reviewer roles, blank name/date/evidence and no implementation/migration authorization.
- [Source amendments](source-amendments.md): C-01–C-11 correction matrix and exact path/section/current/proposed text, decision dependencies, reviewer/test impact and blocked status. No authoritative file changed.
- [Review handoff](review-handoff.md): supervisor, independent security, backend/product and frontend/API review sequence.
- [Identity/scope readiness](identity-scope-readiness.md): exact 12-entity slice, unsigned fields, constraints, tests, bootstrap, migration ordering and recovery gates.
- [Evidence](evidence.md): historical record plus current commands, results, scope inventory and limitations.

D-S01/02/03/04/05/12/13/15/18 have recommended reconciliations. D-S06/07/08/09/10/11/14/16/17 remain OPEN or conditionally PROPOSED; selection of the architecture does not select dependent workflow, location, taxonomy, retention or API decisions. Every row lacks final sign-off. D-001–D-012 remain OPEN in their original register.

No runtime/schema/migration/dependency/infrastructure or authoritative source changes, database operations, environment-value access, commits, pushes or deployment are authorized. Human review must reconcile the authority conflict, approve the chosen slice's exact policy and update sources before a separate implementation request and tests-first work.

## 03A.3 current approval-readiness outcome

**NEEDS APPROVAL**. [approval-verification.md](approval-verification.md) verifies generic GitHub PR #5 approval for the current commit, not acceptance of D-S options, supervisor/security roles or constitutional/source amendments. Accepted decisions/domain attributes: none verified. All decision verifications PENDING and implementation/migration authorization NOT AUTHORIZED. Original source conflicts remain unresolved.

[identity-migration-stages.md](identity-migration-stages.md) provides the detailed proposed 3/4/5 schema stages for the existing 12 entities, with exact model/scalar/constraint/index/FK/cross-stage catalog/test/recovery gates. Full 23-entity design and six deferred P1 entities unchanged. Earlier ready-for-sign-off label describes the prior delivery only; current approval readiness requires actual scoped evidence. No policy or migration is installed.

## 03A.4 current identity decision handoff

Current verdict: **NEEDS ADDITIONAL APPROVAL**. On docs/identity-architecture-signoff, PR #6 has generic approval text “Thats okay.” and no verified decision/role/amendment scope. [Approval verification](approval-verification.md#03a4-latest-identity-architecture-review-verification) reports actual reviewer/date/evidence and no accepted option for each requested decision plus C-11/FR-027. No authoritative correction applied and no approval fields filled.

[identity-implementation-handoff.md](identity-implementation-handoff.md) provides the verified approved inventory (empty), prospective first schema-only stage, physical dependency confirmation, unresolved constraints, native SQL/privilege/fixture/test/catalog/recovery plan and explicit separated authorization checklist. The 23-entity candidate, 12-entity identity slice, all 18 decision rows and all requirement/test identifiers remain preserved. This supersedes earlier delivery labels for current approval readiness only; no runtime/schema/database action authorized.
