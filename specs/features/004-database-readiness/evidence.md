# Local database-readiness evidence — 2026-11-09

Authorization: Master Prompt 02 only. Branch `feature/database-prisma-readiness` was clean at base commit `b12c09aaa08720dee2efcc09f06f00816c378bfb`; the merged foundation exists. Tests below concern uncommitted working-tree changes. No new commit/PR, CI run, supervisor approval or release is claimed.

## Preconditions and dependencies

- Node.js 24.22.2 / npm 11.19.1 from the existing environment.
- `docker ps --format '{{.Names}}\t{{.Status}}\t{{.Image}}'`: `infra-db-1`, healthy, `postgres:17-alpine`. Only container metadata was read; no Docker service/volume changes.
- Installed exact `@prisma/client@7.10.1`, `@prisma/adapter-pg@7.10.1` and development `prisma@7.10.1` using `npm install --save-exact --ignore-scripts ...` (`--save-dev` for the CLI). No direct pg or dotenv dependency was added; pg/@types/pg are adapter dependencies. No install-script approvals were added.
- Registry/Prisma binary access required sandbox network escalation. Prisma's CLI explicitly retrieved its required engine when the sandbox could not resolve `binaries.prisma.sh`. Generation and validation do not connect to or migrate PostgreSQL.
- Official references: [Prisma 7 generator](https://www.prisma.io/docs/orm/v7/prisma-schema/overview/generators), [config](https://www.prisma.io/docs/orm/v7/reference/prisma-config-reference), [CLI](https://www.prisma.io/docs/orm/v7/reference/prisma-cli-reference), [pg pool](https://node-postgres.com/apis/pool).

## Model-free generation

The installed CLI's `generate --help` exposes `--require-models` as opt-in. Plain generation therefore supports no models in this pinned release; no obsolete `--allow-no-models` flag, dummy entity, preview feature or temporary table was used.

From `apps/api`:

```bash
npm run prisma:generate
npm run prisma:validate
```

Both exited 0. Observed: generated Prisma Client 7.10.1 in ignored `src/generated/prisma`; schema valid. Schema contains only generator/datasource blocks; no model/enum/view declarations or migration directory. A structural check found zero PostgreSQL connection URLs in generated TypeScript.

Generator output is explicit and ESM. TypeScript imports in generated code are rewritten to JavaScript imports by the production compiler. `prisma.config.ts` locates the schema; generation requires no database connection. No duplicate credential file was created. Existing process variables take precedence over silently loaded root environment settings.

## RED before behavior implementation

From `apps/api`, before creating the database/configuration/probe/environment modules or adding readiness/resource cleanup:

```bash
npm test -- --reporter=verbose --no-cache --no-fsModuleCache
npm test -- --config vitest.integration.config.ts --no-cache --no-fsModuleCache
```

Unit command: exit 1, `Test Files 5 failed | 2 passed (7)`, `Tests 9 failed | 32 passed (41)`. Two suites failed to import not-yet-created modules. Behavioral assertions failed because readiness returned 404 rather than 200/503 and database cleanup was not invoked.

Integration command: exit 1, one failed suite, zero collected tests because the database module did not yet exist. This is setup-level RED; the unit assertions above supply behavioral RED evidence.

The one foundation readiness-absence assertion was deliberately updated from 404/NOT_FOUND to 503/NOT_READY under the new approved requirement. Other foundation assertions were retained.

## Additional defects exposed and fixed

- First implementation run: 55 passed / 1 failed. The existing special-character fixture exposed unescaped percent signs in derived passwords. Explicit component encoding fixed the implementation without changing its expected assertion.
- First real PostgreSQL run: 2 passed / 1 failed. The test TCP proxy accidentally reused its rewritten URL as the upstream destination. Capturing upstream host/port before rewriting corrected the fixture; all assertions stayed intact. The first direct real PostgreSQL SELECT test had already passed.
- Driver review showed URL parameters override timeout defaults. Added four invalid-override cases first; targeted RED was 4 failed / 12 passed. Rejecting those overrides restored GREEN.
- Added readiness OpenAPI assertions before completing schemas. Targeted RED was 1 failed / 4 passed because success content was missing; updating only the readiness contract restored GREEN.

## Final sequential GREEN

From `apps/api`:

```bash
npm test -- --no-cache --no-fsModuleCache
npm run test:integration -- --reporter=verbose --no-cache --no-fsModuleCache
npm run typecheck
npm run build
npm run prisma:validate
npm ls --depth=0
```

All commands exited **0**:

- Foundation/unit: **60 passed in 7 files**, no skips. Includes the 33 foundation scenarios with the approved readiness assertion update.
- Actual PostgreSQL integration: **3 passed in 1 file**. Direct SELECT/readiness/idempotent disconnect; same-client **200 -> 503 -> 200** network outage/recovery; stalled PostgreSQL handshake returning safe 503 while liveness remains 200. Final handshake case completed in approximately 1031 ms, below its 2500 ms test bound.
- Source, tests and configuration typecheck: passed.
- Production build: passed, including generated client compilation.
- Model-free Prisma schema validation: passed.
- Dependency listing: exactly the eight existing direct packages plus the three approved Prisma packages; all Prisma versions are 7.10.1.

The integration tests use existing PostgreSQL but only read-only SELECT 1 queries. Failure injection is through temporary loopback TCP sockets; the real database container was never stopped. No fixtures, users, application rows, schema operations, resets or data mutations were performed.

## Compiled-process smoke

```bash
node /tmp/rdrvms-prisma-readiness-smoke.mjs
```

The temporary harness is outside the repository and is not a committed test artifact. It loads settings only inside Node, prints fixed PASS messages and exited **0** after verifying:

- Compiled API readiness queries real PostgreSQL and closes the pool on SIGTERM and SIGINT (both process exits 0).
- An unreachable test endpoint gives bounded safe readiness 503, liveness stays 200, and shutdown exits 0. The real PostgreSQL service remains running.
- Invalid database configuration exits 1 with only the fixed configuration diagnostic.
- Occupied HTTP port triggers resource cleanup and exits 1 with only `API server failed.`

## Documentation and boundaries

From the repository root:

```bash
python3 -B scripts/validate_pack.py
python3 -B -m unittest discover -s scripts -p 'test_*.py'
git diff --check
git diff --exit-code -- apps/web infra .specify/memory/constitution.md docs/architecture/adr
```

Documentation manifest/ID checks passed; **3 documentation unit tests passed**; whitespace and excluded-path diffs were clean. All 60 requirement IDs and all 73 pre-existing test IDs remain; five DBR entries were added. Only `/health/ready` changed among OpenAPI paths; liveness is unchanged. AT-029 now points to the real PostgreSQL integration file and is `Implemented`, with CI evidence empty. FR-029 is `Implemented`, not CI-verified/human-accepted; broader NFRs and FR-032 remain partial.

No agent-facing credential values were inspected or printed. Runtime/CLI/integration entry points may load the existing ignored environment file, as required to connect, without serializing its contents. Generated client files are ignored; no secrets were copied into tracked configuration. SQL/Prisma exceptions are not returned or logged by the application.

No application-domain or session/RBAC/privacy decisions were approved, no frontend/topology changes occurred, and no commit/push/merge/deployment was performed. No CI, coverage percentage, supply-chain vulnerability scan, public-pilot privacy review or domain-data durability result is claimed. Human code review is pending. The next feature requires separate approval of its identity/organization/session policies and data model; this milestone stops at connectivity/readiness.
