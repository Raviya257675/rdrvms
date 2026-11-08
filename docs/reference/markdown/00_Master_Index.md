**Real-Time Disaster Relief & Volunteer Management System**

Document ID: RDRVMS-00 \| Version: 0.1 (draft baseline) \| Issued: 08 November 2026

**Purpose** Navigation, authority order, workflow, document ownership and the exact status of the package.

**Status & approvals** Proposed design baseline, not signed off. Product owner/team and module supervisor must approve requirements, privacy decisions, service-level targets, and any external integrations before development or real-world use.

**Audience** Project team, module supervisor, reviewers

# How to use this package

This pack is the starting point for an academic, production-minded disaster relief coordination web application. It is not a finished application, live emergency-response system, certified implementation, or verified legal compliance program. The functional baseline is explicit so coding agents can work consistently. Every proposed requirement remains subject to stakeholder acceptance.

1.  Review documents 01–03 and approve the MVP scope, users, and safety boundaries.

2.  Approve ADRs, security/data handling, and the proposed architecture in documents 04–07.

3.  Use documents 08–09 to write and review failing tests before implementation.

4.  Use document 10 to implement DevOps progressively; defer production deployment until security checks and backup drills pass.

5.  Use document 11 plus the repository AGENTS.md and feature spec/plan/tasks files for every coding-agent task.

6.  Track delivery and traceability using documents 12–14 and the CSV files in the repository.

# Document register

| **ID** | **Word document** | **Authoritative subject** |
|----|----|----|
| 00 | Start Here / Master Pack Index | Navigation and approval authority |
| 01 | Product Vision & PRD | Problem, personas, objectives, MVP scope |
| 02 | Software Requirements Specification (SRS) | Numbered FR/NFR and measurable acceptance |
| 03 | Use Cases, UX & Access Control | Role matrix, journeys, UI contract |
| 04 | System Architecture / HLD | C4 context, containers, components, decisions |
| 05 | Detailed Design / LLD | APIs, state machines, realtime, reliability |
| 06 | Data Design & Governance | ER entities, constraints, indexes, migration policy |
| 07 | Security, Privacy & Threat Model | Threats, security controls, PDPA review |
| 08 | TDD & Test Strategy | Testing pyramid, red-green-refactor, gates |
| 09 | Master Test Case Catalogue | Case-by-case acceptance, negative/edge tests |
| 10 | DevOps, Environments & CI/CD | Docker, release pipeline, monitoring, deployment |
| 11 | Agentic SDD & AI Governance | Constitution, spec-first agent workflow, prompts |
| 12 | Plan, Backlog, Risks & Traceability | Stories, dependencies, sprints, RACI |
| 13 | Operations, SRE & Recovery | Runbooks, backups, failure tests |
| 14 | Release Readiness & Sign-off | Definition of Done, audit and demo exit gates |

# Authority and change rules

- Approved requirements (02) and safety policy (07) override implementation details. Conflicts are documented as change requests; agents never resolve them silently.

- Architecture decisions (04 plus ADR files) control stack/service boundaries. API changes update OpenAPI and 05; data changes update 06 and migrations.

- Every feature has FR/NFR identifiers, a feature spec, implementation plan, task breakdown, test evidence and a pull request.

- A Word document is a human-readable review artifact; repository Markdown/JSON/CSV versions are the agent-readable working specifications. Keep both in sync.

- Nothing in the pack authorizes autonomous interaction with real emergency services or publishing sensitive incident data.

# Proposed governance

| **Decision** | **Owner** | **Evidence / gate** |
|----|----|----|
| Scope / priority | Team product owner + supervisor | Approved PRD, prioritized SRS |
| Architecture and ADR | Tech lead + reviewer | ADR, diagram, tradeoff |
| Privacy/legal | Named privacy owner / qualified reviewer | Data inventory, applicable-law assessment |
| Security exception | Security lead + supervisor | Risk log and expiration |
| Release | Tech lead + QA + product owner | Release checklist and rollback proof |

# Repository starter: what is and is not runnable

The Repository_Starter folder includes agent instructions, full feature-spec examples, OpenAPI baseline, test scenarios, security and architecture notes, CSV traceability, a documentation CI workflow, and example infrastructure configuration. It intentionally does not include an application implementation. BDD feature files are acceptance specifications; sample TypeScript test templates will need adapting when app packages and test runners exist. The documentation validation script is executable now.

# Decisions to validate before Sprint 1

- Confirm the meaning of Reporter: affected resident or verified registered reporter; whether anonymous reports are allowed. Baseline: registered reporters, not anonymous.

- Confirm regions and response organizations; baseline: region/district-based scoping controlled by coordinators.

- Confirm P0 versus P1 features and academic marking scheme; initial MVP emphasizes incident → verification → relief need → assignment → live updates.

- Confirm demo-only or public pilot; baseline is simulated academic demo with fictional records.

- Confirm deployment budget, cloud vendor, group size, exact semester deadlines, and permitted agents; no provider assumed.

- Review retention, consent and geolocation access rules with appropriate stakeholders before ingesting real data.

# References and operating assumptions

Reference standards are guidance, not a claim of certified compliance. Verify dates and applicable legal obligations at implementation time.

GitHub Spec Kit: Agentic SDD — https://github.github.com/spec-kit/reference/agentic-sdd.html

VS Code custom instructions reference — https://code.visualstudio.com/docs/agents/reference/custom-instructions-reference

OWASP ASVS 5.0 — https://asvs.owasp.org/

NIST SSDF SP 800-218 — https://csrc.nist.gov/projects/ssdf

Sri Lanka Data Protection Authority — https://www.dpa.gov.lk/guidelines.php
