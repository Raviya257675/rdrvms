# Feature test specifications

| Test ID | Requirement | Scenario / expected outcome | Status |
|---|---|---|---|
| AT-001 | FR-001 | Register with valid data; reject weak/duplicate email | Planned |
| AT-002 | FR-002 | Invalid session denied; logout revokes session | Planned |
| AT-004 | FR-004 | Parameterized RBAC read/write denial matrix across roles | Planned |
| AT-027 | FR-027 | Suspended user can no longer access with existing session | Planned |
| SEC-001 | NFR-007 | Unauthenticated requests denied; object-level policy checked | Planned |

## Required boundary scenarios
- Duplicate email, weak password, invalid reset token, login brute force, CSRF absence
- User in wrong organization; suspended account; forged role in request body

No tests have been implemented or executed yet. Do not report passing results.
