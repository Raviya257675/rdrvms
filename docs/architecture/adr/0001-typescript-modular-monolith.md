# ADR-0001: TypeScript modular monolith

- Status: **PROPOSED — human approval pending**
- Date: 2026-11-08
- Context: RDRVMS academic simulation, requirements FR and NFR, DevOps learning goals.
- Decision: React/Vite + Express/Socket.IO + PostgreSQL Prisma in one monorepo.
- Rationale: Shared language, few infrastructure components; easy TDD/Compose.
- Alternatives considered: Next.js full stack; Django; Spring Boot; microservices.
- Consequences: Keep scope small; revisit after measured bottleneck, privacy or grading change. Any breaking change updates SRS, tests, architecture diagram and deployment documentation.
- Approval: PENDING.
