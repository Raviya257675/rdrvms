# Evidence record — current reconciliation and retained history

The section headed “Historical Master Prompt 03 evidence” below is inherited from the clean starting commit. Its earlier 14/22/34 counts and commands are historical claims, not verification performed in 03A.2. Current results and inventory will be recorded in the 03A.2 section after execution.

## Historical Master Prompt 03 evidence

# Design review evidence — 2026-11-09

Authorization: Master Prompt 03, design only. Initial branch `feature/domain-schema-design` was clean at `8cc60e99d473bb2d15c534481077a60e293f5bec` (shutdown fix and its documentation merged). No branch switch, commit, push, merge or deployment occurred.

## Scope and files

Fourteen new design files under `specs/features/005-domain-schema-design/`:

1. spec.md
2. plan.md
3. tasks.md
4. test-cases.md
5. evidence.md
6. erd.mmd
7. entity-catalogue.md
8. traceability.csv
9. requirements-audit.md
10. decisions-and-risks.md
11. constraints-and-indexes.md
12. transactions.md
13. migration-plan.md
14. approval-checklist.md

No existing tracked file was changed. Shared API/architecture/ADR/security documents and canonical traceability/test statuses remain unchanged; this proposal must be reconciled into them only after human decisions. The feature-local matrix is explicitly design traceability, not implementation evidence.

## Source and architecture review

Read AGENTS/constitution, relevant source Markdown 00–14, security/architecture/ADRs/open questions, existing domain feature specifications/plans/tests, canonical 60-requirement/78-test CSVs, OpenAPI and current backend/Prisma lifecycle source. Source audit is in requirements-audit.md. Current schema is model-free; actual database contents were not queried or inferred empty.

Cross-reference results: 22 proposed MVP entities plus six evaluated P1 entities; all 35 FRs and 25 NFRs individually mapped; 11 source conflicts and 18 new domain decisions recorded, with the 12 original open decisions preserved. All proposed decisions remain OPEN; global suspension authority and identity/org-scope interpretation are explicit implementation blockers. The design can be reviewed without implementing an unapproved exception.

Official primary references were checked for PostgreSQL 17 CHECK/locking/queue behavior and Prisma v7 constraints/index/type capabilities; supporting links are adjacent to technical statements in constraints-and-indexes.md and transactions.md. Current Prisma v7 partial-index documentation describes a Preview feature; the design does not enable it or assume current docs exactly match installed 7.10.1. Native SQL objects need later pinned-version migration/rehearsal review. No legal/standards compliance or platform security certification is claimed.

## Verification commands and results

Before writing the proposal, from the repository root:

```bash
python3 -B scripts/validate_pack.py
python3 -B -m unittest discover -s scripts -p 'test_*.py'
```

Both exited **0**: existing documentation manifest/ID/draft OpenAPI checks passed; **3 documentation-validator tests passed**.

Final design-package commands from the repository root:

```bash
python3 -B scripts/validate_pack.py
python3 -B -m unittest discover -s scripts -p 'test_*.py'
python3 -B /tmp/rdrvms-domain-design-audit.py
git diff --check
git diff --exit-code -- apps/api apps/web infra docs .specify scripts tests .github AGENTS.md
git status --short
```

All exited **0**. The existing validator passed and **3 documentation-validator tests passed**. The temporary audit harness confirmed:

- Exactly **14** design files; all **60** canonical FR/NFR rows once each, canonical priorities preserved and acceptance references drawn from the existing **78** test IDs.
- **22** MVP catalogue entities match **22** ER entity blocks; all **6** P1 entities also appear in feature-local traceability; **41** declared ER relationships reference known entity blocks.
- **11** conflicts, **18** proposed decisions, **12** existing decisions, **34** unique PLANNED schema scenarios and **28** valid local Markdown links.
- Valid CSV row shape, known requirement/test/decision identifiers, newline/trailing-whitespace checks, required branch and no changes to tracked files anywhere in the repository.

The explicit excluded-path diff was clean. `git status --short` reported only `?? specs/features/005-domain-schema-design/`. The read-only audit additionally checks the complete untracked-file set is exactly the 14 new package files. The temporary harness is outside the repository, uses Python standard-library parsing and read-only Git commands, and is not an installed dependency or committed application test. All results are local; no CI execution is claimed.

## Unexecuted work and limits

No backend unit/integration tests, typecheck, build, Prisma generation/validation, domain RED/GREEN, migration generation/application, seed, SQL query, database restart, backup/restore, load benchmark, vulnerability scan, secret scan or Mermaid renderer ran as part of this design milestone. No `.env` file or secret values were read/printed. Public documentation browsing did not involve application credentials or private data.

The existing documentation validator only checks its root manifest, canonical IDs/statuses and a shallow draft OpenAPI shape. It does not prove schema correctness, SQL validity, RBAC correctness, privacy compliance or performance. Additional structural checks cannot replace real PostgreSQL constraint/race tests or human review. Mermaid validation is structural only unless a renderer is later explicitly run; no renderer dependency is available and none was added.

All 34 schema-specific scenarios are PLANNED. This documentation-only task changes no runtime behavior, so no artificial failing application test was written or RED/GREEN claimed. Future implementation must follow TDD on an explicitly approved disposable target.

## Security, migration and final verdict

Design implications include secrets/digests in identity storage, scope checks on every protected path, global capacity transactions, redacted public data, private notifications and append-only runtime audit. The actual application has not gained permissions, tables or sensitive collection. No authentication/session/RBAC/public-location policy was installed or changed.

Migration/deployment impact now: **none**. Proposed future migrations are additive and gated per feature slice; no automatic drops, cascade deletion, resets or production-like actions are authorized. The full schema is not approved or proven by documentation checks.

Verdict: **READY FOR HUMAN DESIGN REVIEW**. Approval-checklist.md is entirely pending; implementation remains blocked on the applicable source conflicts and policy decisions and on a separate explicit implementation request. Stop at design proposal.

## Current Master Prompt 03A.2 reconciliation — 2026-11-09

This section supersedes the historical package counts/verdict for the current work. Required branch `feature/domain-schema-design` was already checked out; HEAD `7498ced7d5e3db1baf6a9be7e8f946083acf2e6e`; starting working tree clean. No branch switch, staged changes, commit, push, merge or deployment. User authorized design reconciliation only and supplied backend/product preferred architecture selection, not required sign-offs.

### Reconciled design and trace

FR-001/002/004/025/027/033/035 and NFR-007/008/010/015/017/018/019/024/025 drive the identity/scope reconciliation; all 35 FR and 25 NFR rows remain in local traceability with canonical priorities. No canonical requirement/test status is advanced. C-01–C-11 and original D-001–D-012 remain unresolved in authoritative sources. The 18-row approval record explicitly distinguishes preference from sign-off; reviewer names, approval dates and evidence links are blank, every implementation/migration authorization is NOT AUTHORIZED.

Current candidate: 23 MVP catalogue/ER entities (E01–E23), six deferred P1 entities, 44 ER relationships and a proposed 12-entity first identity/scope slice. E23 is the sole new relational entity, traced to FR-027's explicitly requested separate global account-security capability. Audit adds an explicit context/org consistency rule. Proposed security parameters are review candidates only. SC-35–SC-40 add owner/org separation, global capability denial, session/CSRF/cookie boundaries, hashing/verification, revocation races and restricted bootstrap tests; earlier SC-01–SC-34 rows are unchanged. All 40 remain PLANNED and unexecuted.

### Current changed-file inventory

Only `specs/features/005-domain-schema-design/` is changed. Fourteen existing files updated:

1. spec.md — preferred direction, two contexts/global exception, 23-entity scope, package links.
2. plan.md — 03A.2 sequence, affected files, blockers and failure modes.
3. tasks.md — completed design work and pending human/implementation gates.
4. test-cases.md — six additional planned negative/security/race cases; prior rows preserved.
5. evidence.md — retained historical record, current verification and inventory.
6. erd.mmd — E23 subject/issuer/revoker relationships and audit context.
7. entity-catalogue.md — E23 fields/cardinality/FKs/constraints/ownership; global suspension actor and audit context.
8. traceability.csv — feature-local authority/security links and E23 mapping; all canonical IDs/priorities retained.
9. requirements-audit.md — current clean baseline, C-11 preference and amendment linkage.
10. decisions-and-risks.md — recommended reconciliations and original-link/status record pointer.
11. constraints-and-indexes.md — K16, E23 indexes and explicit context/actor boundary.
12. transactions.md — grant/user lock ordering, token consumption, conditional expiry touch and global revocation.
13. migration-plan.md — gated E23 dependency and exact identity-slice reference.
14. approval-checklist.md — current 23-entity/40-case review and complete approval-record pointer.

Six new files:

15. reconciliation-summary.md — preferred candidate and deliverable map.
16. security-parameters.md — unapproved exact values, remaining library/CSRF/verification choices and DB-role boundary.
17. source-amendments.md — C-01–C-11 correction matrix; A01–A13 exact source locators/current/proposed changes, decision dependencies, reviewers, tests and blocked status.
18. approval-record.md — all 18 linked decisions, scope/deviations/review fields and separate implementation/migration status.
19. review-handoff.md — supervisor/independent security/backend/product/API/QA review responsibilities.
20. identity-scope-readiness.md — exact 12-entity candidate, no approved domain fields, constraints/tests/order/bootstrap/recovery/blockers.

### Commands executed and exact local results

From repository root:

```bash
python3 -B scripts/validate_pack.py
python3 -B -m unittest discover -s scripts -p 'test_*.py'
python3 -B /tmp/rdrvms-reconciliation-audit.py
git diff --check
git diff --exit-code -- apps/api apps/web infra docs .specify scripts tests .github AGENTS.md
```

All exited **0**. Validator output: `PASS: documentation manifest, requirement/test references and draft OpenAPI JSON validated.` It explicitly notes it does not build/execute application tests. Unittest: **Ran 3 tests; OK**. The temporary read-only structural audit confirmed:

- 60 local requirement rows, 78 known canonical test IDs; exact requirement set and priorities, valid CSV shape and known decision/acceptance references.
- 23 catalogue entries match 23 ER blocks; 44 declared relationships reference valid entities; six deferred P1 entities remain traced; exact 12-entity slice.
- 18 approval rows have blank name/date/evidence and NOT AUTHORIZED implementation/migration; original 12 decision rows and 11 conflicts preserved; C correction matrix complete.
- 40 planned local cases; all original 34 scenario rows byte-for-byte preserved; local links exist, Markdown tables have consistent widths, newline/trailing whitespace checks pass.
- Exactly 14 modified and six new files under feature 005, correct unchanged branch/HEAD, no staged/deleted/out-of-scope files. Explicit excluded-path diff and diff whitespace checks are clean.

Audit harness location `/tmp/rdrvms-reconciliation-audit.py` is temporary, not committed, with no dependency installation or database/network use. It checks structure and Git scope, not domain correctness or SQL execution. Link counts may grow with evidence links; correctness is checked against actual local targets, not a fixed historical count. No CI run/result is claimed.

### Source checks and unexecuted validation

Read mandatory repository instructions/constitution/threat model, decision register/ADRs, applicable reference documents, API JSON, canonical traceability/test catalogue, all existing feature-005 files, current model-free Prisma schema and affected feature 001–003 specs/plans/tests. Browsed primary OWASP password-storage/session-management/CSRF references cited next to claims in security-parameters.md. These are guidance for human review, not project approval, legal advice or a completed security assessment. Existing Prisma/PostgreSQL links are inherited design references; no installed library compatibility claim is made by this task.

No runtime code, Prisma schema, migration, authoritative source, dependency/lockfile, infrastructure or database state changed. No `.env` values read/printed. No SQL query, database connection, Prisma generation/validation/migration/push/reset, seed, backup/restore, backend/frontend test/build/typecheck, security scan, PostgreSQL race, session/CSRF/browser test or Mermaid rendering executed. No artificial failing runtime test or RED/GREEN result is claimed for this documentation-only change. The documentation validator is shallow; the additional audit is structural. Both leave actual policy/security/migration correctness unverified.

### Impact, open decisions and verdict

Current migration/deployment impact: **none**. Current security/privacy effect: proposal only; no live permissions, global authority, authentication/session model or data collection changed. Candidate risk areas include global-actor abuse, owner exception leaking into org targets, CSRF/digest storage compatibility, audit effective privileges and grant/session races; these require independent security review and future negative/concurrency tests.

Assumptions: synthetic academic data only, no real mail/SMS/pilot; owner preference authorizes draft reconciliation, not source amendments. Sign-offs, C-11 constitutional changes, FR-027 actor/target authority, all security parameters/library consent and the exact first-slice SQL/target/recovery/TDD plan remain blockers. Dependent workflow/public-location/taxonomy/cursor/Decimal/retention decisions remain open as recorded.

Final package verdict: **READY FOR HUMAN SIGN-OFF**. Implementation and migration readiness: **BLOCKED**. Supervisor, independent security, backend/product and frontend/API review (with QA/privacy/ops as applicable) must supply actual names/date/evidence and accepted scope before source synchronization, then separately authorize any implementation. Stop at the reconciliation package.
