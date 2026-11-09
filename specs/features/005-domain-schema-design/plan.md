# Design plan

Status: proposed architecture; design work authorized, implementation unapproved. Scope: feature 005 only; requirement mapping is in [traceability.csv](traceability.csv).

## Files and sequence

1. Read mandatory sources and current lifecycle/schema without loading environment settings; confirm required branch and clean baseline.
2. Audit every FR/NFR, source conflict and existing open decision. Preserve canonical requirement statuses and existing ADRs.
3. Propose the P0 entity/attribute catalogue, scoped relationships, ER diagram and justified normalization exceptions; separate P1 designs.
4. Specify integrity, indexes, Prisma/native types, locks, idempotency and crash/recovery semantics.
5. Document fictional seed strategy, migration dependency order, compatibility/rollback, planned schema tests, risks and approval gates.
6. Run existing documentation checks plus a read-only package audit for IDs, links, entity/ER coverage and required files. Record exact results; stop.

All deliverables are under `specs/features/005-domain-schema-design/`. Shared architecture, existing ADRs, API JSON, canonical CSV statuses, source code, executable schema, dependencies and infrastructure are intentionally unchanged. This avoids presenting an unapproved proposal as the shared architectural baseline. Upon sign-off, a separate reviewed documentation change must reconcile C-01 through C-11 and update architecture/API/traceability before the affected implementation slice.

## Architecture delta proposed for later approval

Express remains the only domain process, PostgreSQL the authoritative store, Prisma the repository layer, Socket.IO best effort. No new service, dependency, extension, cost or infrastructure is needed for this proposal. PostgreSQL UUID/numeric/timestamptz and checked scalar coordinates avoid a speculative geospatial extension. Domain module ownership follows identity, organizations, volunteers, incidents, relief-requests, assignments, notifications and audit.

Persistent sessions, role scope and audit privileges in this package are proposals subject to ADR-0002, security and backend approval. Precise coordinates are absent from proposed MVP storage; P1 uses a separately restricted table only after privacy approval. No authorization model or privacy policy is changed by this document.

## Failure modes to review

Cross-org/district links; concurrent suspension versus command authorization; duplicate/replayed assignments; profile-capacity changes racing work; stale requests; partial domain/audit/outbox commits; worker crashes after emit; late commits behind inbox cursors; stock overdraw/double release; invalid unit precision; audit tampering by privileged DB roles; retention versus replay/durability; migration drift and incompatible app rollback.

## Test-first boundary

This milestone changes documentation only. No runtime behavior is implemented, so no domain RED/GREEN or database test is claimed. Existing Python documentation-validator tests are executed without changing the validator. [test-cases.md](test-cases.md) specifies the future falsifiable RED cases and expected GREEN behavior. Each later approved feature must write failing real-PostgreSQL/policy tests before implementing its schema/service changes; a design review is not a substitute.

## Human gates

Resolve and sign the decisions applicable to the first feature slice, approve data collection and migration target, then explicitly authorize that implementation separately. Auth, RBAC, public location policy, session secrets/lifetimes, database role grants and retention are approval boundaries. No approval is inferred from a clean documentation check.

## 03A.2 reconciliation sequence and scope

Owner preference authorizes this design reconciliation only. Starting branch is correct and clean at 7498ced7d5e3db1baf6a9be7e8f946083acf2e6e. Update the existing 14 package files and add six review artifacts: reconciliation-summary.md, security-parameters.md, source-amendments.md, approval-record.md, review-handoff.md, identity-scope-readiness.md. Preserve all original requirement/test/decision IDs and historical evidence.

Reconcile owner/org authorization and separately gated global account-security actor; propagate E23 into catalogue/ER/constraints/transactions/traceability; propose exact source corrections without applying them; record 18 unsigned decisions and the future 12-entity identity slice; run docs validator/unit tests and a read-only structural/scope audit. No runtime behavior changes, so no artificial RED/GREEN claim; future behavioral tests remain planned. No dependency, permission, environment, migration or database changes. Primary failure modes: unsigned security parameter treated as accepted, org admin treated as global actor, owner exception applied to organizational targets, runtime audit role inheriting owner, and unsafe session revival/revocation races. Supervisor/security/source approval and separate implementation instruction remain blockers.

## 03A.3 authorized work and disposition

Starting tree clean at `5634e91512aec169d73a1398eedac68f6350562c`, required branch already checked out. Read approval/source records, verify any linked/discovered GitHub review against exact head/options/roles, and apply authoritative corrections only for independently evidenced accepted scope. No such option-specific evidence was found; authoritative sources remain unchanged. Record actual general PR review metadata separately, keep decision approval fields blank and verification PENDING.

Add approval-verification.md and identity-migration-stages.md under this feature; update local approval/readiness/migration/requirements/summary/spec/handoff/task/test/evidence cross-references. Document three schema-only stages with exact proposed field/key/FK/check/index/catalog/test/fixture/recovery gates. Preserve all 23 entities, canonical IDs/priorities/statuses and original planned test rows. No executable schema, runtime/frontend, dependency, DB, migration or authority changes. New physical object names, audit metadata size bound and runtime E23 privilege proposal are explicitly unsigned.

Run existing documentation validator and unit tests plus read-only traceability/approval/model/stage/scope audit; record exact results. This remains documentation only, not artificial runtime RED/GREEN. All later implementation requires actual decision/source approval, future behavioral RED and separate authorization.

## 03A.4 evidence-first handoff plan and disposition

User requires only the current identity documentation review branch: docs/identity-architecture-signoff, clean starting HEAD 73dc6a203ed2ba78f975dec57beb71c0c6f2ef2f. Inspect latest matching PR #6 body/reviews/metadata/conversation/inline comments before any accepted-scope edit. Record generic review as such; project role, option/parameter scope and amendment authority not verified, so no authoritative source/model/security/API correction applied.

Create identity-implementation-handoff.md and update local approval/verification/stage/spec/summary/requirements/review/task/evidence pointers only. Retain all 23 candidate entities, 12 slice models, 18 approval rows, 40 scenario assertions and canonical FR/NFR/test/status data. Handoff confirms proposed first stage and all physical dependencies, lists unapproved attributes/native objects/privileges/fixtures/TDD/catalog/recovery and separates design, repository implementation, SQL target/execution and endpoint gates. No dependency, runtime, executable schema, database, branch or external state mutation.

Run existing documentation validator/unit tests plus read-only traceability/approval/stage/scope audit, record exact commands/results. No fabricated runtime RED/GREEN or compiled Prisma/SQL proof. Final verdict follows current evidence: NEEDS ADDITIONAL APPROVAL.
