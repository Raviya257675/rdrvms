**Real-Time Disaster Relief & Volunteer Management System**

Document ID: RDRVMS-11 \| Version: 0.1 (draft baseline) \| Issued: 08 November 2026

**Purpose** Human-controlled spec-driven workflow, repository agent rules, prompt contracts, quality checks and misuse prevention.

**Status & approvals** Proposed design baseline, not signed off. Product owner/team and module supervisor must approve requirements, privacy decisions, service-level targets, and any external integrations before development or real-world use.

**Audience** Project team, module supervisor, reviewers

# Principles / project constitution

| **Rule** | **Enforceable interpretation** |
|----|----|
| 1\. Requirement-first | No code without approved feature spec that cites FR/NFR IDs. |
| 2\. Safety first | Never automate emergency dispatch, incident verification or exposure of precise affected household data. |
| 3\. Test-first | RED → GREEN → REFACTOR for domain/endpoint behavior, including negative authorization tests. |
| 4\. Narrow scope | One vertical slice per task; do not introduce unapproved libraries/services. |
| 5\. Secure by design | Every data access is server-authorized; validate inputs; audit sensitive mutations. |
| 6\. One source of truth | REST/DB authoritative; sockets are best-effort notifications with reconciliation. |
| 7\. Explain changes | Agent reports files changed, commands run, tests passed/failed, assumptions and risks. |
| 8\. No secrets | Never read, paste, log or commit real credentials, personal records or production dumps. |
| 9\. Human review | No autonomous merge, production deployment, migrations or permission escalation. |
| 10\. Evidence | Do not invent test output, vulnerability results, benchmarks or completed approval. |

# Agentic SDD lifecycle

1.  CONSTITUTION: align non-negotiable quality, test, safety and privacy principles; save in .specify/memory/constitution.md.

2.  SPECIFY: write feature purpose, actors, stories, acceptance, negative cases and out-of-scope in specs/features/NNN/spec.md. No stack details unless a constraint.

3.  CLARIFY: mark decisions as OPEN; get human decision on security/actor ambiguity, or proceed only with explicitly documented safe baseline.

4.  PLAN: propose endpoints, schema changes, affected modules, threat checks and tests.

5.  TASKS: slice work into small reviewable steps; mark dependencies and FR/test IDs.

6.  TEST (RED): write tests showing expected failure.

7.  IMPLEMENT (GREEN) and REFACTOR: minimal implementation respecting module conventions.

8.  VERIFY: commands, contract checks, migration test, security review, docs sync.

9.  CONVERGE / REVIEW: gap review against original specs, obtain human approval, merge through PR.

# Agent task brief template

TASK: Implement \<story title\>

SOURCE: specs/features/\<id\>/spec.md (FR-xxx; AT-xxx)

SCOPE: \<allowed files and exclusions\>

PLAN FIRST: summarize impacted modules/API/schema and list risks.

TESTS FIRST: add or update failing tests; show exact command and failure.

IMPLEMENT: minimum code, no new dependencies without approval.

VERIFY: unit/integration/security checks and OpenAPI/docs sync.

OUTPUT: changed files; tests run/results; unverified items; decisions needed.

STOP CONDITIONS: secrets, real PII, destructive migration, privilege change, prod deploy.

# Agent instruction resolution

The root AGENTS.md is a project-wide contract for supported agents. GitHub Copilot uses .github/copilot-instructions.md and path-specific .github/instructions/\*.instructions.md. Other clients/harnesses differ; verify instruction discovery in the chosen editor. Word documents are for human review; active specs and instructions are committed to the repository.

# Required feature artifacts

| **File** | **Required content** | **Gate** |
|----|----|----|
| spec.md | Who/why, user stories, acceptance and negative paths, FR/NFR refs | Product review |
| plan.md | Architecture/API/data deltas, risk, tests, rollout | Technical review |
| tasks.md | Ordered red-green-refactor tasks with owners/status | Implementation readiness |
| test-cases.md / .feature | Inputs, expected outputs, edge/auth cases | QA review |
| ADR if applicable | Alternatives, tradeoff and decision | Architecture approval |
| PR description | Changed files, evidence, risk, traceability | Human merge approval |

# AI-assisted code review checklist

- Does the generated code satisfy exactly the story without silently adding extra permissions?

- Do tests fail on the pre-change implementation and pass for the right reason?

- Does every endpoint check object ownership/organization scope before return or mutation?

- Are transactions, retries, idempotency and concurrent requests handled safely?

- Are data fields redacted in public/socket/error/log output?

- Are migration and environment changes captured, documented and reversible where possible?

- Does the agent disclose files it could not inspect and tests it did not run?

# Prompting anti-patterns

- Do not ask “build the complete production platform in one prompt.” Use approved vertical slices.

- Do not treat AI-generated documentation as stakeholder-reviewed requirements.

- Do not paste private incident data into arbitrary cloud agents.

- Do not let an agent silently choose secrets, permissions, cloud costs or legal retention policy.

- Do not request “fix tests” without protecting expected behavior against assertion weakening.

# References and operating assumptions

Reference standards are guidance, not a claim of certified compliance. Verify dates and applicable legal obligations at implementation time.

GitHub Spec Kit: Agentic SDD — https://github.github.com/spec-kit/reference/agentic-sdd.html

VS Code custom instructions reference — https://code.visualstudio.com/docs/agents/reference/custom-instructions-reference

GitHub Copilot custom instructions — https://docs.github.com/en/copilot/concepts/prompting-and-context/custom-instructions

NIST SSDF SP 800-218 — https://csrc.nist.gov/projects/ssdf
