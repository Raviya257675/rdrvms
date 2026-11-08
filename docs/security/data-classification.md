# Information classification and handling

- PUBLIC_REDACTED: verified district/type and aggregate counts. May be displayed to guests.
- INTERNAL: operational request status and organization data. Scoped authorized members only.
- CONFIDENTIAL: contact details, volunteer skills/availability, exact locations, uploads. Need-to-know checks, no default export.
- SECRET: password hash, session IDs, API keys, DB URL. Never transmit to browser bundle, analytics or logs.
- AUDIT_SENSITIVE: actor, reason, object ID. Restricted operations access, retention pending legal review.

## Non-production policy
Use deterministic fictional seed data. No real disaster victims' PII. Retention and cross-border processing require explicit reviewed decision before a real-user pilot.
