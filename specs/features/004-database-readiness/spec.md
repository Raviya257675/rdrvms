# Feature 004: Prisma/PostgreSQL connectivity and readiness

- Scope authorized by Master Prompt 02 on 2026-11-09; human code review remains pending.
- Trace: FR-029 / AT-029; NFR-017, NFR-018, NFR-019, NFR-025. FR-032 remains partial; no metrics are added.
- Prior foundation: `../000-backend-foundation/spec.md`. This slice supersedes its deliberate absence of database readiness, environment-file loading and database cleanup. Other foundation behavior remains unchanged.

## Acceptance

1. Pin Prisma CLI, client and PostgreSQL adapter to the same stable ORM 7 version. Use `prisma.config.ts`, the `prisma-client` generator with explicit ignored output, and supported model-free generation. No models, tables or migrations.
2. One database client/pool is created per running API process; imports and app creation do not connect to the database. Credentials stay in the existing runtime environment, optionally loaded in-process from the ignored repository `.env`, never returned/logged/copied into a second file.
3. Accept DATABASE_URL, or derive a PostgreSQL URL in memory from the existing POSTGRES_USER/PASSWORD/DB settings and optional POSTGRES_HOST/PORT. Invalid configuration fails with fixed diagnostics. Do not relax TLS options supplied in a URL.
   Reject URL query parameters that override fixed timeout settings (`statement_timeout`, `query_timeout`, `connectionTimeoutMillis`, `options`). The driver otherwise gives URL parameters precedence over defaults.
4. Public GET /health/ready performs a read-only `SELECT 1`: return 200 `{ "status": "ready" }`, or 503 with safe error code NOT_READY, fixed message and requestId. Never include connection details. Set Cache-Control: no-store.
5. GET /health/live remains independent from database state. Missing readiness dependency fails closed with 503.
6. Bound connection acquisition and query execution to 1 second each, and readiness HTTP waiting to 1.5 seconds. Limit the pool to 5 connections. Coalesce concurrent readiness queries so timed-out callers cannot create unbounded work.
7. Recover after connectivity returns without restarting the API. Handle pool errors without logging credentials/internal exceptions.
8. Shutdown drains HTTP before disconnecting the client once, within the existing overall 10-second deadline; failure/timeout exits unsuccessfully. Startup listener failure also releases the database client.
9. Prove healthy, unavailable, timeout and recovery paths with unit and real PostgreSQL read-only integration tests. Never stop the real database for failure injection.

## Exclusions and approval boundaries

No authentication/session/RBAC, domain entities, real-person data, seeds, migrations, schema reset/push, external service, infrastructure topology, frontend or deployment changes. Existing policy decisions and ADR approvals remain pending. Runtime loading of the existing environment does not authorize displaying credential values.
