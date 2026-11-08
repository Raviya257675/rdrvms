# System architecture (draft)

## Context
Academic simulated incident reporters, volunteers, coordinators, and administrators access a secure browser application. No integration with official dispatch or emergency warnings.

## Containers
- React/Vite TypeScript frontend served via Nginx.
- Express API with REST, Socket.IO, scoped sessions and modular domain services.
- PostgreSQL stores users, membership, incidents, needs, assignment, inventory, notifications, audit and outbox.
- Same-origin HTTPS. API and database are not publicly reachable except through reverse proxy; DB has private network only.

## Domains
`identity`, `organizations`, `volunteers`, `incidents`, `relief-requests`, `assignments`, `inventory`, `notifications`, `audit`, `observability`.

## Correctness sequence
Client -> Nginx -> Express authentication/RBAC/Zod -> service -> Prisma DB transaction (state+audit+outbox+inbox) -> commit -> response. Worker emits minimal Socket.IO event; client refetches REST. Reconnect uses notification inbox.

## Real-time correctness
Socket.IO defaults to at-most-once delivery. Do not rely on it for durable assignments. See AT-018/019 and `docs/security/threat-model.md`.

## Deploy topology
Compose-first single Ubuntu VM + TLS. Additional Kubernetes/Redis/split services are deliberately deferred. See Word document 04.

## Data boundaries
Public response DTOs omit exact coordinates, personal contacts and verification evidence. Only scoped users may access restricted fields. Document additional access with ADR.
