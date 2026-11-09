# TDD and verification policy

1. Approved feature spec and trace IDs → failing tests (RED) → minimum implementation (GREEN) → refactor.
2. Unit Vitest for policies; API Vitest+Supertest with disposable PostgreSQL for auth/data; Playwright for role flow; security and concurrency tests on risky boundaries.
3. Every P0 story requires positive/negative/failure test evidence. No skip/only or downgraded assertions to pass CI.
4. Socket.IO is not authoritative; test disconnect/reconnect and stored inbox.
5. Production-like migration uses `prisma migrate deploy`, never destructive reset.
6. Record command, commit, environment, outcome, logs and links. `tests/test-catalog.csv` is the live test ledger.

**Status:** foundation/database-readiness unit tests run with `npm --prefix apps/api test`. Explicit read-only PostgreSQL integration runs with `npm --prefix apps/api run test:integration` and proves AT-029 connectivity failure/recovery without creating rows/tables or stopping PostgreSQL. Failure injection uses temporary local TCP sockets, so this connectivity-only slice does not require destructive test fixtures. Domain data/transaction tests still require disposable databases. Root templates remain unimplemented. See `specs/features/004-database-readiness/evidence.md`; local runs do not establish CI evidence or complete AT-032.
