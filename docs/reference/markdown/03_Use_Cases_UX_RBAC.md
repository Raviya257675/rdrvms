**Real-Time Disaster Relief & Volunteer Management System**

Document ID: RDRVMS-03 \| Version: 0.1 (draft baseline) \| Issued: 08 November 2026

**Purpose** Role-resolved operations, detailed use-case contracts, screen inventory, accessibility and data-display rules.

**Status & approvals** Proposed design baseline, not signed off. Product owner/team and module supervisor must approve requirements, privacy decisions, service-level targets, and any external integrations before development or real-world use.

**Audience** Project team, module supervisor, reviewers

# Permission matrix (baseline; enforce on server)

| **Action / resource** | **Guest** | **Reporter** | **Volunteer** | **Coordinator** | **Administrator** |
|----|----|----|----|----|----|
| View public aggregated incident summaries | Yes | Yes | Yes | Yes | Yes |
| Submit incident report | No | Yes | Yes | Yes | Yes |
| View restricted incident location | No | Own reports only | Assigned only | In scope | Yes |
| Verify/reject incident | No | No | No | In scope | Yes |
| Create relief request | No | Own draft only | No | In scope | Yes |
| Approve/close relief request | No | No | No | In scope | Yes |
| Edit own volunteer availability | No | No | Own | Own if volunteer | Own if volunteer |
| Assign volunteer | No | No | No | In scope | Yes |
| Accept/decline assignment | No | No | Own | Own if volunteer | Own if volunteer |
| View personal notifications | No | Own | Own | Own | Own |
| Manage inventory & allocations | No | No | No | In scope | Yes |
| Manage roles/org membership | No | No | No | No | Yes |
| Read sensitive audit logs | No | No | No | Limited | Yes |
| Export authorized summaries | No | No | No | In scope | Yes |

“In scope” means organization- and region-scoped authorization, not a generic coordinator-wide entitlement. A matrix is insufficient alone: enforce object-level ownership/organization policy and check membership status at the database-backed authorization layer.

# Use case catalogue

## UC-01 — Submit incident

**Actor / preconditions** Reporter \| Logged-in and not suspended

**Success flow** Submit title/category/district/approximate location; validate; persist UNVERIFIED; show incident ID

**Alternates / failure states** 400 invalid fields; 401 unauthenticated; 413 media too large

## UC-02 — Verify incident

**Actor / preconditions** Coordinator \| Active scoped membership; incident UNVERIFIED

**Success flow** Review evidence, set VERIFIED or REJECTED with reason, emit audit event

**Alternates / failure states** 403 wrong org; 409 stale version; unauthorized evidence view

## UC-03 — Create relief request

**Actor / preconditions** Coordinator \| Verified incident in scope

**Success flow** Enter need and priority; approve; record request and audit

**Alternates / failure states** 409 incident not verified; bad quantities; conflict

## UC-04 — Assign volunteer

**Actor / preconditions** Coordinator \| Request APPROVED; volunteer active and available

**Success flow** Choose volunteer, create PENDING assignment in transaction, notify

**Alternates / failure states** 409 unavailable or duplicate; 403 cross-org

## UC-05 — Respond to assignment

**Actor / preconditions** Volunteer \| Logged-in target of PENDING assignment

**Success flow** Accept/decline once; store reason on decline; notify coordinator

**Alternates / failure states** 403 wrong user; 409 duplicate click; expired assignment

## UC-06 — Reconnect and recover

**Actor / preconditions** Volunteer \| Existing session and persisted notifications

**Success flow** Re-fetch notifications/assignments after reconnect; reconcile UI state

**Alternates / failure states** Expired session prompts login; missing socket not treated as data loss

## UC-07 — Manage supplies

**Actor / preconditions** Coordinator \| Approved org membership

**Success flow** Create item, allocate positive qty with atomic reserve/update

**Alternates / failure states** 409 insufficient stock; 422 invalid unit

## UC-08 — Suspend compromised account

**Actor / preconditions** Administrator \| Privileged admin session

**Success flow** Disable account, revoke sessions, log actor and reason

**Alternates / failure states** 400 self-lockout policy; 403 nonadmin

# Screen and navigation inventory

| **Route / screen** | **Audience** | **Primary behavior** | **Loading/error/empty state** |
|----|----|----|----|
| / | Public | Redacted summary and safety disclaimer | Clearly visible demo notice |
| /auth/\* | Guest | Login, registration, recovery | Generic error; rate limit |
| /dashboard | All logged-in | Role-aware summary and alerts | Skeleton + retry |
| /incidents | All scoped | Filter, paginate, list/map switch | No matches + pagination |
| /incidents/new | Reporter+ | Validated incident form | Draft retention decision pending |
| /incidents/:id | Scoped | Incident details and history | 403/404 safe messages |
| /requests | Coordinator | Create/approve relief needs | Permission and validation |
| /assignments/mine | Volunteer | Accept, decline, complete | Optimistic UI disabled until confirmation |
| /inventory | Coordinator | Stock and allocations | Concurrency conflict reload |
| /notifications | Authenticated | Unread/inbox/recovery | Reconnect refresh |
| /admin/users | Administrator | Manage status and roles | Confirmation + reason |

# UX and accessibility rules

- Always show status labels in text; never use color alone to convey severity.

- Default map zoom and markers must not disclose sensitive private locations.

- All form controls have persistent labels, errors adjacent to input and summary of validation errors.

- Reversible high-impact actions require confirmation; destructive actions require reason and audit evidence.

- No silent failed optimistic mutation. On 409, show current data and offer refresh/retry.

- Keyboard access, focus management, semantic headings and screen-reader announcements for notification updates.

- Show “simulation / not for official emergency use” prominently throughout demo builds.

# System state sketches

Incident: UNVERIFIED → VERIFIED or REJECTED; VERIFIED → ACTIVE → RESOLVED; administrative cancellation with reason. Relief request: DRAFT → APPROVED → IN_PROGRESS → FULFILLED or CANCELLED. Assignment: PENDING → ACCEPTED → IN_PROGRESS → COMPLETED; PENDING → DECLINED or CANCELLED. Every transition validates actor, scope, expected current state and optimistic version.
