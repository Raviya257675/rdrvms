**Real-Time Disaster Relief & Volunteer Management System**

Document ID: RDRVMS-06 \| Version: 0.1 (draft baseline) \| Issued: 08 November 2026

**Purpose** Normalized relational entities, constraints, indices, migration policy, retention and controlled seed data.

**Status & approvals** Proposed design baseline, not signed off. Product owner/team and module supervisor must approve requirements, privacy decisions, service-level targets, and any external integrations before development or real-world use.

**Audience** Project team, module supervisor, reviewers

# Relational inventory

| **Entity** | **Primary columns** | **Integrity and confidentiality notes** |
|----|----|----|
| users | id UUID PK; email unique; password_hash; display_name; status; created_at; updated_at | No public contact leakage; normalized unique email; deleted_at optional |
| organizations | id PK; name; region_code; status; created_at | Owns coordinator scope and inventory |
| memberships | id PK; user_id FK; organization_id FK; role; status | Unique user+org+role; admin-managed |
| volunteer_profiles | user_id PK/FK; skills JSONB; region_code; available; capacity | Never assume location consent |
| incidents | id PK; reporter_id FK; title; type; district; approximate_point; restricted_point; status; verified_by FK; verified_at | Restriction on precise coordinates; reason on verification/rejection |
| relief_requests | id PK; incident_id FK; category; quantity; unit; priority; status; created_by FK; version | Must link verified incident before approval |
| assignments | id PK; relief_request_id FK; volunteer_id FK; coordinator_id FK; status; version; assigned_at | Unique active assignment invariant transactionally |
| inventory_items | id PK; org_id FK; sku; label; unit; quantity_available; version | Nonnegative count; unique org+sku |
| allocations | id PK; request_id FK; inventory_item_id FK; qty; status; created_by FK | Prevent over-allocation |
| notifications | id PK; recipient_id FK; kind; event_key; payload JSONB; created_at; read_at | Payload excludes secrets and private location |
| audit_events | id PK; actor_id; target_type; target_id; action; request_id; created_at; metadata JSONB | Write-once from application path; restricted retention |
| outbox_events | id PK; aggregate_type; aggregate_id; event_type; payload JSONB; created_at; processed_at; attempts | Atomic write with domain data for eventual notification delivery |
| sessions | id PK; user_id FK; expires_at; revoked_at; session_data; created_at | Use secure server-side session store; do not expose session IDs |

# Primary relationships

- users 1:N incidents (reporter); users 1:1 volunteer_profiles (optional).

- users N:M organizations through memberships; all coordinator authorization checks scoped through active membership.

- incidents 1:N relief_requests; relief_requests 1:N assignments and allocations.

- users 1:N assignments (volunteer or coordinator) and notifications.

- organizations 1:N inventory_items; allocations join inventory_items and relief_requests.

- Every sensitive aggregate 1:N audit_events and optionally outbox_events; audit events are not user-editable.

# Database invariants and recommended indexes

| **Object** | **Constraint/index** | **Reason** |
|----|----|----|
| users | UNIQUE normalized email, index status | Duplicate accounts and suspension lookup |
| memberships | UNIQUE (user_id, organization_id, role) | Scope correctness |
| incidents | INDEX (status,district,created_at DESC) | Coordinator board pagination |
| relief_requests | INDEX (incident_id,status,priority) | Filtered needs; relationship |
| assignments | INDEX (volunteer_id,status); UNIQUE request+volunteer+active state via partial index or equivalent invariant | Avoid duplicate active work |
| inventory_items | CHECK quantity_available\>=0; UNIQUE (organization_id,sku) | Overdraw prevention |
| notifications | INDEX (recipient_id,created_at DESC,id) | Inbox cursor pagination |
| outbox_events | INDEX (processed_at,created_at) WHERE processed_at IS NULL | Efficient worker polling |
| audit_events | INDEX (target_type,target_id,created_at); INDEX request_id | Trace investigation |

# Privacy classification

| **Data class** | **Examples** | **Storage/display policy** |
|----|----|----|
| Public redacted | District, incident type, approximate count | May be exposed after verification |
| Internal operational | Assignment status, organization name | Restricted scoped access |
| Confidential | Private contact, volunteer profile, exact coordinates | Need-to-know; no default exports |
| Secret | Session IDs, password hashes, API keys | Hash/encrypt where appropriate; never log |
| Audit-sensitive | Privilege-change history | Append-only application path; limited readers |

# Migration and schema discipline

1.  Update the approved feature spec, ER/data dictionary and ADR if relevant.

2.  Create Prisma migration in development and commit migration SQL; review destructive effects.

3.  Back up staging, run migration test from realistic prior schema with seeded data.

4.  Deploy using prisma migrate deploy in staging/production-like environments (not schema push).

5.  For destructive changes use expand-migrate-contract rather than removing columns before dependent services update.

6.  Capture migration ID/hash and rollback or forward-fix strategy in release record.

# Retention, deletion and backup

Retention periods are UNAPPROVED until the team defines a simulated-data policy and qualified privacy/legal review determines obligations for real users. Define deletion and access request workflows, backup retention, encryption and permitted regions before any public pilot. Do not delete audit evidence indiscriminately; apply lawful retention with restricted access.

# Data test fixtures

- Seed fixed fictional Sri Lankan districts and examples; no names/phone numbers of actual disaster victims.

- Use deterministic IDs or fixture aliases to support repeated test runs.

- Create an available volunteer, unavailable volunteer, active coordinator, suspended user, verified/unverified incident, approved/unapproved request, concurrent competing assignment and unread notifications.

- Separate migration tests from isolated integration DB tests; never run destructive test reset against staging or production.

# References and operating assumptions

Reference standards are guidance, not a claim of certified compliance. Verify dates and applicable legal obligations at implementation time.

Prisma production migrations — https://www.prisma.io/docs/orm/v7/prisma-migrate/workflows/development-and-production

Sri Lanka Data Protection Authority — https://www.dpa.gov.lk/guidelines.php

OWASP ASVS 5.0 — https://asvs.owasp.org/
