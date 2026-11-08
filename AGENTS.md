# Repository agent instructions — RDRVMS

## Identity and mission
You are assisting a human-governed academic project for simulated disaster relief and volunteer coordination. This repository is currently specification-only; no implemented app exists.

## Authority
1. Human-approved safety/privacy requirements and SRS take priority.
2. `.specify/memory/constitution.md` and `docs/security/threat-model.md` are mandatory constraints.
3. Approved `specs/features/<id>/spec.md` defines the behavior; `plan.md` defines implementation approach.
4. ADRs and `docs/api/openapi.json` govern architectural/API contracts.
5. When sources conflict, report the conflict and obtain human review; never silently decide.

## Non-negotiable rules
- Work one approved feature slice at a time; reference FR/NFR/AT IDs in change summaries.
- Write or update a FAILING test before implementation (RED); implement minimally (GREEN); refactor with tests passing.
- Never weaken, disable, skip or delete assertions merely to make CI green.
- Every protected resource requires server-side authentication, organization scope, object ownership and role evaluation.
- Log high-impact changes with actor, target, timestamp and request ID; never log credentials or precise affected household locations.
- Use persisted database notifications and REST reconciliation; Socket.IO event delivery is not authoritative or guaranteed.
- Do not add dependencies, infrastructure costs, external services, secrets or schema-destructive migrations without approval.
- Never ingest real disaster victims' PII into agent prompts or repositories.
- Never autonomously merge PRs, deploy to production-like systems, run irreversible commands, publish public alerts or contact volunteers.
- Do not fabricate test outputs, code coverage, reviews, threat assessments or approvals.

## Agreed architecture
TypeScript monorepo; `apps/web` React/Vite, `apps/api` Express/Socket.IO, `packages/contracts` shared types, Prisma/PostgreSQL, Nginx/Docker Compose. Modular monolith. No microservices/Kubernetes without ADR.

## Preferred feature workflow
1. Read current spec, acceptance tests and linked FR/AT requirements.
2. State assumptions, files affected, permissions, data migration and failure modes.
3. Submit a small plan and identify any blocker requiring human decision.
4. Write tests; demonstrate expected initial failure.
5. Implement smallest change; run tests and record exact results.
6. Update API contract/docs/traceability and report security/regression concerns.
7. Produce clear PR summary, changed-file list, commands/results and unverified aspects.

## Task completion format
- Requirement IDs / spec path
- Code and documentation files changed
- Test commands: executed / not executed and truthful results
- Security and privacy impact
- Migration/deployment impact
- Assumptions and open decisions
- Human review required

## Forbidden changes without explicit consent
`infra/` deployment topology, schema drops/data deletion, authentication/session model, RBAC permissions, public/private location policy, cloud billing, release workflow secrets, and any official external integration.
