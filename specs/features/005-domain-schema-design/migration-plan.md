# Migration, fictional fixtures and compatibility design

Status: PROPOSED PLAN ONLY. No migration files were generated, no Prisma command or seed ran, and no database connection was opened for this milestone.

## Current baseline and preconditions for later work

The executable schema is connectivity-only, with a generator and PostgreSQL datasource and no models. That does not prove the actual database has no unrelated data/tables. Do not assume it is empty, baseline an unknown database, reset it or reuse the current connection for mutating tests. Existing health/readiness/shutdown behavior is independent of domain tables.

Before any implementation, obtain explicit authorization for one approved feature slice and reviewed decisions, identify an isolated disposable fictional-data target, review actual catalog/migration metadata without exposing credentials, and stop on unexpected tables or name collisions. A later migration must not alter existing records outside that explicitly approved slice. No destructive schema operations or production-like changes are implied by this plan.

## Dependency sequence, not a batch installation instruction

| Proposed stage | Logical dependencies and additive objects | Gate / evidence needed later |
|---|---|---|
| M0 design freeze | Approve applicable D/C decisions, exact names/types/checks/API serialization, session/hash approach, policy/fixture scope | Signed checklist, updated affected feature spec and shared ADR/data/API docs |
| M1 identity/scope foundation slice | districts, organizations, users, account_roles, organization_districts, memberships, membership_districts; streams, audit, verification tokens and sessions as needed by approved auth behavior | Auth/role/consent/verification negative RED tests first; bootstrap authority reviewed; no global self-grant |
| M2 volunteer profile slice | skills, volunteer_profiles, volunteer_skills | FR-005 policy tests; capacity field not an approved dispatch limit until D-S09 accepted |
| M3 incident slice | incidents with scoped FKs, review metadata, version checks and required notification/outbox persistence | FR-007–010/013 audit/redaction/RBAC tests; org routing and location grid approved |
| M4 relief request slice | units, relief_requests, request_skills | FR-011/012/014 parent guards, unit/capacity meanings and actor policy approved |
| M5 assignment/recovery slice | assignments, idempotency_records; finalize notifications/outbox/stream worker/recovery contract | FR-014–020, NF-004/022 real PG races/replay/crash tests; supporting persistence may be introduced earlier only with the slice that uses it |
| M6 P1 slices, separately | inventory_items/allocations; reset tokens; evidence_files and restricted points; privacy_requests | Separate approvals, no automatic opt-in from MVP design acceptance |

This is a dependency map. Do not install unused future tables merely to satisfy the diagram, and do not treat M1–M5 as one implementation task. Any slice needing notifications/outbox must introduce its supporting tables atomically before exposing the feature; no temporary socket-only substitute.

## Physical migration design

After approval, use the existing pinned Prisma version/config/client generator. Review generated SQL plus explicit native CHECK/partial-index/grant SQL and stable names; do not assume Prisma schema round-trips preserve every database object. Keep PostgreSQL-enforced foreign keys. Avoid new extensions, infrastructure and library dependencies without approval.

Initial additive tables/checks are created in dependency order in reviewed transactional migrations where supported. FKs reference existing PK/UQ anchors; child indexes follow approved query/FK inventory. If a later populated table needs a new NOT NULL/FK/CHECK/unique invariant, use expand/backfill/validate/contract with bounded batches and preflight duplicate detection. A unique index cannot simply be added over conflicting existing data. Concurrent index construction, if later warranted, needs a separately reviewed nontransactional migration strategy; it must not be smuggled into an incompatible transactional migration.

The proposal prefers checked varchar states while conflicts remain open. Any later choice of native enums, new states or type/precision narrowing needs its own compatibility/data-conversion review. Unit/code meaning is immutable, so semantic changes create new reference entries rather than reinterpreting historical quantities.

## Backward compatibility and release sequencing

1. Keep endpoints unavailable until their own feature/schema dependencies are installed and verified; SELECT 1 readiness must not claim complete domain readiness.
2. Apply reviewed additive schema before enabling dependent API code; old health/readiness-only code can continue with unused domain tables.
3. Test new app against proposed schema and previous compatible app against expanded schema. Review all default/nullability/backfill behavior before exposing writes.
4. Enable one approved feature after contract/auth/security smoke checks; preserve old DTOs or use an explicitly reviewed version change for incompatible fields.
5. A later schema-aware readiness gate or worker lifecycle change requires a separate reviewed contract; do not repurpose current public readiness silently.

## Rollback and recovery

For additive initial tables, application rollback can leave unused tables in place. **Do not generate a down migration that drops acknowledged data.** When writes have occurred, prefer disabling the new feature and a reviewed forward fix. Expand/contract keeps old columns until all dependents have migrated; destructive cleanup requires explicit separate approval and recovery proof.

Before any authorized staging/demo migration, human operator needs migration identity/checksum, compatible app image, known-good encrypted backup, owner, rollback decision point and isolated restore evidence. Backup restoration can lose later committed work and is an incident-controlled choice, not automatic schema rollback. No backup, restore, deployment or DB-role grant change is performed here.

## Safe fictional seed strategy

FR-033 / AT-033: propose a later seed script that runs only on an explicitly allowlisted disposable demo target. No default environment URL should authorize writing. Use stable UUID aliases and synthetic account emails under `example.test`, labels such as `Demo Reporter 01`, invented organization names, approved public district codes and synthetic coarse points that do not identify a household. Do not copy `.env`, any live account, victim/volunteer record or production dump into fixtures.

No shared literal passwords/tokens in source. A later approved mechanism supplies ephemeral test credentials locally, hashes with the approved library and avoids logging values; deterministic entity IDs need not make credential secrets deterministic. Test-only token factories stay isolated and never become a production bypass. No email/SMS is sent.

Fixture partitions: active/unverified/suspended accounts; reporter+volunteer account; two orgs and districts; revoked grant; coordinator with only one district; available/unavailable/capacity-full volunteer; differing skill sets; unverified/verified/active/resolved incidents; draft/approved/progress needs; pending/accepted/completed/declined work; unread/read owner notifications; leased/failed publication; replayed command. P1 includes fractional/discrete units and stock=5 with two reserve requests of 4.

Seed only the slice's dependencies, idempotently by stable fictional keys. Reruns do not overwrite existing workflow state, invent balances, reactivate revoked users or erase audit/history. Repeated seeds on a nonempty/unrecognized target should fail safe; disposable teardown requires later explicit authorization. Time-dependent tokens/expiry are fixture-clock controlled, not real accounts.

## Planned migration evidence and safeguards

Future checks must exercise blank disposable creation, upgrade from known prior schema, SQL catalog constraints/indexes, invalid direct SQL inserts, transaction rollback at audit/inbox/outbox steps, duplicate/capacity/stock races, compatibility smoke, seed repeatability, crash/restart retention, backup/restore and absence of secrets/PII. Merely running Prisma validate/generate is not proof of applied PostgreSQL integrity. Those tests are **not run** in this design milestone; [test-cases.md](test-cases.md) lists their intended acceptance.
