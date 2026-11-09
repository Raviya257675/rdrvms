# Database readiness acceptance tests

| ID | Trace | Expected result | Test file |
|---|---|---|---|
| DBR-001 | FR-029, AT-029, NFR-018 | Ready 200; unavailable/missing/rejected probe 503; no details; liveness independent | apps/api/tests/readiness.test.ts |
| DBR-002 | FR-029, NFR-025 | Bounded waiting, query coalescing and retry after failure | apps/api/tests/health.test.ts |
| DBR-003 | NFR-017 | Validate runtime DB settings and encode components without leaking values | apps/api/tests/database-config.test.ts |
| DBR-004 | NFR-019 | Close DB once after HTTP drain; retain original deadline on rejected/thrown cleanup; exit unsuccessfully on failure/timeout without exposing exceptions | apps/api/tests/shutdown-resources.test.ts |
| DBR-005 | FR-029, AT-029, NFR-025 | Actual PostgreSQL SELECT 1, network outage, recovery, black-hole timeout and disconnect | apps/api/tests/integration/postgres.test.ts |

Fixtures are synthetic error strings and temporary local sockets; no database rows/tables are created. Local execution evidence belongs in `evidence.md`; CI fields stay empty until actual CI execution.

Shutdown cleanup-failure regression evidence: [Master Prompt 02B](shutdown-cleanup-failure-evidence.md).
