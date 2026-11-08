**Real-Time Disaster Relief & Volunteer Management System**

Document ID: RDRVMS-04 \| Version: 0.1 (draft baseline) \| Issued: 08 November 2026

**Purpose** C4-style views, bounded modules, deployment topology, quality tradeoffs and decisions for a modular monolith.

**Status & approvals** Proposed design baseline, not signed off. Product owner/team and module supervisor must approve requirements, privacy decisions, service-level targets, and any external integrations before development or real-world use.

**Audience** Project team, module supervisor, reviewers

# Architecture overview

Use a TypeScript monorepo containing React/Vite frontend, Express/Socket.IO API, PostgreSQL database, shared schema/types packages, and Docker Compose deployment. Start with one modular API service, not distributed microservices. Nginx serves the SPA and reverse-proxies /api and /socket.io under one origin.

<img src="media/image1.png" title="RDRVMS proposed container architecture" style="width:6.14173in;height:3.72466in" alt="Proposed system deployment: browser users via Nginx reverse proxy to React frontend and Express Socket.IO backend, connected to PostgreSQL; Docker Compose on a single demonstration VM." />

# System context and trust boundaries

| **Actor / system** | **Direction** | **Trusted capabilities and boundary** |
|----|----|----|
| Browser | HTTPS/WSS → web tier | Untrusted input; no credentials in bundles; cookies scoped by browser |
| Reporter/Volunteer | Browser → API | Authenticated, owns only permitted objects |
| Coordinator/Admin | Browser → API | Privileged, scoped and audited |
| PostgreSQL | API ↔ private data store | Not internet-addressable; credential-restricted |
| Object storage (P1) | API ↔ file store | Signed access / server mediation; malware/type checks |
| Metrics/Logs | API → ops collector | No private contacts or tokens; access restricted |
| Email/SMS (later) | Outbound gateway | Optional, provider failure cannot corrupt core state |

# Logical components

| **Layer** | **Module** | **Responsibilities** |
|----|----|----|
| Frontend | auth, dashboard, incident, request, volunteer, notifications, admin | UI, forms, cache, route guards (presentation only), accessibility |
| API routes | REST controllers + websocket gateway | Parse/validate input, enforce auth, uniform errors |
| Application | incident, relief, assignment, inventory, identity services | Transactions, business rules, permissions, workflows |
| Data | Prisma repositories + Postgres | Persistence, optimistic versions, unique constraints, audit/outbox |
| Cross-cutting | observability, jobs, file handling, policy | Correlation IDs, retries, health, guardrails |

# Core data and event flows

1.  Client POSTs command with cookie-backed session and CSRF protection; Nginx routes to Express.

2.  Middleware authenticates and rate-limits; Zod validates payload; service checks membership and resource-level RBAC.

3.  Domain service performs mutation with optimistic version and relevant audit/notification/outbox writes in a database transaction.

4.  After commit, API returns authoritative resource; outbox worker asynchronously pushes user-scoped socket event.

5.  Client refetches authoritative data; after disconnect, inbox REST request reconciles events missed while offline.

# Deployment decision

Initial topology: one Ubuntu VM with Nginx, frontend static image, API container, Postgres container with persistent volume, and restricted backup destination. For additional durability, use a managed PostgreSQL service when budget and grading permit. Never publish database port publicly. Multi-VM HA is not part of MVP.

# Cross-cutting quality design

| **Quality** | **Design choice** | **Tradeoff** |
|----|----|----|
| Reliability | DB authoritative; outbox + notification inbox | More tables/work vs lost alerts |
| Simplicity | Single API service, modular domains | No independent module scaling initially |
| Security | Secure same-origin cookie session + RBAC | CSRF defense required on mutations |
| Testability | Dependency-injected services and fixtures | Some upfront structure |
| Delivery | GitHub Actions + versioned Docker images | Runner setup and secrets management |
| Scalability | PostgreSQL indexes; stateless API except sessions stored in DB | Socket room coordination needed across replicas |

# Architecture decision register

| **ADR** | **Decision / rationale** | **Status** |
|----|----|----|
| ADR-0001 | TypeScript monorepo; shared tooling and contracts | Proposed |
| ADR-0002 | React/Vite SPA rather than SSR; simpler static hosting | Proposed |
| ADR-0003 | Express modular monolith; reduce ops complexity | Proposed |
| ADR-0004 | PostgreSQL/Prisma; normalized relationships and migrations | Proposed |
| ADR-0005 | Session cookie auth; server-side sessions, CSRF protections | Proposed |
| ADR-0006 | Socket.IO for best-effort live delivery + durable inbox/outbox | Proposed |
| ADR-0007 | Compose-first deployment; Kubernetes deferred | Proposed |

# Boundary and failure considerations

- Socket outage: app remains useful over REST; users see connectivity status and inbox refresh.

- Database outage: readiness degrades, writes fail safely; retries must not duplicate committed commands.

- Delayed notification: outbox worker retries with capped attempts; UI reconciles via REST.

- Misconfigured deploy: readiness/health checks block promotion; rollback images, but never blindly reverse irreversible DB migrations.

- Compromised user: revoke sessions and organization membership; alert operations and preserve audit evidence.
