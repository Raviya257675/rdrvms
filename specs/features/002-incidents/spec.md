# Feature 002-incidents: Report, review and verify simulated incidents

- Status: **PROPOSED, not yet approved or implemented**
- Requirements: FR-007, FR-008, FR-009, FR-010, FR-013, FR-024
- Acceptance tests: AT-007, AT-008, AT-009, AT-010, AT-013, AT-024
- Business value: As a reporter, I can submit an incident; as a coordinator I can verify it; as an observer I see only safe aggregated details.

## In-scope scenarios
1. Given a reporter submits valid title, type, district and approximate point, create incident UNVERIFIED and an audit event.
2. Given active coordinator scope, verify or reject with reason and persist verifier/timestamp.
3. Given unverified incident, a noncoordinator cannot change status even when directly calling REST API.
4. Given a public list request, only permitted redacted incident fields are visible, never precise coordinates/identity.
5. Given list queries, pagination and filtering produce stable results and respect scope.

## Invalid / security scenarios
- Out-of-range lat/lon, oversized description, stale update version and invalid transitions
- Cross-organization access, evidence URL leakage, forged verification flag

## Data handling
Fictional demo records only. Authorization scoped server-side. Never expose precise coordinates or secret credentials in redacted API responses, logs or websocket messages.

## Out of scope
Official warning integration, autonomous dispatch, payment processing and public emergency operations.

## Definition of Done
All linked test IDs have truthful failing-then-passing evidence, contract and traceability updated, no unresolved high security risks, human PR approval obtained.

## Open decisions
See `docs/decisions/open-questions.md`; new ambiguity must be recorded before implementation.
