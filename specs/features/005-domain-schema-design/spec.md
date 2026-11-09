# Feature 005: Full relational domain schema proposal

- Status: **PROPOSED — READY FOR HUMAN SIGN-OFF; NOT APPROVED FOR IMPLEMENTATION**.
- Authorized activity: Master Prompts 03 and 03A.2, design only, 2026-11-09. Backend/product owner selected the flexible scoped architecture as the preferred candidate; required security, supervisor, constitutional and migration approvals remain pending.
- Owner: backend owner; reviewers: product owner, teammate/frontend owner, security/privacy reviewer, QA and supervisor.
- Requirements: FR-001 through FR-035 and NFR-001 through NFR-025 are individually assessed in [traceability.csv](traceability.csv); no requirement status is advanced.
- Existing acceptance IDs: AT-001 through AT-035, NF-001 through NF-025, SEC-001 through SEC-003 and relevant OPS/PERF cases. Proposed schema scenarios are in [test-cases.md](test-cases.md).

## Why and observable outcome

Reporters, volunteers and scoped coordinators need consistent persisted incidents, needs, assignments and notifications. Reviewers need an explicit relational proposal before any authentication, privacy policy or migration is implemented. The outcome of this milestone is a reviewable design package, not a working domain database or approval of any actor policy.

There is no formally approved full MVP schema in the repository. Features 001–003 and the Word-derived baseline remain proposed; feature 004 and the shutdown fix are implemented. “MVP” below means entities needed if the documented P0 requirements and the proposed decisions are accepted. Organization scope is required by current repository constraints even though organization-management UI/API is P1.

## Proposed scope

The proposed MVP contains **23 relational entities**, including normalized bridges and persistence support:

| Domain | Proposed tables | Justification |
|---|---|---|
| Geography and reference data | `districts`, `skills`, `units` | District scope, skill eligibility, quantity/unit validation; no province/village hierarchy or PostGIS requirement |
| Identity | `users`, `account_roles`, `email_verification_tokens`, `sessions` | Registration consent, verified access, multiple personal roles, persistent revocable sessions |
| Account security | `account_security_grants` | Explicit separately reviewed global account suspension/personal privilege removal under FR-027; no operational authority |
| Organization scope | `organizations`, `organization_districts`, `memberships`, `membership_districts` | Many organizations per user; scoped coordinator/admin/volunteer grants |
| Volunteer | `volunteer_profiles`, `volunteer_skills` | Coarse home district, availability, capacity, eligible skills |
| Incidents and relief needs | `incidents`, `relief_requests`, `request_skills` | Verification, quantities, priority, permitted state transitions and required skills |
| Assignment | `assignments`, `idempotency_records` | Ownership, active-pair uniqueness, capacity serialization and replay safety |
| Durable communication | `notification_streams`, `notifications`, `outbox_events` | Commit-ordered owner inbox, atomic publication intent and REST recovery |
| Audit | `audit_events` | Actor/target/time/request ID and restricted transition history |

`skills`, `units`, `request_skills`, `notification_streams` and `idempotency_records` are requirement-derived implementation proposals, not new product requirements. Their alternatives and costs are explicit in [decisions-and-risks.md](decisions-and-risks.md). No generic permission engine, dispatch, household/person registry, payment, logistics fleet, warehouse hierarchy or third-party integration is proposed.

P1 designs are documented but excluded from the 23-table MVP: `inventory_items`, `allocations`, `restricted_incident_locations`, `evidence_files`, `password_reset_tokens`, `privacy_requests`. Allocation status models dispatch/consumption without inventing a separate distribution/beneficiary domain. Exports (P2) derive from existing safe views; no export-history or analytics warehouse is required. See [entity-catalogue.md](entity-catalogue.md).

## Design acceptance scenarios

1. **Given** the SRS, feature specifications, API and security documents, **when** a reviewer follows any FR/NFR row, **then** the proposed entity or explicit non-database responsibility, acceptance ID, phase and unresolved decision are visible.
2. **Given** a proposed incident/request/assignment relationship, **when** an organization, district or owner is mismatched, **then** the proposal identifies the composite FK and/or required server policy that prevents access or mutation.
3. **Given** concurrent assignments, capacity edits, allocation attempts or replays, **when** reviewing the transaction design, **then** locking, conditional writes, uniqueness, rollback and bounded retry behavior are specified without relying on sockets or client checks.
4. **Given** an offline volunteer or a process crash after commit, **when** the client reconciles, **then** persisted owner notifications remain retrievable, including a late-committing write that a timestamp-only cursor could miss.
5. **Given** public access, **when** reading the design, **then** unverified records, reporter identity, raw narratives, contact data, credentials and precise points have no proposed public exposure path. Exact public aggregation rules still require approval.
6. **Given** conflicting sources or unapproved retention/roles/session rules, **when** reviewing recommendations, **then** the conflict and alternatives remain OPEN with a named review role; documentation never grants approval.
7. **Given** this milestone completes, **then** executable Prisma schema, backend/frontend code, dependencies, database records, migrations and infrastructure remain unchanged.

## Data and quality rules

PostgreSQL remains authoritative. Mutations commit domain state, audit and required inbox/outbox effects atomically. The candidate service selects an explicit authorization context: owner-bound personal resources or organization-bound operational resources. Personal resources require current session/account status, personal role where relevant and ownership; organizational resources additionally require active organization/membership/role/district/object checks. FR-027 global account-security commands require a separate explicit account_security_grants capability, not either context as a wildcard. These interpretations remain blocked until C-11 and D-S03 source amendments are signed. Versions and idempotency prevent stale/repeated side effects; neither replaces authorization.

Use fictional demonstration data only. No public release, real victims' data, official dispatch or real volunteer contact is authorized. Numeric retention periods, collection of restricted points, session parameters, admin reach and role grants remain human decisions. Proposed session values and Argon2id parameters are listed in [security-parameters.md](security-parameters.md) for explicit review only. Database checks do not prove API authorization or privacy compliance.

The proposal addresses NFR performance/resource bounds through indexes, keyset pagination and short transactions; no benchmark, migration, restore, concurrency test or security certification is claimed by a design document.

## Package and approval gates

- [Requirements/source audit](requirements-audit.md), [entity traceability](traceability.csv), [entity/attribute catalogue](entity-catalogue.md).
- [Mermaid ER diagram](erd.mmd), [constraints/indexes/type mapping](constraints-and-indexes.md), [transactions and consistency](transactions.md).
- [Decision/risk register](decisions-and-risks.md), [migration and seed design](migration-plan.md).
- [Plan](plan.md), [tasks](tasks.md), [test cases](test-cases.md), [evidence](evidence.md), [human approval checklist](approval-checklist.md).

Human approval of this design does not itself authorize executing migrations. A subsequent explicit implementation instruction, approved feature slice, tests-first evidence and reviewed migration plan are required. Stop after this proposal.

Current reconciliation entry point: [reconciliation-summary.md](reconciliation-summary.md); [source amendments](source-amendments.md), [18-row approval record](approval-record.md), [review handoff](review-handoff.md) and [smallest identity/scope slice](identity-scope-readiness.md). Verdict: **READY FOR HUMAN SIGN-OFF**, not accepted or implementation-ready.

## 03A.3 approval verification and migration proposal

Current deliverables: [approval verification](approval-verification.md) and [detailed identity migration stages](identity-migration-stages.md). PR #5 has general approval but no verified decision-specific acceptance or required-role evidence. No authoritative amendment applied, no domain attributes approved for implementation. All original requirement/decision IDs and 23 proposed entities are preserved.

Current verdict: **NEEDS APPROVAL**; implementation/migrations **BLOCKED**. This supersedes the earlier READY FOR HUMAN SIGN-OFF delivery label as an approval-readiness assessment; it does not erase historical design work or claim that the proposal has been accepted. The exact 12-entity identity slice may be staged 3/4/5 as schema-only work after approval; no interim endpoints or unaudited operational bootstrap.
