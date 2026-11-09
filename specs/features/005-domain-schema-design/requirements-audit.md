# Requirements and source audit

Status: PROPOSED. Reconciled under Master Prompt 03A.2 from clean branch `feature/domain-schema-design`, HEAD `7498ced7d5e3db1baf6a9be7e8f946083acf2e6e`. Historical local baseline: `8cc60e99d473bb2d15c534481077a60e293f5bec`, branch `feature/domain-schema-design`, initially clean. This document records evidence and questions; it does not amend source authority.

## 03B.0 current Stage 1 correction scope

Prepared on `feature/database-geography-stage1` at HEAD `c9969c3d048446961445f1ef781e57bff487a4b6`, with pre-existing local approval-record and development-proposal changes preserved. Authorization covers proposed design documentation only for E01/E04/E05. [stage1-technical-corrections.md](stage1-technical-corrections.md) and S1-01–S1-16 in [test-cases.md](test-cases.md) fill whitespace/code, concurrency, privilege, identifier and negative-test gaps; all new product/security policy choices remain PENDING. No requirements/governance/auth/RBAC source is amended.

FR-004/AT-004 and NFR-007/NF-007 are supported by exact reference relationships, actor-versus-FK separation and proposed retirement/permission tests; these tables do not implement authentication or protected endpoints. FR-033/AT-033 covers fictional manifests/allowed pairs and wrong-target/rerun guards, with bootstrap still deferred. NFR-017/NF-017/SEC-002 retains synthetic-only and no-secret evidence handling; no scan is claimed. NFR-019/NF-019 traces normalized keys, explicit native-object preservation and modular ownership. Feature-local traceability is refined for these five rows only; canonical IDs/priorities/statuses, original SC cases and approval rows are unchanged. Delegation is NOT GRANTED / UNVERIFIED and implementation/SQL remain NOT AUTHORIZED.

## Sources cross-referenced

All paths below are repository-root relative.

| Source | Design use |
|---|---|
| `AGENTS.md`; `.specify/memory/constitution.md` | Human authority, scoped access, TDD, no secrets, no autonomous migrations/deployments |
| `docs/reference/markdown/00_Master_Index.md` | Source authority and governance; historical “no implementation” statement is superseded by the current repository state |
| `01_Product_Requirements_PRD.md` | P0 journey, inventory/maps/uploads P1, exports P2; final request closure by coordinator |
| `02_SRS_Functional_Nonfunctional.md` | All 35 FRs, 25 NFRs and BR-01 through BR-10; normative requirement IDs |
| `03_Use_Cases_UX_RBAC.md` | Role/object matrix, multi-role implications, organization and region boundary |
| `04_Architecture_HLD.md`; `docs/architecture/architecture.md`, `container-view.mmd`, `er-model.mmd`, ADR files | Modular monolith, durable inbox/outbox, preliminary relationships; ADR numbering conflict below |
| `05_Detailed_Design_LLD_API.md`; `docs/api/openapi.json`, `docs/api/README.md` | UUIDs, UTC, state enums, versions, command retry and list contracts; API is draft except health |
| `06_Data_Model_Governance.md` | Existing relational inventory, unique membership triple, quantities, confidentiality, migration/retention discipline |
| `07_Security_Privacy_Threat_Model.md`; `docs/security/*.md` | Scope, minimization, append-only application audit, public coarse-only policy |
| `08_TDD_Test_Strategy.md`; `09_Detailed_Test_Cases.md`; `docs/testing/test-strategy.md` | Actual-PostgreSQL race tests, fixture isolation, AT/NF/SEC/OPS cases |
| `10_DevOps_CICD_Platform.md`; `13_Operations_SRE_Runbooks.md`; `14_Release_Readiness.md` | Compatibility, protected releases, rollback/forward fix, backup and signed review |
| `11_Agentic_SDD_Playbook.md`; `12_Roadmap_Backlog_Risks.md` | Design-first gates, P0 priorities, owner roles and traceability |
| `docs/decisions/open-questions.md`; `docs/architecture/adr/0001` through `0004` files | D-001 through D-012 remain OPEN; ADRs PROPOSED |
| `docs/requirements/traceability.csv`; `tests/test-catalog.csv`; `specs/features/001-auth/`, `002-incidents/`, `003-assignments/` | Existing requirement/test IDs and unapproved domain feature plans |
| `specs/features/000-backend-foundation/`, `004-database-readiness/`; `apps/api/prisma/schema.prisma`, Prisma config and backend source | Model-free schema; one lazy client/pool, SELECT-only readiness, sanitized errors and bounded shutdown |

The numbered Word-derived files in this table are all inside `docs/reference/markdown/`. Their initial draft status is preserved. The constitutional ratification and existing ADR approvals are still pending; the user's authorization permits this design proposal only.

## Conflicts needing human reconciliation

| ID | Evidence and conflict | Proposed interpretation for this document only | Approval and implementation effect |
|---|---|---|---|
| C-01 | HLD §Architecture decision register calls ADR-0002 SPA, ADR-0003 Express and ADR-0004 PostgreSQL; actual ADR files use 0002 sessions, 0003 inbox/outbox, 0004 Compose | Reference actual ADR filenames by title; do not reuse numbers for new decisions | Tech lead reconciles HLD cross-references in a separately reviewed edit |
| C-02 | FR-011 says request creation links a verified incident; PRD asks whether earlier drafts are allowed; use-case matrix gives reporter an own-draft entitlement; OpenAPI POST requests says Coordinator | Propose coordinator-only creation after verification; preserve DRAFT for coordinator preparation | Product/supervisor must accept or revise reporter-draft behavior; API/spec amendments before implementation, not here |
| C-03 | FR-008 and use-case matrix allow admin verification; BR-01 says only authorized coordinators; OpenAPI verify says Coordinator | Propose scoped coordinator verification; admin role alone does not imply verifier authority | Product/security choose explicit admin capability and district/global reach; no implicit role inheritance |
| C-04 | BR-02 says VERIFIED and active; incident states distinguish VERIFIED from ACTIVE; assignment pseudocode requires VERIFIED | Propose eligible incident set `{VERIFIED, ACTIVE}`, excluding rejected/resolved; verification decision retained independently in verifier fields | Product/backend approve exact guards for create, approve and assign |
| C-05 | Use-case state sketch mentions administrative incident cancellation; OpenAPI Incident enum has no CANCELLED | Do not add incident CANCELLED in MVP; no reopening or deletion transition | Requires explicit state/API revision if selected |
| C-06 | PRD journey says volunteer progress then coordinator confirms completion; API permits assigned volunteer/coord completion and has no start/progress operation | Propose volunteer completion, followed by separate coordinator request fulfillment; require explicit progress endpoint/contract before implementation | Product/teammate/API reviewer resolve confirmation and endpoint gap |
| C-07 | LLD assignment pseudocode permits only APPROVED requests; request lifecycle moves to IN_PROGRESS once accepted | Propose further assignments allowed on APPROVED or IN_PROGRESS requests, subject to capacity and eligibility | Product approves or selects single-volunteer request restriction; quantity does not implicitly mean volunteer slots |
| C-08 | LLD says all resources have id/createdAt/updatedAt; data inventory uses user_id as profile PK and append-only audit events | Natural-key internal bridges/stream/profile and immutable audit timestamps are explicit exceptions; public resources keep UUID IDs | Backend/API review; no duplicate synthetic IDs for internal joins merely to imitate DTOs |
| C-09 | Roadmap labels US-017 including suspension P1; SRS FR-027 is P0 | Preserve SRS P0 suspension/revocation in proposed MVP | Product confirms priority; no silent deferral |
| C-10 | OpenAPI uses JSON numeric quantity; native Decimal serializes differently and some workflow endpoints omit schemas/reasons/version bounds | Keep database exact decimal; define bounded numeric API conversion after contract review, or propose a versioned decimal-string contract | No existing API edited; see type mapping and D-S16 |
| C-11 | AGENTS requires organization evaluation for every protected resource; SRS/API also describe global own-account sessions/profiles and personal notifications without an org context | Propose explicit owner-bound identity context and current org checks whenever an org-scoped target exists; NULL org is never a wildcard | Human/security review must approve this interpretation or require org-bound personal resources. Owner selected the two-context candidate in 03A.2; global account-security E23 is a separate explicitly reviewed exception. Exact AGENTS/constitution/SRS amendments are in source-amendments.md. Neither exception is authorized by this proposal; affected handlers remain blocked until sign-off and source synchronization |

No conflict is declared resolved. “Propose” identifies the model being evaluated, not a replacement for human review.

## Requirement coverage and phase audit

[traceability.csv](traceability.csv) has one row for each canonical FR/NFR, including explicitly non-database requirements. All P0 data requirements have a proposed entity/transaction and existing AT case. P1 inventory, restricted maps, uploads, reset and data-rights records are evaluated separately. No P1 management interface is required merely to bootstrap P0 scope data; reviewed fictional fixtures can supply organizations and grants until FR-006 is implemented.

BR coverage: BR-01→verification guard/audit; BR-02→parent incident lock; BR-03→quantity checks/atomic reserve; BR-04→assignment ownership; BR-05→transactional audit/inbox/outbox; BR-06→version predicates; BR-07→public DTO allowlist; BR-08→reason and audit history; BR-09→user/membership checks, sessions and socket invalidation; BR-10→no external authority/integration assumed.

Database-related NFRs cover performance/latency and query bounds (001/002/025), availability/durability/recovery (003/005/013/023), concurrent integrity/idempotency (004/022), scope/privacy/secrets/audit (007–010/017/024), testability/contracts/maintainability (015/018/019), observability (016), localization of reference codes (020) and replica considerations (021). NFR-006/008/014 include important delivery/security responsibilities outside schema. NFR-011/012 remain frontend/browser responsibilities with safe API impacts, not reasons to invent tables.

## Gaps without invented product requirements

There is no approved org selection/routing rule for a public reporter, district-admin hierarchy, skill taxonomy, fractional unit list, request fulfillment computation, assignment timeout, session duration, legal retention schedule or exact public coordinate granularity. Each is a pending decision. No survivor table, beneficiary household identifier, medical details, government feed, automatic risk scoring, SMS/email service or monetary donation record is implied.

Threat IDs differ between the short `docs/security/threat-model.md` and Word-derived document 07. Refer to path plus threat description, not a bare T-number that could identify a different threat. This package assesses design implications; it is not a completed security assessment.

The full C-01 through C-11 correction/disposition matrix is in [source-amendments.md](source-amendments.md). FR-027 conflicts with UC-08 and broad Administrator matrix cells: org/district membership cannot authorize suspension of a cross-org identity. E23 is a proposed restricted actor capability, not a resolved source conflict. All requirement and decision identifiers remain stable.

## 03A.3 approval/source application audit

Current check baseline: clean HEAD `5634e91512aec169d73a1398eedac68f6350562c`, required branch unchanged. [approval-verification.md](approval-verification.md) records the discovered PR #5/review URL, exact review text, timestamp, account metadata and reviewed head. Generic APPROVED review text “Good” identifies no D-S option/required-role/source-amendment scope. No accepted decision or approved domain attribute was verified. All C-01–C-11 remain unresolved in authoritative sources, including the actual HLD cross-reference discrepancy; no permission or constitutional exception is inferred.

[identity-migration-stages.md](identity-migration-stages.md) retains the exact 12 entities in FK-valid 3/4/5 stages, with 16 proposed FKs and the original 23-entity model unchanged. Stage fields/constraints/privileges, numeric parameters and endpoint contracts remain proposed. All canonical requirement/test/decision IDs and statuses are preserved; local stage traceability is design responsibility, not implementation proof. Verdict: NEEDS APPROVAL.

## 03A.4 current identity-architecture branch audit

Work began clean on docs/identity-architecture-signoff at `73dc6a203ed2ba78f975dec57beb71c0c6f2ef2f`; no branch change. [Latest evidence verification](approval-verification.md#03a4-latest-identity-architecture-review-verification) inspects matching PR #6/review 5829731967, text “Thats okay.”, with no decision-specific acceptance or required-role evidence; discussion/inline comments empty. No C-11/FR-027/parameter/source amendment was approved by inference. C-01–C-11, original D-001–D-012 and all canonical IDs/statuses remain unchanged.

[identity-implementation-handoff.md](identity-implementation-handoff.md) confirms the proposed 12 models in 3/4/5 stages and 16 same-or-earlier-stage FKs. Verified accepted model/field/constraint inventory is empty; current implementation/SQL authorization is none. Stage 1's three empty schema tables are a prospective bounded implementation unit after explicit approval, not an enabled identity feature. All earlier stage constraints remain unsigned. Verdict: NEEDS ADDITIONAL APPROVAL.
