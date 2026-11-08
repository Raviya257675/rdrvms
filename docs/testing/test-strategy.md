# TDD and verification policy

1. Approved feature spec and trace IDs → failing tests (RED) → minimum implementation (GREEN) → refactor.
2. Unit Vitest for policies; API Vitest+Supertest with disposable PostgreSQL for auth/data; Playwright for role flow; security and concurrency tests on risky boundaries.
3. Every P0 story requires positive/negative/failure test evidence. No skip/only or downgraded assertions to pass CI.
4. Socket.IO is not authoritative; test disconnect/reconnect and stored inbox.
5. Production-like migration uses `prisma migrate deploy`, never destructive reset.
6. Record command, commit, environment, outcome, logs and links. `tests/test-catalog.csv` is the live test ledger.

**Status:** test specs and templates only. App test runner does not yet exist.
