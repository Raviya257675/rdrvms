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
