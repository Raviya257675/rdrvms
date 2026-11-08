**Real-Time Disaster Relief & Volunteer Management System**

Document ID: RDRVMS-12 \| Version: 0.1 (draft baseline) \| Issued: 08 November 2026

**Purpose** Prioritized work decomposition, cross-team responsibility, risks, dependencies and checkpoints for the module.

**Status & approvals** Proposed design baseline, not signed off. Product owner/team and module supervisor must approve requirements, privacy decisions, service-level targets, and any external integrations before development or real-world use.

**Audience** Project team, module supervisor, reviewers

# Proposed 6-iteration plan (not calibrated to a known semester schedule)

| **Iteration** | **Vertical slice / deliverables** | **Evidence** |
|----|----|----|
| 0 \| Foundation | Approve specs; repo; CI docs check; UI skeleton; DB migration policy; threat model | Architecture sign-off + initial PR |
| 1 \| Accounts | Session auth, roles, memberships, protected routes | AT-001/002/004 + security tests |
| 2 \| Incidents | Submit, list/filter, verify, scoped views | AT-007..010 + redaction tests |
| 3 \| Relief requests | Request approval, state transitions, dashboard | AT-011..013/023 |
| 4 \| Assignments + live | Volunteer availability, assignments, inbox, reconnect | AT-005/014..020 + concurrency |
| 5 \| DevOps + operations | Docker, staging, CI/CD, metrics, backups, release demo | OPS-001..003 + release sign-off |

# High-level backlog

| **ID** | **Story** | **Priority** | **Trace** | **Dependency** |
|----|----|----|----|----|
| US-001 | Create authenticated accounts and session security | P0 | FR-001..004 | No dependency |
| US-002 | Define org memberships and RBAC policy | P0 | FR-004/006 | US-001 |
| US-003 | Volunteer profile and availability | P0 | FR-005 | US-001 |
| US-004 | Submit incident with safe coordinates | P0 | FR-007 | US-001 |
| US-005 | Verify incident and audit result | P0 | FR-008/025 | US-002,US-004 |
| US-006 | Browse and filter incidents | P0 | FR-010/013 | US-004 |
| US-007 | Relief request management | P0 | FR-011/012 | US-005 |
| US-008 | Assign volunteer without race | P0 | FR-014/016 | US-003,US-007 |
| US-009 | Volunteer accept/decline with scope | P0 | FR-015/016 | US-008 |
| US-010 | Durable notifications and reconnect | P0 | FR-018..020 | US-008 |
| US-011 | Role dashboards | P0 | FR-023 | US-006,US-009 |
| US-012 | Health/log/metrics instrumentation | P0 | FR-029/032 | Foundation |
| US-013 | CI, containerization, staging deployment | P0 | NFR-014/015 | Foundation |
| US-014 | Synthetic fixtures and smoke E2E | P0 | FR-033 | US-001..011 |
| US-015 | Stock & allocations | P1 | FR-021/022 | US-007 |
| US-016 | Map and evidence uploads | P1 | FR-024/026 | US-004 |
| US-017 | Admin suspension / reset | P1 | FR-027/003 | US-001 |
| US-018 | Accessibility and locale readiness | P1 | FR-034 | UI foundation |
| US-019 | Backup, restore, logging alert drill | P0 | NFR-013/023 | US-013 |
| US-020 | Export and advanced reporting | P2 | FR-028 | US-006/007 |

# RACI proposal

| **Workstream** | **Accountable** | **Responsible** | **Consulted** |
|----|----|----|----|
| Product requirements | Product owner | Business analyst / feature owner | Supervisor + test lead |
| Architecture / ADR | Tech lead | Backend + DevOps | Security reviewer |
| Frontend/UI | Frontend lead | Frontend developer | QA and users |
| Data/API | Backend lead | Backend developer | Security + QA |
| Tests | QA lead | Feature owner + QA | Tech lead |
| CI/CD/ops | DevOps lead | DevOps engineer | Backend + security |
| Security/privacy | Security lead | Feature owner | Privacy owner / supervisor |

# Risk register

| **ID** | **Risk** | **Impact** | **Mitigation** |
|----|----|----|----|
| R-01 | Agent generates code not aligned to spec | High | Gate all changes on FR/test trace and review |
| R-02 | Scope grows beyond course time | High | Freeze P0 vertical slices, defer Kubernetes |
| R-03 | Sensitive user location leakage | High | Coarse default, RBAC and redaction tests |
| R-04 | Socket disconnect loses updates | High | DB notification inbox, reconnect test |
| R-05 | Double assignment or stock oversubscription | High | Transactions, idempotency, concurrency tests |
| R-06 | Cloud budget exceeded | Medium | Single VM, alerts, review spend |
| R-07 | Broken schema migration during demo | High | Staging rehearsal, backup, expand/contract |
| R-08 | External service API unavailable | Medium | Do not depend on external alert/dispatch provider |
| R-09 | No shared team coding convention | Medium | AGENTS + PR template + code owners |
| R-10 | Unproven security claims | High | No fake compliance; documented verification |
| R-11 | Late integration of components | High | CI + end-to-end vertical slice early |
| R-12 | Demo dataset accidentally contains PII | High | Synthetic seed + scans + approval |

# Milestone gates

- Gate G0: PRD/SRS/security baseline reviewed and open decisions assigned.

- Gate G1: Repo structure, docs validator and tests-first workflow usable.

- Gate G2: First authenticated vertical slice end-to-end in staging.

- Gate G3: Critical incident/request/assignment tests and authorization negative cases passing.

- Gate G4: Automated build/deploy, observability and backup recovery demonstration.

- Gate G5: Signed release checklist, evidence archive and course demonstration.

# Requirements traceability

The repository includes docs/requirements/traceability.csv to map FR → story → test → spec → implementation path → CI evidence. Blank implementation and execution fields mean “not built”; never backfill as passed before evidence exists.
