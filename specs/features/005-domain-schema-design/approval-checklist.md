# Human design approval checklist

Status: **PENDING — no signatures, approvals or dates supplied**. The current deliverable verdict READY FOR HUMAN SIGN-OFF means reviewable proposal only. Owner preference is recorded in approval-record.md; all independent approvals remain pending. Even a completed design checklist does not authorize executing a migration without a later explicit implementation request.

Current complete record: [approval-record.md](approval-record.md), including original decision links, exact approval scope, deviations, reviewer/name/date/evidence/status and separate implementation/migration authorization. The checklist below is a reviewer index; do not complete it independently of that record.

## Decision sign-off record

Record accepted option, deviations, reviewer name, date and review link for each applicable row. Blank evidence means pending. Existing D-001 through D-012 stay OPEN until their owning register is changed by a human-approved review.

| Decision | Required human reviewer | Status | Accepted option / name / date / evidence |
|---|---|---|---|
| D-S01 multiple personal and scoped roles | Product + backend + security | PENDING | |
| D-S02 multi-org membership and district grants | Product + backend | PENDING | |
| D-S03 scoped/global admin and operational capabilities | Product + security + supervisor | PENDING | |
| D-S04 verification channel/token/password algorithm | Backend + security + product | PENDING | |
| D-S05 session store/lifetimes/rotation/CSRF/revocation | Backend + security | PENDING | |
| D-S06 intake owner organization/routing | Product + backend | PENDING | |
| D-S07 public aggregates/grid/restricted collection | Privacy + product + frontend teammate | PENDING | |
| D-S08 skills/units/categories/eligibility | Product + backend | PENDING | |
| D-S09 capacity/active set/multi-volunteer needs | Product + backend + QA | PENDING | |
| D-S10 P1 inventory ownership/accounting/returns | Product + backend | PENDING | |
| D-S11 inbox sequence/recovery/retention/worker semantics | Backend + QA + privacy | PENDING | |
| D-S12 audit privileges/immutability limits | Security + backend + ops | PENDING | |
| D-S13 retention/rights/backup holds | Privacy + ops + qualified reviewer for any real-user pilot | PENDING | |
| D-S14 state/actor conflicts and missing API operations | Product + supervisor + frontend/API teammate | PENDING | |
| D-S15 declarative checks/service locks/direct SQL boundary | Backend + security + QA | PENDING | |
| D-S16 Decimal/sequence/API serialization | Backend + frontend/API teammate | PENDING | |
| D-S17 idempotency scope/replay window/tombstones | Backend + QA + privacy | PENDING | |
| D-S18 bootstrap and grant/active-work handover | Product + security + backend | PENDING | |

## Acceptance of the design package

- [ ] Confirm all 23 proposed MVP entities are required for the selected scope, or record removals/alternative design.
- [ ] Confirm the six P1 entities remain deferred unless separately approved; no beneficiary/household, dispatch, payment or external-integration scope is inferred.
- [ ] Review ER cardinalities and the full attribute/nullability/FK/check catalogue, including internal natural-key exceptions C-08.
- [ ] Review all 60 FR/NFR trace rows, BR-01 through BR-10 mapping and 40 PLANNED schema scenarios.
- [ ] Reconcile C-01 through C-11 in the authoritative sources before implementing affected behavior; specifically coordinator/admin authority, reporter drafts, verified/active parent guards, completion/progress routes and owner-bound identity versus mandatory organization scope.
- [ ] Review E23 global FR-027 capability separately with supervisor and independent security; no org Administrator inheritance or self-grant.
- [ ] Approve org/district/object ownership and public-field allowlists without granting implicit global-admin privileges.
- [ ] Approve session/verification/consent policy; no real data or external mail delivery is implicitly authorized.
- [ ] Approve global capacity locking, pair uniqueness, replay, stream ordering and failed-worker recovery semantics; require real PostgreSQL RED/GREEN proof later.
- [ ] Review indexes/query budgets, Decimal/BigInt mapping, native SQL objects and absence of unapproved Prisma Preview features/extensions.
- [ ] Approve audit reader/runtime/migration ownership separation and explicitly accept the privileged-DB-owner tampering limit.
- [ ] Assign concrete retention owners and review triggers; no numeric policy or legal compliance is presumed.
- [ ] Approve phased additive migration design, disposable target safeguards, synthetic seed design and application rollback/forward-fix approach.
- [ ] Confirm no source/schema/migration/frontend/infrastructure/credential/database changes occurred in this milestone.
- [ ] Review actual documentation evidence and unexecuted tests; no CI, benchmark, domain security or migration result inferred.
- [ ] Plan shared-document/ADR/API synchronization after decisions, preserving canonical requirement IDs and truthful evidence.

## Final reviewer record

| Role | Name | Decision (approve / request changes / reject) | Date and review evidence |
|---|---|---|---|
| Backend owner / technical lead | | PENDING | |
| Frontend/API teammate | | PENDING | |
| Product owner | | PENDING | |
| QA reviewer | | PENDING | |
| Security/privacy reviewer | | PENDING | |
| Supervisor | | PENDING | |

Approval scope must say whether it covers the full proposed model or only an individual feature slice and which open decisions remain blockers. A future migration requires its own reviewed SQL, target, TDD evidence, deployment/recovery plan and explicit authorization.

## 03A.3 evidence and physical-plan review

Current gate: NEEDS APPROVAL, see [approval-verification.md](approval-verification.md). General PR #5 approval does not complete any row above. Review [identity-migration-stages.md](identity-migration-stages.md) for exact proposed fields/Prisma models/native objects, 16 FKs in 3/4/5 schema stages, stage-specific RED/catalog/security/recovery evidence requirements and disabled interim endpoints. Every approval and implementation/migration gate remains incomplete until scoped human evidence is supplied.
