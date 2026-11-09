# Tasks and review status

Design authorization: Master Prompts 03 and 03A.2 (preferred candidate reconciliation only). All implementation tasks below are gated and remain unstarted.

## Design deliverables

- [x] Confirm `feature/domain-schema-design` and clean starting tree; record baseline SHA.
- [x] Read mandatory sources and audit FR-001 through FR-035, NFR-001 through NFR-025 and BR-01 through BR-10.
- [x] Record unresolved actor/scope/state conflicts and existing D-001 through D-012.
- [x] Propose P0/P1 entities, attributes, ownership, retention classes and Mermaid relationships.
- [x] Specify native types, keys, FKs, checks, indexes, transactions, locks and failure semantics.
- [x] Propose migration/rollback/seed sequencing and schema acceptance cases.
- [x] Produce explicit approval checklist and record actual documentation verification in evidence.md.

## Human review — pending

- [ ] Product/supervisor: reconcile C-02 through C-07/C-09 and confirm P0/P1 scope.
- [ ] Backend/security: approve roles, organization/district scope, session persistence and token approach.
- [ ] Privacy owner: approve coarse/public policy, collection minimization, retention and rights process.
- [ ] Backend/QA: approve consistency, concurrency, cursor and idempotency strategies.
- [ ] Teammate/API reviewer: review response mapping, state/endpoint gaps and redacted DTOs.
- [ ] Tech lead: reconcile ADR references and approve shared-document synchronization plan.
- [ ] Named reviewers: complete approval-checklist.md with decisions, date and review evidence.

## Future implementation — NOT AUTHORIZED by this milestone

- [ ] Obtain a separate explicit implementation request for one approved feature slice.
- [ ] Synchronize approved spec/ADR/API/data docs and canonical traceability without fabricating evidence.
- [ ] Write and execute failing policy and real-PostgreSQL constraints/concurrency tests (AT-001/002/004/005/007–020/025/027; NF-004/005/007/010/022 as applicable).
- [ ] Review additive migration SQL and compatibility/recovery plan for that slice.
- [ ] Implement minimal approved schema/services, verify GREEN and refactor.
- [ ] Run appropriate types/build/contract/privacy/negative authorization checks and record exact results.
- [ ] Obtain human code/migration review. No automatic merge or deployment.

No migrations, schema generation, seeds, domain tests, authentication or APIs have been executed/implemented as part of feature 005.

## 03A.2 design reconciliation

- [x] Verify required branch/clean HEAD; preserve unmodified authoritative sources and executable schema.
- [x] Record owner-selected preference without inventing approvals, names, dates or review links.
- [x] Reconcile C-11 as proposed owner/org contexts plus separately gated global FR-027 authority.
- [x] Propagate E23, audit context and unsigned security parameters through the draft catalogue/ER/constraints/transactions/traceability.
- [x] Prepare all 18 linked decision/status rows and C-01–C-11 authoritative source amendment proposal.
- [x] Prepare supervisor/security/backend/product/API handoff and exact proposed 12-entity identity/scope slice.
- [x] Extend planned negative/session/concurrency/bootstrap cases to SC-40 without removing earlier assertions.
- [x] Record current docs validator/unit-test/structural/scope audit results in evidence.md after actual execution.
- [ ] Obtain applicable signed source/policy/constitutional/security decisions; separately authorize implementation and migrations later.

## 03A.3 approval verification and detailed stage proposal

- [x] Verify clean required branch/head and read applicable source/approval/design constraints without environment values.
- [x] Inspect GitHub PR #5/review head, account metadata, text and scope; record only observed facts, no role/signature inference.
- [x] Record per-decision verification PENDING; no accepted option or authoritative correction verified.
- [x] Prepare exact proposed 3/4/5 stage model/scalar/key/FK/check/index/fixture/catalog/test/recovery/endpoint inventory and identify blocked details.
- [x] Carry pre-sign-off consistency gaps into proposed test/privilege/migration gates without altering old scenario assertions or canonical statuses.
- [x] Record documentation validation/unit/traceability/model/stage/scope checks after actual execution.
- [ ] Required humans provide option-specific reviewer-role evidence; then separately authorize source amendments, implementation and actual migrations. None supplied by generic PR approval or this task.

## 03A.4 latest identity approvals and executable-schema handoff

- [x] Verify current docs/identity-architecture-signoff branch and clean baseline without branch/credential changes.
- [x] Read latest matching PR #6 review/body/head/role metadata, conversation and inline evidence; no decision-specific approval verified.
- [x] Report actual reviewer/date/evidence and unknown role/no accepted option/scope for D-S01/02/03/04/05/11/12/13/15/18 and C-11/FR-027; preserve blank approval fields and other open decisions.
- [x] Apply zero authoritative corrections because no required scoped approval is verified.
- [x] Prepare identity-implementation-handoff.md: approved inventory empty, exact prospective first schema stage, 3/4/5 dependencies, native SQL/permissions/fixtures/RED/GREEN/catalog/recovery and distinct authorization checklist.
- [x] Record current documentation validator/unit/traceability/dependency/scope check results after actual execution.
- [ ] Obtain required scoped human design/amendment evidence and separate implementation/test-target/SQL authorizations before later executable work. None inferred from this prompt or generic approval.
