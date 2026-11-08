# Operations runbooks

- RB-01 API unhealthy: check readiness/5xx, logs by request ID, VM resources, DB connectivity, release; smoke critical flow.
- RB-02 Database unavailable: preserve volume, check connections/disk, **never run destructive reset**; restore only with approval and verified backup.
- RB-03 Notification backlog: check persisted inbox/outbox, worker lag and socket authorization; replay safely and verify AT-019.
- RB-04 Account compromise: suspend user, revoke sessions, preserve audit, assess disclosure and rotate impacted credentials.
- RB-05 Failed deploy/migration: stop promotion, record versions, use reviewed compatible image rollback or forward fix.

See Word document 13 for detailed step-by-step runbooks, ownership, SLOs and incident record template.
