# Contributor workflow

1. Select approved user story and create branch `feat/US-xxx-short-name` or `fix/BUG-xxx-short-name`.
2. Attach `spec.md`, `plan.md`, `tasks.md` and linked FR/AT IDs.
3. Write failing tests first. Keep commits small and descriptive.
4. Run relevant tests and documentation validator; document unrun tests explicitly.
5. Open PR using template, include screenshots only with synthetic data, record any new dependencies/DB migrations.
6. Require human review before merge. No force push to protected main; never commit secrets or personal real-user data.
