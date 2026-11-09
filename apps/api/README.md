# RDRVMS API foundation

Academic simulation; not an official emergency service. Only the minimal Express + TypeScript foundation is implemented. Authentication, sessions, RBAC, domain APIs, Prisma, database readiness, Socket.IO, metrics and deployment remain pending separately approved slices.

## Requirements

- Node.js 24 and npm. The lockfile records exact dependencies; Express is the only production dependency.
- Run the following commands from the repository root. No root workspace/package or frontend changes are required.
- PostgreSQL is not accessed by this milestone. No database credentials or `.env` file are needed or loaded.

## Install and develop

```bash
npm --prefix apps/api ci
npm --prefix apps/api run dev
```

Defaults: `http://127.0.0.1:3000`. Stop with Ctrl+C. `tsx watch` restarts the development process on source changes.

Set nonsecret process variables explicitly when needed:

```bash
HOST=127.0.0.1 PORT=3001 npm --prefix apps/api run dev
```

`HOST` accepts an IP address or hostname; `PORT` is an integer from 1 through 65535. Empty/invalid settings fail startup without printing their values. Environment files are not automatically read; do not source or print the repository `.env` for this foundation.

## Tests, types and build

```bash
npm --prefix apps/api test
npm --prefix apps/api run test:watch
npm --prefix apps/api run typecheck
npm --prefix apps/api run build
```

`test` runs Vitest once; Supertest uses temporary local sockets. `typecheck` checks both source and tests. `build` emits only application JavaScript into the ignored `apps/api/dist` directory. The root `tests/templates` examples are not discovered by this package.

## Production-mode local start

```bash
npm --prefix apps/api run build
npm --prefix apps/api start
```

This starts compiled JavaScript with Node, without tsx or a build at startup. It is a local runtime check, not a deployment procedure. SIGINT/SIGTERM stop accepting new connections and drain active requests; remaining HTTP connections are force-closed after 10 seconds with unsuccessful exit status.

In another terminal:

```bash
curl -i http://127.0.0.1:3000/health/live
curl -i http://127.0.0.1:3000/api/v1/nonexistent
```

Expected: 200 JSON `{"status":"ok"}` and 404 JSON with code `NOT_FOUND`. `/health/ready` also returns 404 because database readiness is not implemented. Liveness says only that the HTTP process can respond.

## Structure and safe responses

- `src/app.ts`: import-safe app factory; only `src/server.ts` binds a listening socket.
- `src/config.ts`: selected nonsecret environment validation.
- `src/http/errors.ts`: sanitized JSON errors; malformed JSON 400, oversized JSON 413, unsupported encoding 415, unexpected failures 500.
- `src/shutdown.ts`: idempotent bounded HTTP drain.
- `tests/`: endpoint/contract, configuration and shutdown verification.

Every response gets a server-generated `X-Request-Id`; error bodies use `{ "error": { "code", "message", "requestId" } }`. Incoming request IDs are ignored. JSON bodies are limited to 64 KiB and compressed JSON is rejected. Exceptions, stacks, input bodies, query strings and credentials are not logged or reflected in errors. No request logger, security-policy middleware or protected resource is introduced.

See `specs/features/000-backend-foundation/` for the approved scope and local RED/GREEN evidence. FR-029/AT-029 and FR-032/AT-032 remain incomplete beyond this milestone; local tests are not CI approval or release evidence.
