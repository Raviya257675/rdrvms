# Local foundation verification — 2026-11-09

Scope: Master Prompt 01, limited user authorization for the Express/TypeScript foundation. No broader ADR or domain-policy approval is recorded.

Branch: `feature/backend-foundation`. Base commit: `24143a2512bcae937b9d34209158bf13ce6778ee`. Verification used uncommitted working-tree changes; there is no new code SHA, PR, CI run, reviewer sign-off or deployment.

Runtime: Node.js `v24.22.2`, npm `11.19.1`. Direct versions are pinned in `apps/api/package.json` and the lockfile: Express 5.3.0; TypeScript 7.0.2; tsx 4.23.15; @types/node 24.19.2; @types/express 5.0.6; Vitest 5.1.0; Supertest 7.3.2; @types/supertest 7.2.1.

## RED, before behavior implementation

Endpoint tests were written first. The only API source was an empty Express factory accepting an optional internal router; no liveness, JSON parser, error middleware, request-ID middleware, configuration module or shutdown module existed.

From `apps/api`:

```bash
npm test -- --reporter=verbose
```

The first sandboxed run failed with `listen EPERM`; that environment failure is not behavioral RED evidence. Registry access also initially failed with `EAI_AGAIN`. Network/local-socket escalation was requested instead of bypassing the sandbox.

The same test command was rerun with local-socket permission before implementing behavior. Exit status: **1**. Exact summary:

```text
Test Files  3 failed (3)
     Tests  12 failed (12)
```

Two suites could not load the not-yet-created `config` and `shutdown` modules. All 12 collected endpoint cases failed, including:

- Liveness: `expected 404 to be 200`.
- Missing routes: `text/html; charset=utf-8` instead of JSON.
- Request IDs: missing header.
- Unexpected error: empty parsed body instead of the safe error envelope.
- Untrusted exception status: `expected 418 to be 500`.
- Malformed/oversized/unsupported JSON: 404 instead of 400/413/415.

Existing test assertions were retained for implementation and GREEN.

## GREEN and static verification

From `apps/api`:

```bash
npm test -- --reporter=verbose
npm run typecheck
npm run build
npm ls --depth=0
```

Observed results:

```text
Test Files  3 passed (3)
     Tests  33 passed (33)
```

The test command exited **0**. Endpoint/contract tests: 12; configuration tests: 18; shutdown tests: 3. No test was skipped or disabled. Source and test TypeScript checking exited **0**; the production build exited **0**; `npm ls --depth=0` exited **0** with only the eight approved direct packages.

## Local runtime smoke

A temporary harness outside the repository was executed with:

```bash
node /tmp/rdrvms-foundation-smoke.mjs
```

It spawned only local Node processes using the compiled application and explicitly supplied nonsecret HOST/PORT settings, and exited **0**. It checked:

```text
PASS: importing/creating the compiled app exits without a listening socket
PASS: built server returns 200/404 and exits cleanly on SIGTERM
PASS: built server returns 200/404 and exits cleanly on SIGINT
PASS: invalid configuration exits 1 without exposing its value
PASS: occupied port exits 1 without exposing an internal exception
```

The temporary smoke harness is not a committed test artifact. The README provides reproducible local build/start/curl commands; automated shutdown-drain/deadline cases are retained in `tests/shutdown.test.ts`. Signal smoke verified idle shutdown, not a real in-flight request drain; that behavior was exercised through the mocked HTTP server unit tests.

Development entry was also started with:

```bash
HOST=127.0.0.1 PORT=49187 npm run dev
```

Observed: `tsx watch src/server.ts` and `API listening on 127.0.0.1:49187`. It was stopped with Ctrl+C; the watcher command exited **1** after interruption. This is development-start evidence, not a successful production-exit assertion. Production SIGINT/SIGTERM checks above exited **0**.

The install reported an esbuild postinstall approval warning. No install-script approval setting was added; Vitest, build and the actual tsx development start succeeded with the installed platform packages.

## Documentation checks and limits

From the repository root:

```bash
python3 -B scripts/validate_pack.py
python3 -B -m unittest discover -s scripts -p 'test_*.py'
git diff --check
```

Documentation validation passed and all **3** documentation-validator unit tests passed. The validator status note was corrected to distinguish documentation checks from application test execution. Updated CSV files use LF line endings per `.editorconfig` so the final whitespace check is clean.

FND-001..005 are marked `Implemented`, with CI fields empty. FR-029/AT-029, FR-032/AT-032 and affected broader NFRs remain in progress; database readiness, full request logs/metrics, full secret scanning and overall requirement acceptance are unverified. The liveness contract assertion is a narrow schema check, not general OpenAPI validation.

No `.env`/credentials were opened; no PostgreSQL connection, data access, migration, authentication, session, RBAC, frontend or infrastructure change was made. No coverage, vulnerability scan, CI, browser test, deployment or human code-review result is claimed. Next slice requires separate approval for PostgreSQL/Prisma connectivity and real readiness; do not begin it automatically.
