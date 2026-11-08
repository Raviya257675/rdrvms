# Implementation plan: Report, review and verify simulated incidents

- Status: DRAFT; do not start coding before spec sign-off.
- Trace: FR-007, FR-008, FR-009, FR-010, FR-013, FR-024; AT-007, AT-008, AT-009, AT-010, AT-013, AT-024.

## Planned approach
1. Define incident entity, precise/restricted point fields, index and state transition service.
2. Design public-redacted vs coordinator detail DTO and resource authorization.
3. Write unit transition tests, API integration auth/validation cases and frontend form accessibility checks.
4. Implement incident list and submission and verification screens, only after red tests.
5. Generate audit and notification/outbox events in same data transaction.

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
