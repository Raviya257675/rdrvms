# Tasks and review status

Design authorization: Master Prompt 03. All implementation tasks below are gated and remain unstarted.

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
