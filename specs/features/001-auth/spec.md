# Feature 001-auth: Secure user registration, session and role access

- Status: **PROPOSED, not yet approved or implemented**
- Requirements: FR-001, FR-002, FR-004, FR-027
- Acceptance tests: AT-001, AT-002, AT-004, AT-027, SEC-001
- Business value: As a registered reporter or volunteer, I need a secure sign-in and access only to my resources so that my records remain protected.

## In-scope scenarios
1. Given a unique valid email and strong password, registration creates an inactive/unverified account until approved verification.
2. Given a valid active account, sign-in creates a secure server-side session and GET /auth/me returns role-safe DTO.
3. Given an unauthenticated browser, protected routes respond 401 and never leak personal fields.
4. Given a volunteer, attempts to verify an incident or suspend a user return 403/404 safely.
5. Given an admin suspends a user, future API requests using an existing session are denied after revocation.

## Invalid / security scenarios
- Duplicate email, weak password, invalid reset token, login brute force, CSRF absence
- User in wrong organization; suspended account; forged role in request body

## Data handling
Fictional demo records only. Authorization scoped server-side. Never expose precise coordinates or secret credentials in redacted API responses, logs or websocket messages.

## Out of scope
Official warning integration, autonomous dispatch, payment processing and public emergency operations.

## Definition of Done
All linked test IDs have truthful failing-then-passing evidence, contract and traceability updated, no unresolved high security risks, human PR approval obtained.

## Open decisions
See `docs/decisions/open-questions.md`; new ambiguity must be recorded before implementation.
