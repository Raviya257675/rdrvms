# CI/CD implementation plan

## Active right now
`.github/workflows/docs-quality.yml`: validates documentation/test IDs and runs Python script tests. This does **not** build or test an unimplemented application.

## To implement as code arrives
1. Node workspaces and committed lockfile.
2. PR checks: prettier/eslint, `tsc`, Vitest, API integration PostgreSQL, OpenAPI, Playwright smoke.
3. Security: secret scanning, SCA, SAST and Docker image scanning.
4. Build/publish immutable `web` and `api` image digests to GHCR under protected permissions.
5. On staging approval, apply reviewed `prisma migrate deploy`, deploy Compose images, smoke check.
6. Monitor `/health/ready`, metrics and dashboards. Human approval required for release promotion.

## Security
Read-only permissions by default; pin GitHub actions to reviewed immutable SHAs; no untrusted PR code with deploy secrets; use protected environments and OIDC where available. Secrets never in `VITE_*`.

## Rollback
Keep previous image digest and backup; schema rollback is not automatic. Use expansion migrations and forward-fix if schema incompatible.

## Deployment posture
Single Ubuntu VM, Nginx TLS, private PostgreSQL, encrypted backup destination. No public database/metrics port.
