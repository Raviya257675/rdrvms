# Database readiness plan

Authorization: Master Prompt 02; branch preconditions confirmed clean on `feature/database-prisma-readiness`, base `b12c09aaa08720dee2efcc09f06f00816c378bfb`. The accepted Express foundation is merged; existing PostgreSQL 17 container is healthy.

## Files and approach

- Add `apps/api/prisma.config.ts`, model-free `prisma/schema.prisma`, ignored `src/generated/prisma` output and generation/validation scripts.
- Add `src/environment.ts` for silent built-in Node environment-file loading, `src/database-config.ts` for sanitized configuration, `src/health.ts` for bounded/coalesced checks and `src/database.ts` for the adapter/client lifecycle.
- Update `src/app.ts`, `src/server.ts`, `src/shutdown.ts` to inject readiness and close database resources after HTTP drain.
- Add readiness, configuration, probe and resource-shutdown unit tests; separate `tests/integration/postgres.test.ts` with dedicated Vitest configs and scripts. Keep all foundation assertions except the explicitly superseded readiness-absence expectation.
- Update package/lockfile, tsconfigs, API/OpenAPI/README/testing documentation, test catalog, traceability and evidence.

Dependencies: Prisma CLI/client/adapter-pg 7.10.1. The adapter supplies its PostgreSQL driver dependency; no extra direct pg/dotenv library is needed. Install without approving dependency lifecycle scripts. Explicit generation is not a migration.

## TDD and failure testing

Write tests before behavior; record RED. Implement minimal GREEN; verify unit tests, source/test/config typechecks, generated production build and docs checks. Integration tests run only explicitly and fail rather than skip if PostgreSQL/settings are unavailable. They perform SELECT 1 only against the existing local database, without fixtures or data changes.

A temporary loopback TCP proxy injects outages/recovery for the same client without modifying the database server. A black-hole TCP listener verifies bounded connection failure. No Docker stop/reset or schema operations.

## Security and delivery

No new protected data/resource or policy decision. Readiness is a minimal public operational signal already inventoried in OpenAPI. Keep credentials/URLs out of test assertions, HTTP, logs and generated code. No SQL/Prisma error logging. No migration/deployment impact; human review remains required. DB readiness does not prove schema completeness or domain durability.
