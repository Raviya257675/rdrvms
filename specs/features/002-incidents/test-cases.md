# Feature test specifications

| Test ID | Requirement | Scenario / expected outcome | Status |
|---|---|---|---|
| AT-007 | FR-007 | Incident creates UNVERIFIED and validates location/lengths | Planned |
| AT-008 | FR-008 | Volunteer cannot verify; coordinator reason recorded | Planned |
| AT-009 | FR-009 | Illegal incident state transition returns 409 | Planned |
| AT-010 | FR-010 | Search/pagination filters and empty state | Planned |
| AT-013 | FR-013 | Public API never reveals sensitive names/coordinates | Planned |
| AT-024 | FR-024 | Approximate public points; precise restricted view | Planned |

## Required boundary scenarios
- Out-of-range lat/lon, oversized description, stale update version and invalid transitions
- Cross-organization access, evidence URL leakage, forged verification flag

No tests have been implemented or executed yet. Do not report passing results.
