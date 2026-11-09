# Feature 000: Minimal backend foundation

- Authorization: user approved this foundation only in Master Prompt 01 on 2026-11-09.
- Scope approval does not ratify the constitution, existing ADRs, or domain policies.
- Requirements: FR-029 / AT-029 (liveness portion only), FR-032 / AT-032 (request IDs only), NFR-017, NFR-018, NFR-019, NFR-025 (JSON size bound only).
- Completion of this feature does not complete those broader requirements.

## Acceptance

1. Create a private Node.js 24 Express 5 TypeScript package in `apps/api`, with development, test, typecheck, build and production-start scripts.
2. `createApp()` creates an application without opening a listening socket, accessing a database or loading an environment file.
3. Public `GET /health/live` returns 200 JSON `{ "status": "ok" }`, without configuration or version details.
4. Unknown routes return 404 JSON with `error.code`, a fixed safe `message` and a generated `requestId`; never echo the requested URL or query.
5. Central error handling returns sanitized 500 JSON for unexpected synchronous/asynchronous exceptions. Malformed JSON returns 400; bodies over 64 KiB return 413; unsupported compressed/charset JSON returns 415. No exception, body or stack is returned or logged.
6. Responses have server-generated `X-Request-Id` UUIDs and omit `X-Powered-By`. Incoming request IDs are not trusted.
7. Read only HOST and PORT from the process environment; default to `127.0.0.1:3000`. Reject invalid values without exposing them. Never load `.env` or require database credentials.
8. SIGINT/SIGTERM stop accepting connections, allow active requests to finish, and force-close remaining HTTP connections after 10 seconds with unsuccessful exit status. Repeated signals do not start duplicate shutdowns.

## Boundaries

Only the eight directly approved packages are allowed: express, typescript, tsx, @types/node, @types/express, vitest, supertest, @types/supertest; their transitive dependencies are lockfile-managed. No root workspace setup or frontend changes are needed.

No readiness endpoint, metrics, database connection/schema/migration, authentication, session, RBAC, domain API, Socket.IO, deployment, external service or real-person data. `/health/ready` remains unimplemented (404), never falsely healthy. No domain decisions are approved by this slice.

## Review

Human code review remains required. No supervisor/team approval, CI result, commit or release is implied by local implementation evidence.
