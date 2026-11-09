# Foundation implementation plan

- Scope authorized by Master Prompt 01; implementation is subject to human review.
- Prior preflight: conversation Prompt 00 architecture review; retain its unresolved policy decisions.

## Approach

Keep package tooling inside `apps/api`. Express is the only runtime dependency; the other seven approved packages support TypeScript/development/testing. Use ESM and NodeNext so compiled JavaScript runs directly under Node.js 24. Pin resolved direct versions and commit the npm lockfile in a later human-controlled commit.

`src/app.ts` owns application assembly, request IDs, a bounded JSON parser, liveness, not-found handling and the central error middleware in `src/http/errors.ts`. An optional internal Router argument allows testing exception behavior without adding production test endpoints. `src/config.ts` validates selected process settings; `src/server.ts` alone listens and installs signal handlers; `src/shutdown.ts` drains/forces HTTP connections.

## Test-first sequence

1. Write endpoint tests; execute against an empty Express app factory and capture assertion failures before implementing behavior.
2. Write configuration and shutdown tests; execute before implementing their modules.
3. Implement minimally, run all tests, then typecheck source/tests and build production output.
4. Smoke-test built output, lifecycle and failure exits; update liveness OpenAPI, traceability and exact local commands.

## Impact

No protected resources, permissions, database access, migrations, infrastructure, frontend or deployment changes. Failure paths are invalid settings, parser limits, missing routes, internal exceptions, listener failure and shutdown timeout. Logs contain fixed lifecycle messages and configured nonsecret listening address only. Request IDs are returned; full request logging and metrics remain deferred.

Supertest and process smoke tests use temporary local sockets. Dependency resolution requires npm registry network access. No additional direct dependency/design approval is currently needed.
