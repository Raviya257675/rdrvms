# ADR-0003: Durable inbox and outbox

- Status: **PROPOSED — human approval pending**
- Date: 2026-11-08
- Context: RDRVMS academic simulation, requirements FR and NFR, DevOps learning goals.
- Decision: Persist authoritative notification, audit and outbox in same transaction; socket best effort.
- Rationale: Offline users must not lose assignments.
- Alternatives considered: Socket-only event; external Kafka.
- Consequences: Keep scope small; revisit after measured bottleneck, privacy or grading change. Any breaking change updates SRS, tests, architecture diagram and deployment documentation.
- Approval: PENDING.
