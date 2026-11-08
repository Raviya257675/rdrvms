# Planned metrics

- `http_requests_total{route,method,status}` and duration histogram (bounded route labels, no user IDs).
- `rdrvms_outbox_pending_total`, `rdrvms_outbox_oldest_age_seconds`.
- `rdrvms_socket_connections` without personal room labels.
- PostgreSQL health/connection metrics and infrastructure CPU/memory/disk.
- Health endpoints `/health/live` and `/health/ready`; `/metrics` private.

Targets: demo-window availability >=99% and p95 read API <=500ms at controlled 50 active users. Record benchmark context. See Word 10,13.
