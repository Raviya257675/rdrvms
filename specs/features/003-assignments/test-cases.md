# Feature test specifications

| Test ID | Requirement | Scenario / expected outcome | Status |
|---|---|---|---|
| AT-005 | FR-005 | Volunteer availability edit persists; user cannot edit another profile | Planned |
| AT-014 | FR-014 | Coordinator assigns matching available volunteer | Planned |
| AT-015 | FR-015 | Only assigned volunteer may accept/decline | Planned |
| AT-016 | FR-016 | Two simultaneous accepts/assignments preserve invariant | Planned |
| AT-018 | FR-018 | Notification persisted before live emit | Planned |
| AT-019 | FR-019 | Offline user reconnects and retrieves missed events | Planned |
| AT-020 | FR-020 | Other user cannot read/acknowledge notifications | Planned |

## Required boundary scenarios
- Unavailable/suspended volunteer; wrong organization; request not approved; stale optimistic version
- Duplicate idempotency key, outbox worker restart, websocket room cross-user leakage

No tests have been implemented or executed yet. Do not report passing results.
