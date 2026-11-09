# Real-Time Disaster Relief & Volunteer Management System (RDRVMS)

> **Status: BACKEND FOUNDATION AND DATABASE CONNECTIVITY IMPLEMENTED — FRONTEND AND DOMAIN APPLICATION NOT IMPLEMENTED.**
> Academic simulation; not an official disaster-alert system, emergency dispatch service or live operations platform.

## Stack (proposed baseline)
- Frontend: React + Vite + TypeScript + Tailwind, React Router, TanStack Query.
- API: Node.js + Express + TypeScript, Zod, Socket.IO, Prisma.
- Data: PostgreSQL; PostGIS later only if a geospatial requirement is approved.
- Ops: Docker + Compose; Ubuntu + Nginx; GitHub Actions; metrics/logs; Prometheus/Grafana later.
- Structure: TypeScript modular monolith, not microservices; same-origin cookie-based sessions.

## Read in this order
1. `AGENTS.md`, `.specify/memory/constitution.md` and `docs/decisions/open-questions.md`.
2. Companion Word documents `01`–`03` (PRD/SRS/use cases); review and approve before coding.
3. `docs/architecture/architecture.md`, ADRs, `docs/security/threat-model.md`.
4. `specs/features/001-auth/`, `002-incidents/`, `003-assignments/`.
5. `docs/api/openapi.json`, `tests/test-catalog.csv`, `docs/requirements/traceability.csv`.
7. `specs/templates/`, ADR/change-request templates, release record and incident report templates for later phases.
6. `docs/devops/ci-cd.md`, `docs/runbooks/`, release templates.

## Backend foundation

`GET /health/live`, database-backed `GET /health/ready`, safe JSON errors, private runtime configuration and bounded HTTP/database shutdown are implemented. No domain tables or migrations exist. See [API commands and scope](apps/api/README.md), [database slice](specs/features/004-database-readiness/spec.md) and [historical foundation evidence](specs/features/000-backend-foundation/evidence.md).

From the repository root, with Node.js 24:

```bash
npm --prefix apps/api ci
npm --prefix apps/api test
npm --prefix apps/api run test:integration
npm --prefix apps/api run prisma:validate
npm --prefix apps/api run typecheck
npm --prefix apps/api run build
npm --prefix apps/api run dev
```

The API defaults to `127.0.0.1:3000` and lazily connects to PostgreSQL. Entry points load the existing ignored root environment file without logging values; unit tests remain independent. Use existing DATABASE_URL or Compose POSTGRES_USER/PASSWORD/DB variables; do not duplicate/commit credentials. Authentication, permissions and all disaster-management behavior remain unimplemented and require separate approvals.

## Documentation checks
```bash
python3 scripts/validate_pack.py
python3 -m unittest discover -s scripts -p 'test_*.py'
# Optional local PostgreSQL ONLY (not the app):
# cp .env.example .env && docker compose -f infra/compose.dev.yaml up -d
```

## Build features using SDD + TDD
Write `spec.md` → `plan.md` → `tasks.md` → failing tests → implementation → passing tests → review/merge. Keep IDs `FR-xxx`, `AT-xxx`, relevant ADRs and API contracts synchronized.

## What's intentionally missing
No frontend application, domain APIs, domain models/migrations, Dockerfiles or application deployment exist. Prisma has a connectivity-only schema with no models. The backend package has local tests and build/start commands; application CI remains unconfigured. Example application CI workflows and root TypeScript test templates are **not active**. Automated docs validation is active.

## Source of truth
Approved Word SRS = human requirements baseline. Committed feature Markdown/OpenAPI/traceability = agent-readable working contract. Conflicts become explicit change requests; no automatic silent overrides.

## Safety
Use only fictional/consenting test data. Do not use as a public disaster response channel. Do not integrate real emergency responders or autonomously dispatch volunteers. Respect privacy and protect exact locations.
