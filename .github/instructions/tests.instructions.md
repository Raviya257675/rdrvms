---
applyTo: "tests/**/*,apps/**/*.test.ts,apps/**/*.spec.ts,apps/**/*.test.tsx"
---
# Tests instructions
- Translate approved acceptance to repeatable tests; do not fabricate green results.
- Test first: capture failing command before implementation. No `skip`/`only` on release tests.
- Each P0 business flow requires happy, invalid, unauthenticated, unauthorized and concurrency/failure cases as relevant.
- Use fictional deterministic fixtures; isolated disposable DB; never reset staging or production data.
- Pair every test with FR/AT IDs in descriptions or metadata. Preserve assertions when refactoring.
