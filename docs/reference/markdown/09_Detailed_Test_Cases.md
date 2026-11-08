**Real-Time Disaster Relief & Volunteer Management System**

Document ID: RDRVMS-09 \| Version: 0.1 (draft baseline) \| Issued: 08 November 2026

**Purpose** Concrete traceable test inventory with expected outcomes, priorities, security, performance and resilience coverage.

**Status & approvals** Proposed design baseline, not signed off. Product owner/team and module supervisor must approve requirements, privacy decisions, service-level targets, and any external integrations before development or real-world use.

**Audience** Project team, module supervisor, reviewers

# Test identifier policy

AT denotes functional acceptance tests; SEC security controls; PERF performance; OPS operations. Each test row must eventually include implementation filename, automated/manual status, last CI run link, owner, and defect reference in the live CSV. The entries below are test specifications, not executed results.

# Functional, security and operations cases

| **Test ID** | **Req** | **Verification scenario + expected result** | **Level** | **Priority** |
|----|----|----|----|----|
| AT-001 | FR-001 | Register with valid data; reject weak/duplicate email | API integration | P0 |
| AT-002 | FR-002 | Invalid session denied; logout revokes session | API/security | P0 |
| AT-003 | FR-003 | Reset token expires and cannot be reused | API/security | P1 |
| AT-004 | FR-004 | Parameterized RBAC read/write denial matrix across roles | API/security | P0 |
| AT-005 | FR-005 | Volunteer availability edit persists; user cannot edit another profile | API integration | P0 |
| AT-006 | FR-006 | Admin manages membership; coordinator denied | API/security | P1 |
| AT-007 | FR-007 | Incident creates UNVERIFIED and validates location/lengths | API integration | P0 |
| AT-008 | FR-008 | Volunteer cannot verify; coordinator reason recorded | API/security | P0 |
| AT-009 | FR-009 | Illegal incident state transition returns 409 | Domain unit + API | P0 |
| AT-010 | FR-010 | Search/pagination filters and empty state | API + E2E | P0 |
| AT-011 | FR-011 | Request references verified incident; invalid quantity rejected | API integration | P0 |
| AT-012 | FR-012 | Approve/close with audit record | API integration | P0 |
| AT-013 | FR-013 | Public API never reveals sensitive names/coordinates | API/security | P0 |
| AT-014 | FR-014 | Coordinator assigns matching available volunteer | API integration | P0 |
| AT-015 | FR-015 | Only assigned volunteer may accept/decline | API/security | P0 |
| AT-016 | FR-016 | Two simultaneous accepts/assignments preserve invariant | Concurrent DB test | P0 |
| AT-017 | FR-017 | Decline/reassignment reason persists and old status updates | API + E2E | P1 |
| AT-018 | FR-018 | Notification persisted before live emit | Integration + socket | P0 |
| AT-019 | FR-019 | Offline user reconnects and retrieves missed events | E2E + socket | P0 |
| AT-020 | FR-020 | Other user cannot read/acknowledge notifications | API/security | P0 |
| AT-021 | FR-021 | Inventory cannot become negative | Domain + API | P1 |
| AT-022 | FR-022 | Two concurrent allocation requests cannot oversubscribe inventory | Concurrent DB test | P1 |
| AT-023 | FR-023 | Role-specific dashboard does not leak restricted totals | E2E | P0 |
| AT-024 | FR-024 | Approximate public points; precise restricted view | E2E/security | P1 |
| AT-025 | FR-025 | Sensitive mutation always creates metadata-safe audit log | Integration | P0 |
| AT-026 | FR-026 | Wrong MIME/oversize/path traversal rejected | API/security | P1 |
| AT-027 | FR-027 | Suspended user can no longer access with existing session | API/security | P0 |
| AT-028 | FR-028 | Export strips private fields by default | API/security | P2 |
| AT-029 | FR-029 | Readiness drops when DB unavailable and recovers | Integration/ops | P0 |
| AT-030 | FR-030 | Data request tracked and processed only by authorized role | Manual+API | P1 |
| AT-031 | FR-031 | Container restart retains confirmed state | Integration/ops | P0 |
| AT-032 | FR-032 | Request ID logs and metrics present on failure | Integration/ops | P0 |
| AT-033 | FR-033 | Seed deterministic, fictional only | Data test | P0 |
| AT-034 | FR-034 | Keyboard navigation and errors are readable | E2E/a11y | P1 |
| AT-035 | FR-035 | High-impact action confirms and audit is present | E2E/API | P0 |
| SEC-001 | NFR-007 | Unauthenticated requests denied; object-level policy checked | Security | P0 |
| SEC-002 | NFR-017 | Secrets excluded from bundles and logs | Security | P0 |
| SEC-003 | NFR-025 | Rate limit login and validate payload sizes | Security | P0 |
| PERF-001 | NFR-001 | 50 concurrent p95 latency sample reported | Performance | P1 |
| OPS-001 | NFR-013 | Back up + restore DB in isolated environment | Recovery rehearsal | P0 |
| OPS-002 | NFR-014 | Fresh VM deployment with versioned images | DevOps smoke | P0 |
| OPS-003 | NFR-016 | Alert triggered on sustained API 5xx burst | Monitoring rehearsal | P1 |
| OPS-004 | NFR-023 | Encrypted backup access reviewed | Security/ops | P1 |
| NF-001 | NFR-001 | Load test reports read/write p95 under 50-user controlled environment | Performance | P1 |
| NF-002 | NFR-002 | Connected event latency distribution \<=3s target | Realtime | P1 |
| NF-003 | NFR-003 | Synthetic monitor calculates demonstration window uptime | Operations | P1 |
| NF-004 | NFR-004 | Concurrent double-commit invariant fails safely | Concurrency | P1 |
| NF-005 | NFR-005 | Restarted API retrieves acknowledged committed writes | Durability | P1 |
| NF-006 | NFR-006 | Dependency/image scans show zero unapproved critical/high findings | Security | P1 |
| NF-007 | NFR-007 | Object-scoped RBAC negative matrix complete | Security | P1 |
| NF-008 | NFR-008 | Verify HTTPS configuration and approved password hashing | Security | P1 |
| NF-009 | NFR-009 | Public API and map deny confidential person/location data | Privacy | P1 |
| NF-010 | NFR-010 | Sensitive mutations emit actor/target/requestId with no secrets | Audit | P1 |
| NF-011 | NFR-011 | Automated axe and manual keyboard review of critical flows | Accessibility | P1 |
| NF-012 | NFR-012 | Chrome Firefox Edge mobile smoke for key journeys | Compatibility | P1 |
| NF-013 | NFR-013 | Timed isolated backup recovery meets RPO/RTO planning targets | Recovery | P1 |
| NF-014 | NFR-014 | Fresh environment deploy of immutable image repeats reliably | Deployment | P1 |
| NF-015 | NFR-015 | All P0 FR map to valid test run evidence | Traceability | P1 |
| NF-016 | NFR-016 | Request IDs and API counters visible in dashboard | Observability | P1 |
| NF-017 | NFR-017 | Secret scanner finds no secrets in repository/bundles/logs | Secrets | P1 |
| NF-018 | NFR-018 | OpenAPI schema validation and breaking change review passes | API contract | P1 |
| NF-019 | NFR-019 | Architecture lint/manual review preserves modular boundaries | Maintainability | P1 |
| NF-020 | NFR-020 | User-facing strings review identifies hardcoded translation blockers | Localization | P1 |
| NF-021 | NFR-021 | Document reviewed WebSocket multi-replica growth strategy | Scalability | P1 |
| NF-022 | NFR-022 | Replay mutating command yields one effective domain side effect | Idempotency | P1 |
| NF-023 | NFR-023 | Encrypted backup exists and isolated restore verified | Backup | P1 |
| NF-024 | NFR-024 | Retention/data deletion policy approval recorded before pilot | Governance | P1 |
| NF-025 | NFR-025 | Rate-limit payload/query bounds survive abuse testing | Resilience | P1 |

# Executable-style BDD examples

## Incident verification

Feature: Human verification of reported disasters

Scenario: Coordinator verifies a submitted incident

Given a reporter has submitted an UNVERIFIED incident

And the coordinator has active permission for its organization

When the coordinator verifies it with a reason

Then the incident status becomes VERIFIED

And an audit event stores coordinator and reason

Scenario: Volunteer attempts to verify

Given a volunteer is authenticated

When the volunteer submits a verification request

Then the API denies access and the incident is unchanged

## Volunteers and reconnection

Feature: Durable assignment notifications

Scenario: Offline volunteer retrieves missed assignment

Given an approved relief request and an available volunteer

And the volunteer is disconnected from Socket.IO

When a coordinator assigns the volunteer

Then the assignment and notification persist in PostgreSQL

When the volunteer reconnects and requests their inbox

Then the missed notification and assignment are visible

## Inventory concurrency

Feature: No oversubscription of relief inventory

Scenario: Two coordinators concurrently reserve the last supplies

Given inventory quantity is 5

When two valid reserve requests of quantity 4 race

Then at most one reservation succeeds

And the available quantity never becomes negative

And failed requests do not produce dispatched allocation events

# Test data matrix

| **Dimension** | **Valid partition** | **Negative or boundary partitions** |
|----|----|----|
| Roles | Reporter, volunteer, coordinator, admin | Guest, suspended user, wrong org |
| Incident state | UNVERIFIED, VERIFIED, ACTIVE | REJECTED, RESOLVED, stale version |
| Request quantity | 1, 5, 100 | 0, negative, fractional for discrete units |
| Location | Approved district + approximate point | Missing, invalid range, precise public exposure |
| Connection | Connected websocket | Disconnected, reconnect, API restart |
| Assignment | PENDING for intended volunteer | Accepted already, wrong target, duplicate request |
| Upload | Small allowlisted image | Huge file, executable, disguised MIME |

# Traceability completion rules

- The CSV in Repository_Starter/tests/test-catalog.csv is the canonical live test inventory.

- Every P0 functional test should transition Planned → Implemented → Passing with a real CI result link.

- For release evidence, export a dated report listing each requirement and passing proof; report unverified items instead of assuming success.

# Test execution evidence record

| **Field**   | **Mandatory information**                        |
|-------------|--------------------------------------------------|
| Test case   | Test ID and requirement ID                       |
| Build       | Git SHA, image digest, database migration        |
| Environment | CI job, browser/version and DB fixture           |
| Steps       | Commands, parameters and repeatable setup        |
| Result      | Pass/fail/blocked with observed assertion result |
| Attachments | CI URL, screenshot/log sanitized of PII          |
| Defects     | Issue ID, owner, severity and retest status      |

# Failure triage and quality actions

- P0 functional failure: block release until corrected or formally exception-approved.

- Authorization/privacy defect: block release regardless of visual demonstration success.

- Flaky test: create issue, identify source of nondeterminism and do not repeatedly rerun until green without analysis.

- Accessibility, performance or resilience issue: compare with measurable NFR target and record approved deviation if any.

- Ensure every planned test becomes implemented with actual evidence, not just copied scenario text.
