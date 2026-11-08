# Feature 003-assignments: Safe volunteer assignment and durable notifications

- Status: **PROPOSED, not yet approved or implemented**
- Requirements: FR-005, FR-014, FR-015, FR-016, FR-018, FR-019, FR-020
- Acceptance tests: AT-005, AT-014, AT-015, AT-016, AT-018, AT-019, AT-020
- Business value: As a coordinator, I can assign a suitable volunteer; as the volunteer I can accept/decline even if real-time connectivity is intermittent.

## In-scope scenarios
1. Given a verified incident, approved request and available volunteer, a scoped coordinator creates a PENDING assignment.
2. Given correct volunteer and current version, accept changes to ACCEPTED and writes audit+notification/outbox atomically.
3. Given another volunteer, attempt to accept is rejected and assignment remains unchanged.
4. Given simultaneous duplicate assignment/accept requests, only one effective state transition occurs.
5. Given socket disconnected at assignment time, the volunteer retrieves stored notification and assignment via REST after reconnect.

## Invalid / security scenarios
- Unavailable/suspended volunteer; wrong organization; request not approved; stale optimistic version
- Duplicate idempotency key, outbox worker restart, websocket room cross-user leakage

## Data handling
Fictional demo records only. Authorization scoped server-side. Never expose precise coordinates or secret credentials in redacted API responses, logs or websocket messages.

## Out of scope
Official warning integration, autonomous dispatch, payment processing and public emergency operations.

## Definition of Done
All linked test IDs have truthful failing-then-passing evidence, contract and traceability updated, no unresolved high security risks, human PR approval obtained.

## Open decisions
See `docs/decisions/open-questions.md`; new ambiguity must be recorded before implementation.
