**Real-Time Disaster Relief & Volunteer Management System**

Document ID: RDRVMS-10 \| Version: 0.1 (draft baseline) \| Issued: 08 November 2026

**Purpose** Incremental deployment, supply-chain policy, staged workflows, Docker, infrastructure ownership, metrics and operational readiness.

**Status & approvals** Proposed design baseline, not signed off. Product owner/team and module supervisor must approve requirements, privacy decisions, service-level targets, and any external integrations before development or real-world use.

**Audience** Project team, module supervisor, reviewers

# Target stages

| **Stage** | **Goal** | **Exit gate** |
|----|----|----|
| Dev | TypeScript workspace + local Postgres + mocked accounts | Make/README steps reproducible |
| CI | PR lint/types/tests; contracts; security checks | Branch protection passes |
| Containers | Frontend/API Dockerfiles; healthchecks; DB persistent volume | Compose up + restart test |
| Staging | Cloud/Linux deployment of versioned images | E2E and recovery smoke |
| Demo release | Approval, backup, deploy, metrics dashboard | Signed release checklist |
| Optional expansion | Terraform/Kubernetes/Redis adapter | Only if grading/time justify |

# Environment matrix

| **Environment** | **Data** | **Secrets** | **Deployment method** |
|----|----|----|----|
| local | Disposable fictional seed | Local .env ignored | Docker Compose / local scripts |
| CI | Isolated ephemeral DB | Ephemeral secrets, least privilege | Temporary containers and runner |
| staging | Synthetic realistic fixtures | Environment-scoped secrets | Immutable image deploy to VM |
| demo/prod-like | Fictional approved demo dataset | Protected environment secrets | Manual approval + automatic rollback/forward-fix plan |

# Proposed CI sequence and policy

1.  Push PR with linked requirement, test evidence and human review request.

2.  Static validation: formatting, type check, lint, frontend/unit tests.

3.  Integration/contract validation against disposable PostgreSQL and OpenAPI.

4.  Security: secret scan, dependencies, static patterns, container image scan after build.

5.  Build multi-stage production Docker images; tag with commit SHA and release version; publish to private registry if policy requires.

6.  Staging deployment after protected approval; run prisma migrate deploy, health checks and smoke E2E.

7.  Promote digest to demo environment; capture release manifest, post-deploy health and monitoring screenshot.

# Secrets and GitHub Actions hardening

- Workflow default permissions: contents: read; grant packages:write only to publish job.

- Pin third-party actions to immutable commit SHAs after maintenance review; avoid untrusted pull_request_target code execution.

- Use protected branches, required reviews and protected environments; no deploy credential on external fork PR.

- Prefer OIDC to static cloud access keys when supported; scope credentials to environment.

- Never place database secrets in Vite VITE\_\* variables; these are exposed in browser builds.

- Use .env.example with nonsecret placeholders; local real .env gitignored.

# Docker/Compose guidance

Build separate production images for web and API. Use a private Postgres service with persistent volume, healthcheck, restart policy and bounded resources. Docker Compose depends_on can wait for service_healthy, but that does not replace application retries and readiness checks. Provide image provenance and lockfile-based builds.

# Observability: initial panel inventory

| **Signal** | **Metric / log** | **Alert rehearsal** |
|----|----|----|
| API availability | http_requests_total, 5xx ratio, /health/ready | 5xx burst over 5 min |
| Latency | request duration histogram p50/p95 | Latency \> agreed target |
| Database | connection count, errors, query latency | DB down -\> readiness 503 |
| Notification | outbox pending count / age, socket connected clients | Backlog \> threshold |
| Infrastructure | CPU, memory, disk volume free | Disk \< planned headroom |
| Security | failed login rate, privileged admin changes | Suspicious spike / role change |

# Deploy and rollback

8.  Before deploy: confirm approved commit, image digests, migration review, known-good backup, rollback decision point.

9.  Deploy compatible schema changes first, or use additive expand phase.

10. Deploy new images and run readiness, smoke role flow and logs/metrics checks.

11. If failed, revert app image to last known-good digest only if DB schema remains compatible. Otherwise use approved forward-fix; restore database only using incident-controlled recovery process.

12. Record release timestamp, operator, evidence URLs and final decision.

# DevOps demonstration script

A robust course demo shows: red failing test → green fix → PR checks → image build → staging deploy → role-based end-to-end workflow → simulated websocket disconnect/reconnect → observability dashboard → controlled application restart → persisted data → backup/restore proof.

# References and operating assumptions

Reference standards are guidance, not a claim of certified compliance. Verify dates and applicable legal obligations at implementation time.

Docker Compose service dependencies — https://docs.docker.com/reference/compose-file/services/

Prisma production migrations — https://www.prisma.io/docs/orm/v7/prisma-migrate/workflows/development-and-production

NIST SSDF SP 800-218 — https://csrc.nist.gov/projects/ssdf
