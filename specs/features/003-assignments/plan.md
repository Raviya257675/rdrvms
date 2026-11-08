# Implementation plan: Safe volunteer assignment and durable notifications

- Status: DRAFT; do not start coding before spec sign-off.
- Trace: FR-005, FR-014, FR-015, FR-016, FR-018, FR-019, FR-020; AT-005, AT-014, AT-015, AT-016, AT-018, AT-019, AT-020.

## Planned approach
1. Implement assignment policy and optimistic concurrency with database unique/business constraints.
2. Create durable notification inbox and outbox entries in the same transaction as state transitions.
3. Implement socket gateway with server authorization and minimal IDs/version payload.
4. Write Postgres concurrency integration tests and socket disconnect/replay checks before implementation.
5. Frontend fetches authoritative assignment detail after notification; no server state based solely on sockets.

## Interfaces and architecture
- React UI in `apps/web`; Express controllers/services and Prisma repositories in `apps/api`.
- Shared DTOs in `packages/contracts`; OpenAPI contract `docs/api/openapi.json`.
- Document DB index/migration and error/conflict semantics before implementation.

## Tests first
- Unit domain policy and validators.
- Supertest + actual disposable PostgreSQL for auth, scoped permissions, transaction and state.
- Playwright/UI flow on synthetic accounts, including unhappy-path errors.
- Realtime recovery/concurrency tests where applicable.

## Security and operations review
- No real PII or secret logging; proper object/organization scoping.
- Updated audit/outbox on state changes and reviewed release/migration impact.
- Include health/observability where a new failure mode is created.

## Exit criterion
Signed feature spec, red-green-refactor evidence, passing CI, code review and updated traceability.
