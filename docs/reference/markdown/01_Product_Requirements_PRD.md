**Real-Time Disaster Relief & Volunteer Management System**

Document ID: RDRVMS-01 \| Version: 0.1 (draft baseline) \| Issued: 08 November 2026

**Purpose** Defines the product problem, outcomes, stakeholder needs, users, scope, priorities and measures of success.

**Status & approvals** Proposed design baseline, not signed off. Product owner/team and module supervisor must approve requirements, privacy decisions, service-level targets, and any external integrations before development or real-world use.

**Audience** Project team, module supervisor, reviewers

# Executive summary

When disasters disrupt transport and communications, volunteers, relief supplies and incident information can become fragmented. RDRVMS is a web-based coordination platform for recording and verifying reported incidents, expressing relief needs, matching trusted volunteers, tracking assignment progress and updating authorized users in real time.

The module deliverable is both a usable web application and a demonstrable DevOps lifecycle: automated tests, repeatable containers, CI/CD, environment separation, monitoring and recovery practice.

# Problem and intended value

- Reporters need a structured way to submit incidents without exposing precise private information.

- Coordinators need verified incident status, priority and available volunteer/supply capacity in one place.

- Volunteers need clear assignments, acknowledgement actions and status history.

- Administrators need permission control, traceable changes and reliable operational evidence.

- Supervisors need visible evidence of software-engineering, DevSecOps and release-process discipline.

# Personas and outcome-oriented needs

| **Persona** | **Primary goal** | **Main concern** |
|----|----|----|
| Reporter | Submit credible incident safely | Privacy, simple forms, status clarity |
| Volunteer | Offer skills/availability and accept tasks | Trust, assignment clarity, notifications |
| Coordinator | Verify, prioritize and allocate work | Wrong information, duplication, latency |
| Administrator | Operate and govern the platform | Access control, audit and incident handling |
| Module evaluator | Assess engineering rigor | Traceability, demonstrable CI/CD |

# Success metrics and non-goals

| **Metric** | **Initial success threshold** | **Measurement** |
|----|----|----|
| End-to-end core journey | One complete verified simulated incident → fulfilled request | Scripted demo AT-007..AT-019 |
| P0 coverage | Every P0 FR has test evidence | Traceability report |
| Deploy repeatability | Fresh instance deployed using documented steps | Signed demo log |
| Build quality | PR tests + secret scan pass | CI records |
| Real-time resilience | Missed events recovered after reconnect | Socket + API reconnection test |

Non-goals for MVP: government disaster warning issuance, emergency dispatch decisions, direct payment processing, autonomous AI prioritization, medical triage, survivor identity publication, native mobile app, offline-first synchronization, public production reliability guarantees.

# MVP / later increments

| **P0 / MVP** | **P1 later in module** | **P2 stretch** |
|----|----|----|
| Auth/RBAC, reporter incidents, verification, requests | Inventory allocations, maps, uploads | Exports, advanced analytics |
| Volunteer profiles, assignments, live notifications | Data-rights operations, accessibility polish | SMS/email provider integrations |
| Audit, dashboard, health/metrics, seed | More advanced search, load tests | Kubernetes / Terraform |

# Primary user journey

1.  Registered reporter submits a new incident with district, incident type and approximate location.

2.  System assigns UNVERIFIED status; coordinator reviews and verifies or rejects with rationale.

3.  Coordinator creates and approves relief request for verified incident.

4.  Coordinator assigns an available volunteer with appropriate skill/region; transactional rule prevents duplicate work.

5.  Volunteer receives persisted notification (and live Socket.IO update when connected), opens assignment and accepts.

6.  Volunteer marks progress; coordinator confirms completion and closes the request.

7.  Audit log, dashboard and metrics reflect the updates; disconnection does not lose the durable work history.

# Assumptions and dependencies

- All users in MVP are synthetic or consenting test participants; public users see redacted data only.

- Volunteer and coordinator trust comes from platform roles, not unverified claims of official authority.

- Initial locale may be English; architecture must support Sinhala/Tamil localization later.

- Map provider usage must respect attribution/license and privacy limits.

- WebSocket connection is optional for correctness: REST reads provide authoritative state.

# Open questions for stakeholder interview

- Who is responsible for verifying incident authenticity, and what evidence standard is appropriate?

- Can requests exist before verification, or only drafts? Baseline: no approved need before verified incident.

- How are organization membership and district permissions established and revoked?

- Who may view exact coordinates, telephone numbers and evidence media?

- Which incident categories and relief item units are required by the course demo?

- What operational metrics count toward grading: CI/CD, Docker, Linux, monitoring, Kubernetes, IaC?

# References and operating assumptions

Reference standards are guidance, not a claim of certified compliance. Verify dates and applicable legal obligations at implementation time.

GitHub Spec Kit: Agentic SDD — https://github.github.com/spec-kit/reference/agentic-sdd.html

Sri Lanka Data Protection Authority — https://www.dpa.gov.lk/guidelines.php
