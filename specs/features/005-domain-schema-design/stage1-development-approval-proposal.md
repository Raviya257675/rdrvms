# Proposed academic development approval workflow — Stage 1

Status: **PROPOSED FOR HUMAN REVIEW — NOT ADOPTED; NO DESIGN OR IMPLEMENTATION APPROVAL RECORDED**. Prepared 2026-11-10 on `feature/database-geography-stage1`, clean starting HEAD `c9969c3d048446961445f1ef781e57bff487a4b6`. The requester identifies as backend owner and technical lead; this request authorizes preparing governance changes, not signing the records below. No reviewer identity, signature, approval date or evidence is invented.

## Recommendation and smallest legitimate route

Use **one scoped baseline/delegation decision, then one explicit backend-owner Stage 1 design/implementation record**. Routine local iterations inside that accepted scope require test evidence, not another team-member signature. A single approved feature/spec version may authorize its RED/GREEN/refactor iterations without a new approval for each command or local edit. Keep merge/release and any separately mandated institutional/security gates unchanged.

The constitution does not expressly require a different human to approve every local database step. The per-D-S independent reviewer combinations are project design-process proposals. However, the current SRS and master index explicitly require product/team and module-supervisor baseline approval before development. No delegation satisfying that wording is recorded. An agent cannot quietly discard it because the documents are drafts. Obtain or reference **one recorded clarification/delegation from the existing scope authorities** for the narrow development envelope below. It may cover the whole bounded Stage 1 local milestone; it need not be repeated for each iteration. If an existing valid delegation already covers this scope, reference it rather than requesting another one.

The backend owner can approve the Stage 1 technical record after that delegation. Do not require full identity C-11/FR-027/session/stream/audit decisions merely to generate the three-table schema proposal; those features remain disabled and unapproved. Do not label the whole D-S02/D-S15 or 23-entity design accepted from a partial Stage 1 decision.

**Current permission remains unchanged.** This file prepares the exact changes for review; it does not activate the delegation, amend governance or authorize Prisma edits/SQL. If the required scope authority declines or an actual university rule prohibits delegation, retain that gate and report the conflict.

## Provenance: institutional rules versus internal choices

Sources inspected: AGENTS.md; constitution; docs/decisions/open-questions.md and change-request-template.md; master index/SRS/governance/release/test/data/security references; .github agent instructions; feature-005 approval records and Stage 1 catalogue/staged/handoff documents. Repository searches for an assessment brief, handbook, marking rubric, institutional policy or specific supervisor directive found no independent institutional rule text or delegation in these inspected materials. This is **absence of evidence here**, not a claim that no university rules exist. No external university, course or supervisor identity is specified, so no institution-specific policy is asserted or invented.

| Requirement / source | Evidenced origin and force | Minimal treatment |
|---|---|---|
| Separate reviewer on every local model/field/test iteration | Not stated in AGENTS or constitution. Repeated multi-role sign-offs appear in feature-005 approval-record.md and subsequent draft handoffs | Internal process choice; replace only for the accepted development envelope, without representing omitted reviews as completed |
| Product/team + module-supervisor baseline before development | docs/reference/markdown/00_Master_Index.md and 02_SRS_Functional_Nonfunctional.md, Status & approvals; index Proposed governance; SRS Change requests item 3 | Explicit local governance gate. Independent university provenance not evidenced. Preserve authority; request/reference one-time scope approval/delegation rather than one signature per local iteration |
| Constitution ratification/amendment | .specify/memory/constitution.md, Ratification and Amendment paragraphs | Supervisor/team ratification remains PENDING. No constitution wording/ratification change proposed; any actual amendment requires its existing process and test/agent-instruction review |
| Human intent, approved feature, TDD, truthfulness, no real PII/secrets, reversible delivery | AGENTS Non-negotiable rules; constitution rules 1–9; docs/testing/test-strategy.md | Retain fully. Backend owner is a human approver for explicitly delegated local work; that does not establish independent review or replace institutional authority |
| Human review before merge; architecture/release gates | Constitution rule 8; index Proposed governance; document 11 Human review; document 14 release matrix | Outside the local workflow change. Preserve applicable PR/merge/release reviewers, branch protection and no autonomous merge/deploy. Do not relabel local owner acceptance as completed release review |
| Supervisor + security approval for a security exception / global authority | Index Proposed governance, Security exception; feature-005 C-11/FR-027/D-S03/D-S18 records | Retain when the relevant feature/exception is proposed. Stage 1 does not implement it, so it is not a prerequisite to this narrowly bounded schema-only milestone |
| Independent security/QA review of the Stage 1 physical dictionary | D-S02/D-S15 reviewer columns and Stage 1 handoff gates; no separate institution-specific mandate located | Recommend review and record **NOT PERFORMED**. After valid delegation, it is advisory for this envelope only; retain mandatory independent review wherever a higher authority actually requires it |
| Supervised assessment, permitted tooling or grading requirements | D-009 remains OPEN; documents 00/12 discuss course requirements without providing an external rule | Unknown. Preserve any later supplied handbook/directive; no owner/agent statement can assert it was waived |

Draft status does not make current instructions optional. Conversely, an internal proposed reviewer matrix is not evidence that a university mandates independent security review of every local schema edit. No additional supervisor, constitutional-ratification or peer milestone requirement should be invented beyond the applicable accepted authority/scope.

## Proposed policy text: DEV-STAGE1

The following is the complete proposed operative text, effective only after the recorded baseline/delegation and governance edits are accepted:

> For the isolated synthetic-data Stage 1 academic milestone, the backend owner/technical lead may approve the exact E01 District, E04 Organization and E05 OrganizationDistrict physical schema, its tests and local implementation within the existing modular monolith. This scoped approval authorizes only the specifically recorded repository changes, offline validation/build/unit tests, and migration SQL generation for review without database application. An accepted scope/spec version covers normal RED/GREEN/refactor iterations without repeated team-member approval.
>
> Approval must identify the approver and role, accepted inventory/version, allowed files/actions, exclusions, date and evidence. Independent security/QA review is recommended and must be labelled NOT PERFORMED until it occurs; owner approval is not an independent security assessment. This scoped process does not satisfy or waive a university/supervisor rule, constitutional amendment, security exception, changed runtime permission or release gate.
>
> No SQL is executed, no database or shadow database is used for generation, no records are altered and no operational bootstrap or endpoint is enabled under this record. An explicitly authorized disposable integration-test target may be approved later by the same backend owner within a valid delegation if that delegation covers it; that requires its own target/actions record before any SQL/data operation. Migration SQL generation must use an approved offline method or fail closed if tooling requires database access.
>
> Preserve TDD, all requirement/test assertions, fictional fixtures, secret exclusion, native integrity constraints, current readiness/shutdown behavior and human-controlled merge/release rules. No user/session/incident/grant/audit tables, C-11/FR-027/auth/session/RBAC/public-location change, new dependency/service/cost, infrastructure, schema-destructive action, real data/provider/pilot, merge or deployment is included.
>
> Scope owner: the backend owner/technical lead named in the acceptance record. Delegation expires on Stage 1 completion, revocation or any proposed expansion beyond its accepted envelope, whichever occurs first. Reapproval of changed scope does not require repeating already accepted unchanged decisions. Later local milestones need an applicable accepted delegation/scope record; this policy grants no blanket authorization for later identity/security features.

Expiration and the human scope owner are explicit to satisfy the constitution's exception discipline; no duration or signature is fabricated. The initial envelope is Stage 1 only. A later policy extension must identify its own safe scope and preserve higher-authority gates; it cannot inherit authority for authentication simply because the project is academic.

## Exact Stage 1 technical acceptance boundary

Accept this inventory or record precise deviations before implementation. Requirements: FR-004/033 and NFR-007/017/019, with downstream FR-005/007/010/014 geography and FR-006 management support. This does not implement those API/business requirements. Existing canonical IDs/statuses stay unchanged. Proposed native names and Prisma scalar mappings are in identity-migration-stages.md; the accepted record must pin that reviewed version plus any deviations below.

| Model / table | Exact proposed columns, all NOT NULL | Keys / native integrity / query index |
|---|---|---|
| District / districts / E01 | id uuid supplied by server, no DB default; created_at and updated_at timestamptz(3) default now(); version integer default 1; code varchar(32), proposed C collation; name varchar(100); active boolean default true | PK(id); UNIQUE(code); version>=1; proposed exact ASCII code grammar and B-aware Unicode name check per stage1-technical-corrections.md |
| Organization / organizations / E04 | id uuid supplied by server, no DB default; created_at and updated_at timestamptz(3) default now(); version integer default 1; code varchar(32), proposed C collation; name varchar(160); status varchar(16) default ACTIVE | PK(id); UNIQUE(code); version>=1; proposed exact ASCII code grammar/B-aware name check; status ACTIVE/INACTIVE |
| OrganizationDistrict / organization_districts / E05 | created_at timestamptz(3) default now(); organization_id uuid; district_id uuid; active boolean default true | PK(organization_id,district_id); organization_id→organizations.id and district_id→districts.id, both ON UPDATE RESTRICT / ON DELETE RESTRICT; reverse index(district_id,organization_id) |

Create parents before mapping. Preserve String checked-varchar states, explicit native types and server-written updated_at/version, no automatic update trigger or new extension/Preview flag. The 03B.0 [technical correction proposal](stage1-technical-corrections.md) now supplies seven exact candidate CHECK names/expressions, proposed C code-column collation, ASCII format alternatives/recommendation, explicit Unicode name rules, district-first locks, permission matrix and immutable-reference lifecycle. These replace the earlier unresolved-format shorthand for review, not by approval. Pin the accepted inventory and deviations in the human record; grammar/collation/vocabulary/retirement/reactivation/privileges remain PENDING. No administrative code list or runtime routing policy is approved here.

No operational fixtures or administrator bootstrap. Future constraint tests use fictional aliases on an explicitly authorized disposable target; database tests are not allowed by this no-SQL implementation record. Missing integration execution means tests remain pending, not that assertions may be removed. FK actions, PK/UQ/CHECKs and typed fields must be tested, and native object retention/drift/recovery reviewed before application.

## Exact governance amendments for review (not applied)

The source locators and replacement/addition text below form a proposed change request. None is installed in this task. The delegation approval must identify these changes and scope; do not treat a generic PR approval as acceptance. Preserve all unrelated text and mandatory requirements.

### G1 — Master index scope/delegation

File: docs/reference/markdown/00_Master_Index.md. Section: Proposed governance, after its existing table. Keep the Status & approvals paragraph and all existing table rows. Append:

> Development-only Stage 1 delegation (DEV-STAGE1): the existing product/team and module-supervisor scope authorities may record one accepted synthetic-only schema-development envelope and delegate its local physical-design/implementation/test/SQL-generation decisions to the backend owner/technical lead. The delegation records scope, exclusions, authority/evidence and expiration. Once accepted, the backend owner's exact scoped record covers local iterations without repeated team-member signatures. Existing institutional requirements, security exceptions, constitution amendment/ratification, merge and release gates remain unchanged. No SQL execution is implied.

Proposed evidence row to append to that table, only after its source owners accept the delegation:

| Decision | Owner | Evidence / gate |
|---|---|---|
| Local Stage 1 physical schema and repository implementation within DEV-STAGE1 | Backend owner / technical lead under recorded scope delegation | Exact inventory/version, allowed files/actions, date/evidence, TDD/check results; independent security review NOT PERFORMED; SQL execution separate |

No retroactive approval date or ACCEPTED status is inserted by preparing this text. Team/supervisor baseline authority is not removed.

### G2 — SRS approval-scope clarification

File: docs/reference/markdown/02_SRS_Functional_Nonfunctional.md. Section: immediately after Status & approvals. Keep that paragraph, all FR/NFR/BR rows, priorities and Change requests item 3. Append:

> A recorded DEV-STAGE1 baseline approval may delegate isolated, synthetic-data, schema-only local development decisions to the backend owner/technical lead. It does not approve the complete SRS or change product behavior, privacy, authentication, organization access, public location policy or service targets. Within the accepted envelope, a scoped owner record is sufficient for local implementation and offline verification/SQL generation; no repeated milestone team review is required. Unapproved requirements and all higher-authority gates remain pending. Database execution, merge and release require their separately applicable authorization.

This resolves the broad “before development” wording for the delegated local scope without claiming that the supervisor/team already approved it or waiving their baseline authority.

### G3 — AGENTS workflow clarification; constitution unchanged

File: AGENTS.md. Section: after Preferred feature workflow, before Task completion format. Proposed insertion:

> **Development-only Stage 1 workflow.** When DEV-STAGE1 has recorded baseline/scope-authority acceptance, an explicit backend-owner/technical-lead record may approve the three-table local schema slice and its repository implementation, tests and offline migration SQL generation. Separate team-member review is not required for each local iteration within that exact accepted scope. Independent security review must remain marked NOT PERFORMED until evidenced. This does not amend protected-resource checks, safety/privacy, TDD, forbidden changes, constitutional/supervisor authority or human merge/release gates, and does not authorize SQL execution. If the delegation or exact owner record is missing, stop at the applicable missing gate.

No replacement of the universal organization/object authorization rule; no C-11 exception. No change proposed to .specify/memory/constitution.md: all ten clauses, ratification status and Amendment paragraph remain intact. A human approving Stage 1 locally is not automatically a separate independent reviewer. If the constitutional authority determines the proposed delegation changes constitutional intent, apply the existing amendment procedure first; neither the backend owner nor agent can mark that amendment/ratification approved by implication.

### G4 — Approval record: add scope record without approving all D-S decisions

File: specs/features/005-domain-schema-design/approval-record.md. Section: append Development-only Stage 1 scope record. Keep all 18 existing D-S rows, names/dates/evidence and statuses unchanged. Add the following prospective record; blanks stay blank until the relevant human actually accepts it:

| Record | Decision scope | Approver role | Name | Date | Evidence / accepted version | Status |
|---|---|---|---|---|---|---|
| DEV-STAGE1 delegation | Baseline synthetic-only development envelope, authority delegation and G1–G3 source scope | Existing product/team and module-supervisor scope authority; record each required role/evidence | | | | PENDING |
| DEV-STAGE1 model acceptance | E01/E04/E05 exact columns/types/defaults/PK/UQ/FK/CHECK/index names and referential actions, stated deviations only | Backend owner / technical lead | | | | PENDING |
| DEV-STAGE1 repository implementation | Explicit approved feature/spec/tasks/files, RED/GREEN, offline Prisma validation/build/unit/docs and offline SQL generation only; NO SQL execution | Backend owner / technical lead | | | | PENDING |
| Independent security review | Stage 1 physical design review, advisory only inside accepted DEV-STAGE1 envelope | Independent reviewer, if/when performed | | | | NOT PERFORMED |
| SQL / database execution | Any disposable target/test writes or migration application | Separate explicit target/actions approver under applicable governance | | | | NOT AUTHORIZED |

Append this precise explanation:

> DEV-STAGE1 model/implementation acceptance is a scope-specific local decision, not acceptance of all D-S02/D-S15, D-004 or the 23-entity model. Its structural district/org mapping and declarative integrity aspects may reference those IDs while their broader authority/security implications remain OPEN/PROPOSED. Synthetic-only scope records no legal retention/pilot acceptance. D-S18 bootstrap and D-S01/03/04/05/11/12/14/16/17 behavior are outside the implementation record. Pending higher-authority or external requirements cannot be overridden by this subrecord. Independent review NOT PERFORMED is not a completed approval, and owner review is not independent review.

The technical and repository entries can be accepted together in **one explicit backend-owner statement** pinned to the same manifest/version and policy evidence. Separate rows distinguish what was accepted; they do not demand two people or two PRs. Do not prefill a name or approval date from this request's role assertion or preparation date.

### G5 — Stage 1 implementation gate and stale handoff wording

File: specs/features/005-domain-schema-design/identity-migration-stages.md, Stage 1 operational gates, Authorization/approvals bullet. Replace only that bullet with:

> **Authorization/approvals:** For DEV-STAGE1 local-only work, require the accepted baseline/scope delegation and exact backend-owner model/implementation record. D-S02/D-S15 references cover only the accepted district/org structure and native integrity subset; they do not require resolving C-11/global identity policy for these tables. No security exception, org-management API or bootstrap is included. Independent Stage 1 security review is recommended and NOT PERFORMED unless evidenced. All higher-authority, merge/release and SQL execution gates remain as applicable. Without accepted delegation/owner scope, the design is still proposed.

File: specs/features/005-domain-schema-design/identity-implementation-handoff.md, Implementation authorization checklist. Add after the checklist:

> DEV-STAGE1 application: gate A may contain one accepted baseline delegation plus one exact backend-owner local Stage 1 decision; gate B synchronizes only the specifically authorized delegation/scope wording, with no C-11/FR-027/constitutional changes. Gate C may be combined with the owner's scoped technical approval. No repository action starts before those records/source updates exist. Gates D–F remain distinct for database access/SQL/execution evidence and enabling; no endpoint, bootstrap, merge or release is allowed by the local record. In-scope security/QA recommendations remain NOT PERFORMED, not falsely complete. The prospective Stage 1 record does not retroactively alter prior missing-approval findings.

Append to specs/features/005-domain-schema-design/approval-checklist.md (local Stage 1 application note):

> After valid DEV-STAGE1 delegation, evaluate local E01/E04/E05 work against its scoped owner record. Full-model sign-off items are not prerequisites for this narrower schema-only milestone; they remain pending for their own scope. Do not mark the full checklist, independent security review or unresolved D-S decisions complete from local owner acceptance.

These are implementation-gate clarifications, not an instruction to weaken existing tests or install permissions.

### G6 — Active feature spec/plan/tasks and evidence synchronization

Files: specs/features/005-domain-schema-design/spec.md, plan.md, tasks.md, requirements-audit.md and approval-verification.md. Proposed appended current-scope note:

> DEV-STAGE1 is effective for local E01/E04/E05 schema work only if the accepted delegation, exact owner design/implementation record and authorized source synchronization are present. It does not accept the full domain design or any identity/security behavior. Current activity-specific status is obtained from that scope record; earlier approval audits remain historical evidence. No general PR approval substitutes for the scope record. Independent security review remains NOT PERFORMED unless actual evidence is supplied.

Before implementation, add/review a bounded Stage 1 feature spec/plan/tasks/test list referencing FR-004/033 and relevant NFRs; the approved slice must state the exact inventory, allowed file list, no-SQL generation method and failure/recovery expectations. Do not mark the whole design feature implementation-approved. Canonical traceability/test IDs, priorities and truthfully pending integration statuses stay unchanged; no new requirement IDs or API contract needed for schema-only work. docs/testing/test-strategy.md and existing agent TDD instructions need no weakening or assertion changes.

## Two short records humans can actually approve

**One-time scope-authority record — template only (PENDING):**

> As [actual authorized role/name], I accept the DEV-STAGE1 isolated synthetic-only scope/delegation and G1–G6 source-change scope for [reviewed document revision/manifest]. Backend-owner approval may govern its local physical schema/repository work without repeated team-member milestone reviews. No constitutional change, security exception, SQL execution, operational bootstrap, merge, release or later identity feature is authorized. Applicable external university/supervisor rules are [reference or explicit statement within my authority]. Expiration is completion/revocation/scope expansion. Date: [actual date]. Evidence: [durable reference].

**Single backend-owner design + local implementation record — template only (PENDING):**

> As backend owner/technical lead [actual name], under [accepted delegation reference], I accept the pinned E01/E04/E05 Stage 1 inventory [version/hash plus exact constraint/index naming and deviations] and authorize its bounded feature-spec/test-first Prisma implementation, offline validation/unit/type/build/docs checks, and offline migration SQL generation for review. Allowed files/actions: [exact list]. No database/shadow-database access, migration application/data writes, other entities/endpoints/bootstrap, dependencies, auth/RBAC/location changes, merge or deploy. Independent security review: NOT PERFORMED. Date: [actual date]. Evidence: [durable reference].

No extra sign-off is needed for each local iteration that satisfies this exact versioned scope. Material schema/constraint or scope changes require an updated owner record within the delegation; any excluded action returns to its original authority. A later database-test execution record may be approved by the same owner only if the applicable delegation permits that exact isolated target/actions; never silently treat SQL generation as execution consent.

## Review outcome and current task boundary

This proposal separates project-process choices from evidenced local supervisor reservations, without claiming unprovided institutional authority. **Smallest route under the current written baseline: one accepted scope/delegation decision, one exact backend-owner Stage 1 design/implementation statement, then TDD within that scope.** No requirement for blanket acceptance of all 18 decisions, whole constitution ratification as a newly invented local-step gate, or a separate team-member review for each local edit. Full constitutional/supervisor/merge/release and independently mandated security approvals remain where they actually apply.

In the original governance-proposal task, only this proposal file was created. The later 03B.0 task updates proposed Stage 1 design documentation and planned test partitions only; it does not adopt G1–G6 or alter active AGENTS/constitution/SRS, delegation, design-acceptance or implementation-authorization status. Independent human security review remains NOT PERFORMED. No Prisma edits, SQL/migrations, database/secret access, runtime changes, dependency, branch/commit/push/merge/deployment or external contact. Stop for human review; do not start Stage 1 implementation from these templates or technical corrections.
