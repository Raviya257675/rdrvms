# Foundation test cases

These are foundation-specific subdivisions; existing broad acceptance tests remain incomplete.

Historical Prompt 01 baseline: the absence-of-readiness assertion is superseded by feature 004, which now requires fail-closed 503 when no database probe is supplied. Other foundation assertions remain. See `../004-database-readiness/` for current AT-029 coverage and runtime environment/cleanup changes.

| ID | Trace | Expected behavior | Implementation |
|---|---|---|---|
| FND-001 | FR-029 / AT-029, NFR-018 | Safe liveness response matches its OpenAPI schema; readiness remains absent | apps/api/tests/app.test.ts |
| FND-002 | FR-032 / AT-032, NFR-017 | Safe JSON errors with generated request IDs; no exception/input reflection | apps/api/tests/app.test.ts |
| FND-003 | NFR-025 | Malformed, oversized and unsupported JSON bodies fail safely | apps/api/tests/app.test.ts |
| FND-004 | NFR-017, NFR-019 | Validated nonsecret configuration; no environment-file/database access | apps/api/tests/config.test.ts |
| FND-005 | NFR-019 | Drain, idempotent shutdown, bounded force-close and failure status | apps/api/tests/shutdown.test.ts |

Local commands, RED/GREEN results and unverified aspects are recorded in `evidence.md` after execution. CI evidence remains blank until CI actually runs.
