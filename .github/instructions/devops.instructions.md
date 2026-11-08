---
applyTo: ".github/workflows/**,infra/**,Dockerfile*,**/Dockerfile*"
---
# DevOps instructions
- Work only under authorized environment. Deployment/secrets/permission changes require human approval.
- CI defaults to read-only permissions and verified pinned action commit SHAs.
- No secrets in Docker builds, browser variables, CI log output or Git. Use image version/digest and scans.
- DB migrations in shared environments use reviewed `prisma migrate deploy`; do not run `db push` or `migrate dev` there.
- Compose readiness must use health checks; backups, secure TLS, logs, metrics and rollback plans are mandatory release gates.
- This repository is documentation-only initially: do not claim example compose deploys a complete app.
