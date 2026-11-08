# Real-Time Disaster Relief & Volunteer Management System (RDRVMS)

> **Status: DOCUMENTATION & SPECIFICATION STARTER — NO WEB APPLICATION IMPLEMENTED.**
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

## Current executable checks (documentation only)
```bash
python3 scripts/validate_pack.py
python3 -m unittest discover -s scripts -p 'test_*.py'
# Optional local PostgreSQL ONLY (not the app):
# cp .env.example .env && docker compose -f infra/compose.dev.yaml up -d
```

## Build features using SDD + TDD
Write `spec.md` → `plan.md` → `tasks.md` → failing tests → implementation → passing tests → review/merge. Keep IDs `FR-xxx`, `AT-xxx`, relevant ADRs and API contracts synchronized.

## What's intentionally missing
No production application code, package.json, migrations, Dockerfiles, deployment secrets or executing application tests. Do not claim the app can be started until these exist. Example application CI workflows and TypeScript test templates are **not active**. Automated docs validation is active.

## Source of truth
Approved Word SRS = human requirements baseline. Committed feature Markdown/OpenAPI/traceability = agent-readable working contract. Conflicts become explicit change requests; no automatic silent overrides.

## Safety
Use only fictional/consenting test data. Do not use as a public disaster response channel. Do not integrate real emergency responders or autonomously dispatch volunteers. Respect privacy and protect exact locations.
