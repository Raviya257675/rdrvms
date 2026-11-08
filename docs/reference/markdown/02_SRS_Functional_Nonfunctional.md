**Real-Time Disaster Relief & Volunteer Management System**

Document ID: RDRVMS-02 \| Version: 0.1 (draft baseline) \| Issued: 08 November 2026

**Purpose** Implementable and testable baseline functional and non-functional requirements, business rules and change control.

**Status & approvals** Proposed design baseline, not signed off. Product owner/team and module supervisor must approve requirements, privacy decisions, service-level targets, and any external integrations before development or real-world use.

**Audience** Project team, module supervisor, reviewers

# Scope and conventions

MoSCoW-style priorities: P0 = required for core vertical-slice demonstration; P1 = targeted for a fuller release; P2 = stretch. Requirement identifiers must remain stable. Any test or code change must cite the corresponding requirement IDs. Requirements are proposed until formal team approval.

# Functional requirements

## Identity

| **ID** | **Mandatory behavior** | **Priority** | **Test** |
|----|----|----|----|
| FR-001 | Register an account with valid email, strong password, consent acknowledgement, and email verification before privileged access. | P0 | AT-001 |
| FR-002 | Sign in/out securely; session expiration and explicit revocation must invalidate access. | P0 | AT-002 |
| FR-003 | Recover account using single-use expiring reset token without exposing account existence. | P1 | AT-003 |

## Authorization

| **ID** | **Mandatory behavior** | **Priority** | **Test** |
|----|----|----|----|
| FR-004 | Enforce centrally defined role and resource-level authorization on every protected endpoint and websocket room. | P0 | AT-004 |

## Profile

| **ID** | **Mandatory behavior** | **Priority** | **Test** |
|----|----|----|----|
| FR-005 | Volunteer edits approved profile fields, skills, capacity, home region, and availability; default location is coarse-grained. | P0 | AT-005 |

## Organization

| **ID** | **Mandatory behavior** | **Priority** | **Test** |
|----|----|----|----|
| FR-006 | Administrator manages organization records and coordinator memberships with audit logging. | P1 | AT-006 |

## Incidents

| **ID** | **Mandatory behavior** | **Priority** | **Test** |
|----|----|----|----|
| FR-007 | Authenticated reporter submits incident with description, type, approximate geolocation, timestamp and optional evidence. | P0 | AT-007 |
| FR-008 | New incidents start UNVERIFIED; only coordinator/admin can verify/reject with rationale. | P0 | AT-008 |
| FR-009 | Authorized coordinator changes incident state using allowed transitions; audit each change. | P0 | AT-009 |
| FR-010 | Search/filter incident board by state, district, disaster type and time, with server-side pagination. | P0 | AT-010 |

## Relief needs

| **ID** | **Mandatory behavior** | **Priority** | **Test** |
|----|----|----|----|
| FR-011 | Create relief request linked to a verified incident, specifying need type, quantity, priority and notes. | P0 | AT-011 |
| FR-012 | Coordinator approves, updates, closes or cancels relief request with reason and actor/timestamp. | P0 | AT-012 |
| FR-013 | Display fulfillment status without publishing private recipient identities or precise locations to the public. | P0 | AT-013 |

## Assignments

| **ID** | **Mandatory behavior** | **Priority** | **Test** |
|----|----|----|----|
| FR-014 | Coordinator may assign eligible available volunteers to approved requests in permitted organizations/regions. | P0 | AT-014 |
| FR-015 | Volunteer accepts or declines a personal assignment; no other volunteer can modify it. | P0 | AT-015 |
| FR-016 | Assignment progresses through valid state machine; prevent double-assignment using transactional concurrency control. | P0 | AT-016 |
| FR-017 | Coordinator reassigns timed-out/declined work, records reasons, and notifies affected users. | P1 | AT-017 |

## Notifications

| **ID** | **Mandatory behavior** | **Priority** | **Test** |
|----|----|----|----|
| FR-018 | Persist actionable notification in database and publish best-effort live event to authorized client. | P0 | AT-018 |
| FR-019 | On reconnect, retrieve unread/missed notifications from API using cursor or timestamp; delivery cannot rely on Socket.IO only. | P0 | AT-019 |
| FR-020 | User reads/acknowledges owned notification; no access to another user notification. | P0 | AT-020 |

## Inventory

| **ID** | **Mandatory behavior** | **Priority** | **Test** |
|----|----|----|----|
| FR-021 | Coordinator tracks available supplies for an organization with nonnegative quantity and unit. | P1 | AT-021 |
| FR-022 | Allocate supplies to requests using an atomic transaction and audit allocation changes. | P1 | AT-022 |

## Dashboard

| **ID** | **Mandatory behavior** | **Priority** | **Test** |
|----|----|----|----|
| FR-023 | Role-aware dashboard summarizes verified incidents, open needs, volunteer availability and own assignments. | P0 | AT-023 |

## Maps

| **ID** | **Mandatory behavior** | **Priority** | **Test** |
|----|----|----|----|
| FR-024 | Display approximate incident markers; precise restricted coordinates only available to authorized responders. | P1 | AT-024 |

## Audit

| **ID** | **Mandatory behavior** | **Priority** | **Test** |
|----|----|----|----|
| FR-025 | Write tamper-evident-in-process structured audit events for privilege changes, verification, assignment and data access operations. | P0 | AT-025 |

## Uploads

| **ID** | **Mandatory behavior** | **Priority** | **Test** |
|----|----|----|----|
| FR-026 | Accept allowlisted image types within size limits, verify server-side and store outside app container. | P1 | AT-026 |

## Administration

| **ID** | **Mandatory behavior** | **Priority** | **Test** |
|----|----|----|----|
| FR-027 | Admin suspends users and removes privileges; active sessions must be invalidated. | P0 | AT-027 |

## Exports

| **ID** | **Mandatory behavior** | **Priority** | **Test** |
|----|----|----|----|
| FR-028 | Authorized coordinator exports sanitized incident/request summary without volunteer private contact details by default. | P2 | AT-028 |

## Health

| **ID** | **Mandatory behavior** | **Priority** | **Test** |
|----|----|----|----|
| FR-029 | Expose readiness/liveness endpoints; readiness fails when critical dependencies unavailable. | P0 | AT-029 |

## Data rights

| **ID** | **Mandatory behavior** | **Priority** | **Test** |
|----|----|----|----|
| FR-030 | Authorized admin can receive and action data access/correction/deletion requests under documented policy. | P1 | AT-030 |

## Resilience

| **ID** | **Mandatory behavior** | **Priority** | **Test** |
|----|----|----|----|
| FR-031 | After API restart, persisted incidents, requests, assignments and notifications remain consistent and retrievable. | P0 | AT-031 |

## Observability

| **ID** | **Mandatory behavior** | **Priority** | **Test** |
|----|----|----|----|
| FR-032 | Produce correlation IDs, structured logs and metrics for API, database and notification delivery. | P0 | AT-032 |

## Seed/demo

| **ID** | **Mandatory behavior** | **Priority** | **Test** |
|----|----|----|----|
| FR-033 | Provide deterministic fictional seed data and role test accounts with no real disaster victim personal data. | P0 | AT-033 |

## Accessibility

| **ID** | **Mandatory behavior** | **Priority** | **Test** |
|----|----|----|----|
| FR-034 | Core disaster submission and volunteer assignment journeys are keyboard accessible and communicate errors clearly. | P1 | AT-034 |

## Admin review

| **ID** | **Mandatory behavior** | **Priority** | **Test** |
|----|----|----|----|
| FR-035 | High-impact actions have confirmation, documented permission boundaries and audit evidence. | P0 | AT-035 |

# Non-functional requirements (measurable)

| **ID** | **Area** | **Target / measurable requirement** | **Evidence** |
|----|----|----|----|
| NFR-001 | Performance | At 50 concurrently active demo users, read-only API p95 \<= 500 ms and state-change API p95 \<= 900 ms; establish test machine/network assumptions. | k6 or equivalent test report |
| NFR-002 | Live latency | Connected clients receive 95% of test notifications in \<= 3 s under controlled local/demo network, excluding offline periods. | Event benchmark |
| NFR-003 | Availability | Target \>=99% availability during agreed supervised demonstration window; not a public emergency service SLA. | Synthetic uptime check |
| NFR-004 | Data integrity | No duplicate active assignment for same volunteer/request under concurrent submissions; unique constraints + transaction tests. | Concurrency test |
| NFR-005 | Durability | No acknowledged write disappears when a single API instance restarts; database persisted storage. | Restart test |
| NFR-006 | Security | No unresolved critical/high vulnerabilities at release, with documented exceptions signed off. | Dependency and image scan |
| NFR-007 | Authorization | Every write/resource read validates authentication and authorization server-side; all negative tests pass. | RBAC test matrix |
| NFR-008 | Encryption | TLS for all internet client traffic; passwords stored with current approved password hashing function. | Config/security review |
| NFR-009 | Privacy | Default displays coarse geolocation; user PII minimal; access and retention decisions documented. | Privacy review |
| NFR-010 | Auditability | Every sensitive mutation logs actor, action, target, timestamp and request ID; secrets excluded. | Audit test |
| NFR-011 | Accessibility | Aim for WCAG 2.2 AA for primary workflows; manual keyboard + automated checks. | Accessibility report |
| NFR-012 | Browser support | Current Chrome/Firefox/Edge desktop and common mobile browsers for responsive critical journeys. | Cross-browser smoke |
| NFR-013 | Recovery | Demo planning target RPO \<= 24h and RTO \<= 4h subject to timed restoration exercise. | Restore rehearsal |
| NFR-014 | Deploy repeatability | One documented command/workflow deploys versioned images with immutable release identifier. | Rebuild demo |
| NFR-015 | Testability | All P0 requirements trace to at least one automated test or explicitly documented manual validation. | Trace matrix |
| NFR-016 | Observability | Request IDs propagate through logs; health/readiness and API error metrics visible. | Dashboard screenshots |
| NFR-017 | Secrets | Never place real secrets or private datasets in Git, logs, images or client bundles. | Secret scan and review |
| NFR-018 | API contract | API contract maintained as OpenAPI; breaking changes require ADR/change note. | Schema validation |
| NFR-019 | Maintainability | Use modular monolith with typed domain services and no direct frontend DB access. | Architecture review |
| NFR-020 | Localization | All user-facing strings structured for future Sinhala/Tamil/English support; initial supported languages need approval. | i18n review |
| NFR-021 | Scalability | Baseline single instance; document future multi-replica strategy incl. websocket shared adapter. | Design review |
| NFR-022 | Idempotency | Mutating assignment/allocation operations survive duplicate requests without double effects. | Replay test |
| NFR-023 | Backup security | Backups encrypted with limited access; demonstrate backup and restore to separate environment. | Recovery evidence |
| NFR-024 | Audit retention | Retention is configurable; adopt a legally reviewed policy before public launch. | Settings/policy review |
| NFR-025 | Resource limits | API uploads, payloads, rate limits and database queries bounded to prevent easy exhaustion. | Abuse test |

# Domain business rules

| **Rule ID** | **Invariant and enforcement** |
|----|----|
| BR-01 | Only authorized coordinators can move incidents from UNVERIFIED to VERIFIED or REJECTED; record verifier and rationale. |
| BR-02 | A request is APPROVED only if linked incident is VERIFIED and active. |
| BR-03 | Quantities are strictly positive for requests and allocations; inventory_available \>= 0. |
| BR-04 | Only the targeted volunteer can accept/decline an assignment; coordinator may cancel/reassign within scope. |
| BR-05 | A state-changing operation is atomic with its audit row and required notification/outbox event. |
| BR-06 | A stale version cannot overwrite newer assignment/request state; respond 409 and return current representation. |
| BR-07 | Public incident views must omit exact coordinates, reporter identity and private contact info. |
| BR-08 | Decline, rejection, cancellation and reassignment require reason codes and history. |
| BR-09 | User suspension revokes existing sessions and room authorization on next server validation. |
| BR-10 | External integrations, if introduced, may not be trusted as sole source of authorization. |

# Definition of requirement acceptance

- Each requirement has unambiguous actor, trigger, expected result, unhappy path and test evidence.

- Use the test catalogue (09) and repository traceability.csv to map requirement → tests → code → evidence.

- For every P0 story, record at least one negative authorization test and one failure/edge-condition test.

- Performance targets are demonstration acceptance targets under a specified load setup, not guaranteed emergency SLA.

# Change requests

1.  Propose CR ID, changed requirement IDs, objective and reason.

2.  Assess UX, API, data migration, security, tests, DevOps and timeline impacts.

3.  Obtain owner/supervisor sign-off for P0 or privacy changes.

4.  Update SRS, feature specs, OpenAPI, ADRs, tests and traceability before implementation.

# References and operating assumptions

Reference standards are guidance, not a claim of certified compliance. Verify dates and applicable legal obligations at implementation time.

OWASP ASVS 5.0 — https://asvs.owasp.org/

W3C WCAG 2.2 — https://www.w3.org/TR/WCAG22/

NIST SSDF SP 800-218 — https://csrc.nist.gov/projects/ssdf
