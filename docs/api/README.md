# Draft API contract

`openapi.json` is a **proposed initial API inventory**, except for implemented `GET /health/live` and `GET /health/ready`. Liveness returns `{ "status": "ok" }` independently of PostgreSQL. Readiness runs a bounded read-only database query and returns `{ "status": "ready" }` or safe 503 code `NOT_READY`, with no internal details. Responses carry generated request IDs; readiness disables caching. It does not prove domain/schema readiness. All other inventoried routes remain planned. See `apps/api/README.md`.

Representative schemas for incident and assignment commands remain unimplemented. Other routes still need precise request/response schemas in approved feature plans. This is not a final OpenAPI completeness claim. Endpoint tests check the small health contracts; they are not a general OpenAPI validator. Keep confidential fields omitted from public DTOs.
