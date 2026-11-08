---
applyTo: "apps/api/**/*.{ts,tsx}"
---
# Backend implementation instructions
- Express controllers thin; Zod request validation; domain services hold business rules; Prisma repositories handle persistence.
- Every resource read/write evaluates active session, role AND object/org authorization.
- Enforce status transitions transactionally and concurrency via DB constraints/version checks.
- Audit privileged changes and persist notification/outbox row atomically with domain write.
- Return safe structured errors with request ID; do not log PII, secrets or full tokens.
- Test negative authorization, conflict, race and idempotent replay cases with actual PostgreSQL.
