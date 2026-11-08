**Real-Time Disaster Relief & Volunteer Management System**

Document ID: RDRVMS-08 \| Version: 0.1 (draft baseline) \| Issued: 08 November 2026

**Purpose** Practical red-green-refactor workflow, test hierarchy, fixtures, automation coverage, regression gates and evidence management.

**Status & approvals** Proposed design baseline, not signed off. Product owner/team and module supervisor must approve requirements, privacy decisions, service-level targets, and any external integrations before development or real-world use.

**Audience** Project team, module supervisor, reviewers

# Testing philosophy

Every behavior starts with a falsifiable requirement and acceptance scenario. Unit tests protect pure business policies; API integration tests protect permissions, DB transactions and errors; E2E tests protect cross-role workflows. Security and resilience tests protect high-risk failure modes. No “tests pass” claim is valid without a captured command/result.

# Red → green → refactor policy

1.  Select one approved story and confirm its linked FR/NFR, examples and negative paths.

2.  Write failing automated test(s) and record the failing command/output (RED).

3.  Implement the minimum code to pass without weakening the assertion or skipping the test (GREEN).

4.  Refactor toward clear module boundaries with tests remaining green (REFACTOR).

5.  Run broader unit/integration/E2E checks; update contract, docs, traceability and PR evidence.

6.  Have a human reviewer verify security, failure paths, test validity and that AI-generated implementation matches the specification.

# Testing levels and tools

| **Layer** | **Preferred tools** | **Scope / examples** | **When** |
|----|----|----|----|
| Pure unit | Vitest | State transitions, authorization policies, validation helpers | Per change |
| API integration | Vitest + Supertest + disposable PostgreSQL | CSRF/auth, Prisma transactions, scoped access | Per PR |
| Contract | OpenAPI schema check + API response tests | Input/output/API versioning | Per PR |
| Web component | React Testing Library + Vitest | Accessible forms, errors, status display | Per PR |
| E2E | Playwright | Reporter → coordinator → volunteer journey | PR smoke / staging |
| Realtime | Socket.IO client test harness | Reconnect, room isolation, duplicate events | PR / nightly |
| Security | OWASP ZAP baseline + SCA/SAST | Auth failures, common attack classes | CI + prerelease |
| Performance | k6 or equivalent | 50-user demo target; p95/p99 trends | Before release |
| Reliability | Scripted chaos/manual | DB down, API restart, backup restore | Before release |

# Risk-based test set

| **Risk level** | **Examples** | **Expected minimum** |
|----|----|----|
| Critical / P0 | Verification, authorization, assignment, notifications | Happy + negative + race/failure + regression |
| High / P1 | Uploads, inventory allocation, sensitive coordinates | Auth + boundary + invalid input + concurrency |
| Medium / P2 | Exports, optional analytics | Contract + permissions + smoke |

# Example TDD slice: assignment acceptance

Given an assignment in PENDING for volunteer V, when V sends accept with current version, status becomes ACCEPTED and audit/notification persist. If volunteer W attempts the same action, server returns authorization failure and no state changes. If V retries with stale version, server returns conflict or documented idempotent result without double side effects.

// Example test intent (adapt after app modules exist)

it('accepts only the target volunteer and records audit', async () =\> {

const assignment = await seedPendingAssignment({ volunteer: 'v1' });

const response = await v1Api.post(\`/api/v1/assignments/\${assignment.id}/accept\`)

.send({ expectedVersion: assignment.version });

expect(response.status).toBe(200);

expect(response.body.data.status).toBe('ACCEPTED');

expect(await auditExists('assignment.accepted', assignment.id)).toBe(true);

});

# Fixtures, isolation and deterministic behavior

- Each DB integration test uses isolated database/schema or disposable container with safe lifecycle and deterministic seed data.

- No tests may run destructive operations against staging/production connection strings.

- Mock external providers only at their boundary; do not mock domain invariants that tests purport to validate.

- Use frozen clocks, controlled UUIDs, idempotency keys and fake notification dispatch queues where suitable.

- Measure concurrency with real PostgreSQL, not only an in-memory mock.

# CI pass/fail and coverage rules

- PR gate: formatting, type checks, unit, API integration, OpenAPI validation, secret scan; smoke E2E on eligible runners.

- Main branch: build production images, scan dependencies/images, publish versioned artifacts; deployment requires configured environment protection.

- Recommend 80% line coverage for critical domain modules as a review signal, never a substitute for security cases; 100% P0 behavior traceability is more important.

- No skipped P0 or security tests in release branch without tracked justification and risk sign-off.

- All flaky tests receive an issue and owner; repeatable failure should not be papered over by blind retries.

# Defect and evidence workflow

| **Field**       | **Minimum evidence**                                 |
|-----------------|------------------------------------------------------|
| Defect          | ID, severity, linked requirement, reproducible steps |
| Expected/actual | Inputs, sanitized response/log and timestamp         |
| Environment     | Commit SHA, image digest, schema migration version   |
| Fix proof       | Failing test before fix + passing test after fix     |
| Regression      | Affected API, role and deployment smoke status       |

# References and operating assumptions

Reference standards are guidance, not a claim of certified compliance. Verify dates and applicable legal obligations at implementation time.

OWASP ASVS 5.0 — https://asvs.owasp.org/

NIST SSDF SP 800-218 — https://csrc.nist.gov/projects/ssdf

W3C WCAG 2.2 — https://www.w3.org/TR/WCAG22/
