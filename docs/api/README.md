# Draft API contract

`openapi.json` is a **proposed initial API inventory**, except for the implemented minimal `GET /health/live` foundation contract. That route returns only `{ "status": "ok" }` and a generated request ID; it does not establish database readiness. All other inventoried routes remain planned. The foundation also returns the shared safe error envelope for missing routes and parser/unexpected errors; see `apps/api/README.md`.

Representative schemas for incident and assignment commands remain unimplemented. Other routes still need precise request/response schemas in approved feature plans. This is not a final OpenAPI completeness claim. The foundation endpoint test checks its small liveness response against the inline contract; it is not a general OpenAPI validator. Keep confidential fields omitted from public DTOs.
