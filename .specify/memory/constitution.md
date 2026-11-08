# RDRVMS project constitution — v0.1 proposed

**Ratification:** PENDING supervisor/team approval | **Last updated:** 2026-11-08

1. **Human-validated intent.** Approved requirements outrank generated code. Unresolved policy changes block autonomous implementation.
2. **TDD and test truthfulness.** Every behavior change follows RED–GREEN–REFACTOR and records commands/results; no fabricated verification.
3. **Safety and privacy.** This is an academic simulation, not official emergency dispatch. Protect private location and vulnerable individuals.
4. **Secure object boundaries.** RBAC and organization/object checks are enforced server-side for REST and Socket.IO.
5. **Durable source of truth.** PostgreSQL stores state; socket messages merely notify and clients reconcile using REST.
6. **Modular simplicity.** React + Express + PostgreSQL modular monolith with versioned contracts; avoid architecture astronautics.
7. **Audited and reversible delivery.** Reviewed migrations, versioned images, backups, health checks and protected release environments.
8. **Small agent tasks.** Changes trace to approved feature spec, plan, tasks and test IDs; reviewed by humans before merge.
9. **No leaked data or secrets.** Real personally identifiable information and credentials excluded from prompts, source and logs.
10. **Continuous learning.** ADRs and retrospective evidence capture tradeoffs; exceptions require owner and expiration.

**Amendment:** Propose a change request with rationale, affected docs, review owner, migration impact and sign-off. Updating constitution requires corresponding test/agent instruction review.
