# Copilot repository instructions

Read `AGENTS.md`, `.specify/memory/constitution.md`, `docs/security/threat-model.md` and the feature's `spec.md` before producing code.
Implement one approved story; use RED → GREEN → REFACTOR. Reference FR/AT IDs. Respect the TypeScript/React/Express/PostgreSQL modular monolith. Update OpenAPI/schema/docs alongside changes. Every API permission is checked on the server; clients are untrusted. Store notifications in DB before best-effort socket delivery. Preserve privacy and coarse public geolocation. Never commit secrets. Report which tests you actually ran and what remains unverified. Never perform autonomous deployment or destructive migration.
