**Real-Time Disaster Relief & Volunteer Management System**

Document ID: RDRVMS-05 \| Version: 0.1 (draft baseline) \| Issued: 08 November 2026

**Purpose** Implementable REST/WebSocket designs, status machines, transaction invariants, error handling and cross-cutting contracts.

**Status & approvals** Proposed design baseline, not signed off. Product owner/team and module supervisor must approve requirements, privacy decisions, service-level targets, and any external integrations before development or real-world use.

**Audience** Project team, module supervisor, reviewers

# Implementation baseline

Frontend: React + Vite + TypeScript + Tailwind CSS + React Router + TanStack Query. API: Node.js LTS + Express + TypeScript + Zod + Prisma + Socket.IO. Database: PostgreSQL. Versions are pinned by lockfiles when scaffolded, not invented here. Use Node.js version supported by chosen Prisma major version.

# API inventory (draft; implementation requires full schema review)

| **Method** | **Path** | **Access** | **FR** | **Success/error** |
|----|----|----|----|----|
| POST | /api/v1/auth/register | Guest | FR-001 | 201/400/409 |
| POST | /api/v1/auth/login | Guest | FR-002 | 200/401/429 |
| POST | /api/v1/auth/logout | Authenticated | FR-002 | 204 |
| GET | /api/v1/auth/me | Authenticated | FR-002 | 200/401 |
| GET | /api/v1/incidents | Public, redacted | FR-010 | 200 |
| POST | /api/v1/incidents | Reporter+ | FR-007 | 201/400 |
| GET | /api/v1/incidents/{id} | Scoped | FR-013 | 200/403/404 |
| PATCH | /api/v1/incidents/{id}/verify | Coordinator | FR-008 | 200/403/409 |
| PATCH | /api/v1/incidents/{id}/status | Coordinator | FR-009 | 200/409 |
| GET | /api/v1/relief-requests | Scoped | FR-013 | 200 |
| POST | /api/v1/relief-requests | Coordinator | FR-011 | 201/409 |
| PATCH | /api/v1/relief-requests/{id} | Coordinator | FR-012 | 200/409 |
| POST | /api/v1/relief-requests/{id}/approve | Coordinator | FR-012 | 200/409 |
| POST | /api/v1/assignments | Coordinator | FR-014 | 201/409 |
| GET | /api/v1/assignments/mine | Volunteer | FR-015 | 200 |
| POST | /api/v1/assignments/{id}/accept | Assigned volunteer | FR-015 | 200/409 |
| POST | /api/v1/assignments/{id}/decline | Assigned volunteer | FR-015 | 200/409 |
| POST | /api/v1/assignments/{id}/complete | Assigned volunteer/coord | FR-016 | 200/409 |
| GET | /api/v1/notifications | Authenticated | FR-019 | 200 |
| PATCH | /api/v1/notifications/{id}/read | Owner | FR-020 | 200/404 |
| GET | /api/v1/inventory | Coordinator | FR-021 | 200 |
| POST | /api/v1/inventory | Coordinator | FR-021 | 201 |
| POST | /api/v1/allocations | Coordinator | FR-022 | 201/409 |
| GET | /api/v1/admin/users | Admin | FR-027 | 200 |
| PATCH | /api/v1/admin/users/{id}/status | Admin | FR-027 | 200 |
| GET | /health/live | Ops | FR-029 | 200 |
| GET | /health/ready | Ops | FR-029 | 200/503 |
| GET | /metrics | Private ops | FR-032 | 200 |
| POST | /api/v1/auth/email/verify | Guest | FR-001 | 200/400 |
| POST | /api/v1/auth/forgot-password | Guest | FR-003 | 200/429 |
| POST | /api/v1/auth/reset-password | Guest | FR-003 | 200/400 |
| GET | /api/v1/volunteers/me | Volunteer | FR-005 | 200/401 |
| PATCH | /api/v1/volunteers/me | Volunteer | FR-005 | 200/400 |
| GET | /api/v1/volunteers | Coordinator | FR-014 | 200/403 |
| POST | /api/v1/admin/organizations | Admin | FR-006 | 201/403 |
| POST | /api/v1/admin/memberships | Admin | FR-006 | 201/403 |
| POST | /api/v1/assignments/{id}/reassign | Coordinator | FR-017 | 200/409 |
| GET | /api/v1/dashboard | Authenticated | FR-023 | 200/401 |
| POST | /api/v1/incidents/{id}/evidence | Reporter+ | FR-026 | 201/400 |
| GET | /api/v1/admin/audit-events | Admin | FR-025 | 200/403 |
| GET | /api/v1/exports/incidents | Coordinator | FR-028 | 200/403 |
| POST | /api/v1/privacy/requests | Authenticated | FR-030 | 201/400 |
| PATCH | /api/v1/relief-requests/{id}/close | Coordinator | FR-012 | 200/409 |
| POST | /api/v1/allocations/{id}/release | Coordinator | FR-022 | 200/409 |
| GET | /api/v1/incidents/{id}/map | Scoped | FR-024 | 200/403 |
| PATCH | /api/v1/admin/users/{id}/roles | Admin | FR-027 | 200/403 |

# Uniform API conventions

- Prefix /api/v1; JSON UTF-8; identifiers are UUIDs; timestamps ISO 8601 UTC.

- Errors shaped { error: { code, message, requestId, details? } }; never leak SQL, stack traces or secrets.

- List responses shaped { data: \[...\], page: { nextCursor, limit } }; order deterministic by createdAt,id.

- Use 400 for malformed request, 401 unauthenticated, 403 unauthorized, 404 unavailable/hidden, 409 state/version conflict, 422 invalid business rule, 429 rate limit, 5xx internal failures.

- Mutation routes require CSRF token for cookie-authenticated requests, and authorization is evaluated on the target object.

- All resources have id, createdAt, updatedAt; mutable workflow records have version for optimistic concurrency.

- Sensitive IDs must be authorized before returning their existence; avoid ID enumeration in 403/404 differences.

# Key endpoint request/response examples

POST /api/v1/incidents

{ "title":"Flooded access road", "type":"FLOOD",

"district":"GALLE", "approximateLocation":{"lat":6.04,"lon":80.22},

"description":"Road partially blocked" }

201 {"data":{"id":"\<uuid\>","status":"UNVERIFIED","version":1}}

POST /api/v1/assignments

{ "reliefRequestId":"\<uuid\>", "volunteerId":"\<uuid\>",

"expectedRequestVersion":2, "idempotencyKey":"\<uuid\>" }

201 {"data":{"id":"\<uuid\>","status":"PENDING","version":1}}

# State machines and invariants

| **Aggregate** | **Allowed transitions** | **Guards** |
|----|----|----|
| Incident | UNVERIFIED→VERIFIED/REJECTED; VERIFIED→ACTIVE→RESOLVED | Coordinator scope; verify reason; version checked |
| Relief request | DRAFT→APPROVED→IN_PROGRESS→FULFILLED; any active→CANCELLED | Verified incident; positive qty; coordinator |
| Assignment | PENDING→ACCEPTED→IN_PROGRESS→COMPLETED; PENDING→DECLINED/CANCELLED | Assigned volunteer or scoped coordinator; version checked |
| Allocation | RESERVED→DISPATCHED→CONSUMED or RELEASED | Nonnegative inventory; audit and compensation |

# Concurrent assignment transaction pseudocode

1.  Read request and volunteer current states inside a DB transaction.

2.  Confirm request APPROVED, incident VERIFIED, volunteer AVAILABLE and actor allowed for the organization.

3.  Use conditional update/version or uniqueness constraint to reject duplicate active work; do not trust frontend disabling of buttons.

4.  Create assignment, audit event, notification and outbox event in the same transaction.

5.  Commit before returning 201; retry safe for same idempotency key and return existing result.

6.  Outbox processor dispatches a recipient-scoped Socket.IO event, marks delivery attempt, and allows REST inbox reconciliation.

# WebSocket contract

| **Event name** | **Payload fields** | **Audience / reliability** |
|----|----|----|
| notification.created | eventId, notificationId, kind, occurredAt | Recipient only; DB persisted first |
| assignment.updated | eventId, assignmentId, status, version | Assigned volunteer + authorized coordinator |
| incident.updated | eventId, incidentId, status, version | Authorized district/org rooms only |
| client.sync-required | occurredAt, reason | Client refetches REST; never authoritative state |

Socket.IO is ordered but by default uses at-most-once message delivery. Do not assume exactly-once delivery or replay. Persist notifications and reconcile on reconnect. For horizontal scaling, review a shared adapter, sticky sessions where required and session revocation propagation.

# Frontend state and error behavior

- Treat TanStack Query server cache as derived state; successful mutations invalidate affected keys.

- Do not acknowledge high-impact mutations optimistically before server confirmation.

- A socket event carries IDs/version; client refetches rather than treating arbitrary pushed payload as authoritative.

- Store no passwords, session secrets or precise incident locations in localStorage.

- Implement route error boundaries, offline banner and 409 conflict recovery.

# File uploads and integration boundaries

Proposed P1 evidence upload: 5 MB max per image, allowlist JPEG/PNG/WebP, server-side signature check and malware scanning where available, random object names, private object storage and authorized download access. Keep upload work outside the main API transaction; use pending upload metadata and orphan cleanup.

# Before implementing each endpoint

- Define the exact request and response Zod/OpenAPI schemas, including nullability, pagination and serialization.

- Document actor permission, object ownership, organization scope and field-level redaction on success and error.

- Specify transaction boundaries, audit/outbox entries, version checks and idempotency semantics for each command.

- Create happy-path, unauthenticated, forbidden, invalid-data, conflict and retry tests before writing the handler.

- Ensure socket payloads contain only safe identifiers/statuses and trigger REST reconciliation.

- Review metric labels, logging privacy, rate limits and user-facing failure messages.

- Record deployment/migration compatibility and contract version policy before merging.
