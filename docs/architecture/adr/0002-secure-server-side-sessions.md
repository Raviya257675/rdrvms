# ADR-0002: Secure server-side sessions

- Status: **PROPOSED — human approval pending**
- Date: 2026-11-08
- Context: RDRVMS academic simulation, requirements FR and NFR, DevOps learning goals.
- Decision: Use same-origin Secure HttpOnly cookies with server-side session store and CSRF protection.
- Rationale: Better cookie control and revocation for browser app.
- Alternatives considered: LocalStorage JWT; OAuth provider.
- Consequences: Keep scope small; revisit after measured bottleneck, privacy or grading change. Any breaking change updates SRS, tests, architecture diagram and deployment documentation.
- Approval: PENDING.
