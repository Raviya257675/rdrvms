**Real-Time Disaster Relief & Volunteer Management System**

Document ID: RDRVMS-13 \| Version: 0.1 (draft baseline) \| Issued: 08 November 2026

**Purpose** Operable demo procedures for deployment faults, data recovery, alerting, monitoring and post-incident review.

**Status & approvals** Proposed design baseline, not signed off. Product owner/team and module supervisor must approve requirements, privacy decisions, service-level targets, and any external integrations before development or real-world use.

**Audience** Project team, module supervisor, reviewers

# Reliability model and boundaries

The module deployment is an academic demonstration, not an emergency-grade response system. Target objectives (NFR-003 and NFR-013) must be measured and reviewed; do not promise uninterrupted disaster support. If the system is down, affected persons must rely on official channels, not the demo.

# SLO / monitoring scoreboard

| **Measure** | **Baseline proposed objective** | **Operational consequence** |
|----|----|----|
| Demo-window availability | \>=99% during defined assessment window | Raise incident if sustained downtime |
| Read API latency | p95 \<=500 ms @50 concurrent | Investigate DB/query bottlenecks |
| Notification freshness | Outbox age \<60 sec under healthy conditions | Escalate backlog if repeated threshold |
| Backup recoverability | Successful isolated restore before release | Do not release without restore proof |
| Data recovery | RPO \<=24h / RTO \<=4h planning target | Need actual timed rehearsal |

# Runbook RB-01 — API unhealthy

1.  Observe /health/ready, dashboard 5xx, current deploy ID and process/container status.

2.  Check structured logs by request ID, API memory/CPU, latest release and database connectivity.

3.  If deployment caused outage, follow image rollback decision with schema compatibility check.

4.  Preserve incident timeline and notify team channel; update status board with verified facts only.

5.  After repair, smoke-test login, incident list, assignment status and notification inbox.

# Runbook RB-02 — PostgreSQL unavailable

6.  Confirm DB reachability within private network, storage space, connection limits and active maintenance.

7.  Prevent automatic destructive resets and do not run prisma db push/migrate dev in production-like environment.

8.  Use last known-good backup only under authorized restore decision; otherwise restore service connectivity.

9.  Verify schema migration status, record counts and audit/outbox integrity after recovery.

10. Run database durability and workflow tests; capture actual RTO/RPO and incident report.

# Runbook RB-03 — Realtime notifications delayed

11. Check outbox queue age, worker errors, socket connected count and authorization room join results.

12. Verify authoritative notifications are in PostgreSQL; inform users to refresh inbox/REST.

13. Replay unprocessed outbox safely with idempotent event IDs; do not blindly emit sensitive payloads.

14. Investigate broker/adapter only if running multiple API replicas; validate role scoping again.

15. Test disconnect/reconnect flow AT-019 before closing the incident.

# Runbook RB-04 — Accidental permission elevation

16. Disable affected account and revoke server sessions quickly.

17. Review sensitive access and mutation audit records, preserving evidence.

18. Restrict permissions/memberships, rotate exposed credentials where applicable.

19. Inform privacy/security responsible people; determine any reporting duties through qualified review.

20. Create regression test for the authorization gap and deploy reviewed fix.

# Runbook RB-05 — Failed migration/deploy

21. Stop rollout; record migration version, affected environment, image digest and failed error.

22. Assess whether schema change is additive/reversible; do not rollback DB by guess.

23. Apply tested forward fix or controlled restore from verified backup; coordinate app image compatibility.

24. Re-run contract, critical API, and E2E smoke; record follow-up ADR for issue.

# Backups and restore rehearsal

- Choose encrypted database backup destination and test retrieval privileges; do not store backups in public repository.

- Record frequency (daily proposal), retention pending privacy decision, and restore owner.

- Restore into isolated temporary database; compare incident/assignment counts and selected checksums; prove login/queries.

- Preserve rollback capability for application image and compatible DB migration; use expansion strategy for risky schema changes.

# Incident report template

| **Field** | **Capture** |
|----|----|
| Incident ID / severity | Unique ID; SEV1 data/privacy, SEV2 major outage, SEV3 limited issue |
| Timeline | Detected, acknowledged, mitigated, recovered (time zone explicit) |
| Impact | Affected demo workflows/users and whether data was lost |
| Root cause | Evidence-backed cause, avoid speculation |
| Recovery | Steps, commands, deployment image, migration |
| Follow-up | Owner, due date, preventive test/monitoring change |

# References and operating assumptions

Reference standards are guidance, not a claim of certified compliance. Verify dates and applicable legal obligations at implementation time.

Docker Compose service dependencies — https://docs.docker.com/reference/compose-file/services/

Prisma production migrations — https://www.prisma.io/docs/orm/v7/prisma-migrate/workflows/development-and-production

NIST SSDF SP 800-218 — https://csrc.nist.gov/projects/ssdf
