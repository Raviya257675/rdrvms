# Shutdown cleanup-failure regression — 2026-11-09

Authorization: Master Prompt 02B. Initial branch was `fix/shutdown-cleanup-failure`, with a clean working tree at `119476f` (merged Prisma readiness PR #2). No branch change, commit, push, merge or deployment was performed. Node.js 24.22.2 / npm 11.19.1.

Trace: feature 004 acceptance 8, DBR-004 / NFR-019; neighboring FND-005 and DBR-005 / FR-029 / AT-029 verified. This fix does not complete the broader requirements or imply human/CI acceptance.

## Defect and smallest fix

The resource cleanup rejection handler set exit status 1 but cleared the overall shutdown deadline. A rejected Prisma disconnect could leave active connections/handles alive indefinitely because exit status alone does not terminate Node.

Keep the existing deadline on cleanup failure. Successful cleanup still cancels it; failure still sets exit status 1 and consumes the rejection without logging the exception. The existing deadline force-closes HTTP connections and invokes the production failure-exit callback. The timer remains unreferenced, so a failed process with no remaining handles can exit naturally with status 1. No retry, new deadline, dependency or database lifecycle API was introduced.

Changed implementation/test files:

- `apps/api/src/shutdown.ts`
- `apps/api/tests/shutdown-resources.test.ts`

Changed documentation:

- `specs/features/004-database-readiness/test-cases.md`
- `specs/features/004-database-readiness/shutdown-cleanup-failure-evidence.md`

## RED before implementation

From `apps/api`:

```bash
npm test -- --run tests/shutdown-resources.test.ts --reporter=verbose --no-cache --no-fsModuleCache
```

Exit **1**: **3 failed / 2 passed**, one file. Immediate rejected promise, synchronous throw and delayed rejection all failed because zero timers remained at 999 ms instead of the required original deadline timer. Production code was unchanged for this run.

The prior failure test incorrectly required no forced exit at the deadline. It now verifies no forced exit before the deadline, exactly one forced exit at the deadline, immediate unsuccessful status, one cleanup attempt despite repeated shutdown calls, no remaining timer after the deadline, and no console logging. No assertion was disabled or skipped to obtain GREEN.

## GREEN and full verification

From `apps/api`:

```bash
npm test -- --run tests/shutdown-resources.test.ts tests/shutdown.test.ts --reporter=verbose --no-cache --no-fsModuleCache
NODE_OPTIONS=--unhandled-rejections=strict npm test -- --no-cache --no-fsModuleCache
NODE_OPTIONS=--unhandled-rejections=strict npm run test:integration -- --reporter=verbose --no-cache --no-fsModuleCache
npm run typecheck
npm run build
```

All final commands exited **0**:

- Targeted shutdown tests: **8 passed in 2 files**.
- Full backend unit suite: **62 passed in 7 files**, no skips.
- Real PostgreSQL integration: **3 passed in 1 file**, no skips. Read-only connectivity, same-client 200 -> 503 -> 200 outage/recovery, and stalled handshake (approximately 1020 ms).
- Typecheck: source, tests and configuration passed.
- Production TypeScript build passed. Existing pre-hooks generated ignored Prisma client output; no schema changes or migrations.

The first full unit run inside the sandbox exited **1**, with **17 failed / 45 passed**, because local HTTP socket binding was denied (`listen EPERM`). The unchanged suite passed outside that restriction. Integration also ran outside the sandbox to permit existing PostgreSQL access and temporary loopback proxies. Only SELECT queries were executed; no database records or container state were changed.

From the repository root:

```bash
node /tmp/rdrvms-shutdown-cleanup-smoke.mjs
python3 -B scripts/validate_pack.py
python3 -B -m unittest discover -s scripts -p 'test_*.py'
git diff --check
git diff --exit-code -- apps/web infra apps/api/prisma apps/api/package.json apps/api/package-lock.json
```

The temporary, untracked smoke harness imports compiled `apps/api/dist/shutdown.js` into Node child processes with `--unhandled-rejections=strict`, an empty environment, a synthetic HTTP drain callback, and real timers. Six scenarios passed: successful cleanup, rejected cleanup with a live interval, synchronous throw with a live interval, delayed rejection with a live interval, stalled cleanup with a live interval, and rejection without a remaining live handle. Assertions check exact exit statuses, exactly one cleanup call, forced HTTP close/failure exit when required, and empty stderr. A 2-second parent watchdog detects a hung child; the injected shutdown deadline is 150 ms. No network or database is used by this harness. Sandbox child-process restrictions initially prevented valid execution (a minimal spawn diagnostic reported EPERM); all six scenarios passed outside that restriction. The harness is a local verification artifact, not a committed regression test.

Documentation manifest/reference/OpenAPI checks passed; **3 documentation-validator tests passed**. Final whitespace and excluded-path checks passed. API contracts and requirement statuses are unchanged because this restores existing shutdown behavior.

## Security, privacy and remaining limits

No new logs or responses expose cleanup exceptions. Regression assertions verify silence for thrown/rejected cleanup. No credentials or `.env` values were inspected or printed; existing Prisma/integration entry points load settings privately in-process. No new resource, permission, authentication/session/RBAC change, dependency, migration, infrastructure or frontend change was made.

Real database integration verified normal disconnect and read-only connectivity; cleanup failure was injected synthetically, not forced inside the real Prisma adapter. Deadline termination bounds process lifetime but cannot guarantee graceful resource cleanup after disconnect itself fails. The temporary process smoke uses a synthetic HTTP drain; real in-flight HTTP draining remains covered by existing mocked unit tests. No coverage percentage, CI run, vulnerability scan or supervisor approval is claimed. Human code review is required before any later merge; no open implementation decision is needed for this scoped fix.
