# RDRVMS API foundation

Academic simulation; not an official emergency service. The Express/TypeScript foundation and model-free Prisma/PostgreSQL connectivity/readiness are implemented. Authentication, sessions, RBAC, domain APIs, Socket.IO, metrics and deployment remain pending separately approved slices.

## Requirements

- Node.js 24 and npm. Prisma CLI/client/adapter-pg are pinned together to 7.10.1. Production dependencies are Express, @prisma/client and @prisma/adapter-pg; the adapter supplies pg transitively.
- Run the following commands from the repository root. No root workspace/package or frontend changes are required.
- PostgreSQL 17 for server readiness and explicit integration tests. Unit tests do not require database credentials or a running database.

## Install and develop

```bash
npm --prefix apps/api ci
npm --prefix apps/api run dev
```

Defaults: `http://127.0.0.1:3000`. Stop with Ctrl+C. `tsx watch` restarts the development process on source changes; `predev` generates the client without creating tables.

Set nonsecret process variables explicitly when needed:

```bash
HOST=127.0.0.1 PORT=3001 npm --prefix apps/api run dev
```

`HOST` accepts an IP address or hostname; `PORT` is an integer from 1 through 65535. Empty/invalid settings fail startup without printing their values.

Server, Prisma CLI configuration and integration-test entry points silently load the existing ignored repository-root `.env` with Node's built-in loader. Explicit process environment variables take precedence. App imports/unit tests do not load that file. Never print/source it into diagnostic output or copy credentials into another committed file.

Use an existing `DATABASE_URL`, or the existing Compose variables `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`. The latter are encoded into a URL only in memory. Optional `POSTGRES_HOST`/`POSTGRES_PORT` default to `127.0.0.1`/`5432`, independently from HTTP settings. URL TLS settings are retained. URL parameters `statement_timeout`, `query_timeout`, `connectionTimeoutMillis` and `options` are rejected because they can override the fixed timeout guarantees; no values appear in the configuration error.

Valid database configuration is required for startup, but PostgreSQL may be temporarily unavailable: liveness still responds and readiness returns 503 until it recovers.

## Tests, types and build

```bash
npm --prefix apps/api test
npm --prefix apps/api run test:watch
npm --prefix apps/api run test:integration
npm --prefix apps/api run prisma:validate
npm --prefix apps/api run typecheck
npm --prefix apps/api run build
```

`test` runs foundation/unit tests once; Supertest uses temporary local sockets. `test:integration` is explicit, requires the existing PostgreSQL server, and fails instead of skipping if settings/connectivity are absent. It executes SELECT 1 only, using a local TCP proxy to inject failure/recovery and a stalled handshake; it never stops PostgreSQL, seeds data or resets schemas.

`typecheck` checks source, tests and configuration. `pretypecheck`, `prebuild` and `pretest:integration` generate the client first. `build` emits application/generated-client JavaScript into ignored `apps/api/dist`. Root test templates are not discovered.

## Prisma 7 without models

```bash
npm --prefix apps/api run prisma:generate
npm --prefix apps/api run prisma:validate
```

`prisma.config.ts` locates `prisma/schema.prisma` and supplies the runtime URL when settings exist. Generation itself requires no database connection or model. Prisma 7.10.1's `generate --help` documents `--require-models` as opt-in; plain `prisma generate` officially permits no models. Do not add dummy tables or use obsolete flags. The schema uses `provider = "prisma-client"`, explicit `src/generated/prisma` output, ESM and TypeScript imports. TypeScript rewrites relative `.ts` imports into `.js` when building. Generated output is ignored and contains no datasource credentials.

No migrations, seeds, schema push or domain models are included. Generation/validation do not apply schema changes. Dependency installation uses the lockfile; no dependency lifecycle-script approval is granted by this milestone.

## Production-mode local start

```bash
npm --prefix apps/api run build
npm --prefix apps/api start
```

This starts compiled JavaScript with Node, without tsx or a build at startup. It is a local runtime check, not a deployment procedure. SIGINT/SIGTERM drain HTTP, then disconnect the database once. The complete shutdown has a 10-second deadline; timeout force-closes HTTP and exits unsuccessfully. Listener failures also trigger cleanup.

In another terminal:

```bash
curl -i http://127.0.0.1:3000/health/live
curl -i http://127.0.0.1:3000/health/ready
curl -i http://127.0.0.1:3000/api/v1/nonexistent
```

Expected: liveness 200 `{"status":"ok"}`; readiness 200 `{"status":"ready"}` when PostgreSQL responds, otherwise 503 with safe code `NOT_READY`; unknown route 404 with code `NOT_FOUND`. Readiness responses disable caching and omit internal error/connection details. Readiness checks connectivity, not schema completeness or domain readiness.

The reusable client is created once in `server.ts` and connects lazily. Pool size is capped at 5; acquisition and driver query/server statement timeouts are 1 second, with a 1.5-second readiness response deadline. Concurrent readiness calls share their underlying query, including after a caller times out, preventing an unbounded queue of stalled probes. Successful checks are not cached. The adapter handles idle pool errors; no raw error logger is registered.

## Structure and safe responses

- `src/app.ts`: import-safe app factory; only `src/server.ts` binds a listening socket.
- `src/config.ts`: selected nonsecret environment validation.
- `src/database-config.ts`, `src/environment.ts`: private connection settings and entry-point environment loading.
- `src/database.ts`, `src/health.ts`: reusable Prisma client, bounded probe and lifecycle.
- `src/http/errors.ts`: sanitized JSON errors; malformed JSON 400, oversized JSON 413, unsupported encoding 415, unexpected failures 500.
- `src/shutdown.ts`: idempotent bounded HTTP drain.
- `tests/`: endpoint/contract, configuration and shutdown verification.

Every response gets a server-generated `X-Request-Id`; error bodies use `{ "error": { "code", "message", "requestId" } }`. Incoming request IDs are ignored. JSON bodies are limited to 64 KiB and compressed JSON is rejected. Exceptions, stacks, input bodies, query strings and credentials are not logged or reflected in errors. No request logger, security-policy middleware or protected resource is introduced.

See `specs/features/004-database-readiness/` for current scope/evidence and `000-backend-foundation/` for historical foundation evidence. FR-029/AT-029 now have real connectivity/failure/recovery implementation and local evidence; CI/human acceptance is still pending. FR-032/AT-032 remain partial. Local tests do not establish release readiness or approval of unresolved domain policies.
