# Threat model — preliminary

| ID | Boundary / threat | Mitigation | Test |
|---|---|---|---|
| T-01 | Session spoofing/hijacking | HttpOnly Secure SameSite session, rotation and server invalidation | AT-002 |
| T-02 | Privilege escalation | Server object/org scoped RBAC for API and socket | SEC-001 |
| T-03 | Exposed household coordinates | coarse public DTO and redaction | AT-013, AT-024 |
| T-04 | Duplicate assignment / race | optimistic version, transactions, idempotency | AT-016 |
| T-05 | False public official alert | simulation label and human verification | AT-008 |
| T-06 | Socket message lost | durable notification inbox/outbox + reconnect | AT-018/019 |
| T-07 | Upload injection | MIME + signature, size caps, private storage | AT-026 |
| T-08 | CI secret exposure | protected env, minimal job permission, secret scan | SEC-002 |
| T-09 | Supply chain | locked dependencies, SCA/image scans | release gate |
| T-10 | Unbounded API DoS | rate limiting, pagination, request size caps | SEC-003 |

**Safety constraint:** This is simulated academic software; no automated rescue dispatch, emergency advice or authoritative warnings.

**Legal review:** Review Sri Lanka PDPA and amendments from the Data Protection Authority before storing any real personal information; no certification or compliance claim.
