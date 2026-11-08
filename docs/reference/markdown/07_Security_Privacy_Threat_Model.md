**Real-Time Disaster Relief & Volunteer Management System**

Document ID: RDRVMS-07 \| Version: 0.1 (draft baseline) \| Issued: 08 November 2026

**Purpose** Risk-driven controls for sensitive incident locations, volunteers, roles, real-time updates and software supply chain.

**Status & approvals** Proposed design baseline, not signed off. Product owner/team and module supervisor must approve requirements, privacy decisions, service-level targets, and any external integrations before development or real-world use.

**Audience** Project team, module supervisor, reviewers

# Safety posture

This is an academic coordination simulation and must not be presented as an authoritative source of public warnings or official emergency dispatch. Avoid automatically directing people into hazardous environments. Human coordinators must review verification and assignments. Disclose simulation status on all test deployments.

# Assets, attackers and trust boundaries

| **Asset** | **Threat actor / exposure** | **Boundary/control** |
|----|----|----|
| Exact incident location | Curious user, scraper, compromised volunteer | Coarse public map, scoped access |
| Volunteer identity/contact | Another volunteer, staff misuse | Object-level RBAC, logging, minimization |
| Verification authority | Malicious reporter, stolen coordinator account | Role checks, MFA later, reason/audit |
| Assignments/inventory | Race or replay attacks | Transactions, idempotency, locks/versions |
| Credential/session | Phishing, stolen cookie, CSRF | Secure HttpOnly cookies, CSRF token, rotation |
| CI credentials | PR injection, dependencies | Least privilege, protected branches, secret scans |

# STRIDE-style threat register

| **ID / class** | **Scenario** | **Mitigation and validation** |
|----|----|----|
| T-01 Spoofing | Attacker uses leaked session | HttpOnly Secure SameSite cookie; revoke sessions; AT-002 |
| T-02 Tampering | Volunteer forges verification status | Server RBAC, transition rules, audit; AT-004/008 |
| T-03 Repudiation | Coordinator denies assignment | Audit request ID, actor/time, immutable app path; AT-025 |
| T-04 Info disclosure | Public API reveals exact affected household point | Redacted DTOs, object policy; AT-013/024 |
| T-05 Denial of service | Automated reporting floods API | Rate limits, body caps, pagination; SEC-003 |
| T-06 Elevation | Wrong org coordinator accesses another org | Scoped membership check on every object; SEC-001 |
| T-07 Replay | Duplicate allocation/assignment on client retries | Idempotency key + transaction; AT-016/022 |
| T-08 Supply chain | Vulnerable package/container image | Lockfiles, SCA/SBOM, image scans, approved base |
| T-09 Event leakage | Socket room receives confidential event | Server-authorized rooms, minimal payload and socket tests |
| T-10 Evidence misuse | Upload contains active content/malware | Type/size allowlist, private storage, safe delivery |
| T-11 SSRF | Malicious URLs in evidence metadata | No server fetch of arbitrary supplied URLs |
| T-12 Secrets | Tokens printed to logs or bundle | Secret scanner + redaction + security review |

# Security design baseline

- Use strong password hashing via current approved algorithm; no custom cryptography.

- Use server-side sessions stored in Postgres or approved session store, secure cookies, same-origin routing and CSRF protection.

- Protect every API endpoint and websocket room by authentication plus resource-scoped authorization.

- Validate input server-side with typed schemas, length/range rules, allowlist enum values and output encoding.

- Use TLS and HSTS in internet-facing deployments; database and metrics endpoints private.

- Enable reasonable API rate limits and bounded request bodies; use non-identifying error messages.

- Keep secrets outside Git, code-agent prompts, logs, issue templates and compiled assets.

- Review supply-chain dependencies, container image vulnerabilities, actions/CI permissions and PR permissions.

- Create incident response contact and revocation procedure before testing with real accounts.

# Privacy and legal review gate for Sri Lanka

Sri Lanka maintains a Personal Data Protection Authority and amended PDPA materials. Exact applicability, lawful basis, retention, data-subject rights and cross-border processing require review against the current official materials and your deployment facts. This pack does NOT assert legal compliance. For simulated demo data, use fictional incidents and do not collect survivor phone numbers or precise home locations.

# Security acceptance / quality gates

| **Gate** | **Must show** |
|----|----|
| Design review | Updated threat model for every new sensitive flow |
| PR gate | Automated SAST/dependency/secret checks, auth regression tests |
| Staging gate | Security headers, HTTPS, session/CSRF, least privilege verified |
| Release gate | No unresolved critical/high findings without documented approval |
| Incident review | Evidence log, owner, response action and retrospective |

# References and operating assumptions

Reference standards are guidance, not a claim of certified compliance. Verify dates and applicable legal obligations at implementation time.

OWASP ASVS 5.0 — https://asvs.owasp.org/

NIST SSDF SP 800-218 — https://csrc.nist.gov/projects/ssdf

Sri Lanka Data Protection Authority — https://www.dpa.gov.lk/guidelines.php
