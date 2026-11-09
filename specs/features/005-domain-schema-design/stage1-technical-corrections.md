# Stage 1 technical corrections — Master Prompt 03B.0

Status: **PROPOSED / PENDING HUMAN DESIGN ACCEPTANCE**. Scope is E01 `districts`, E04 `organizations`, E05 `organization_districts` on `feature/database-geography-stage1`. Prepared 2026-11-10 from HEAD `c9969c3d048446961445f1ef781e57bff487a4b6`, including the pre-existing local approval-record edit and untracked development proposal. This task authorizes corrections to proposed documentation only. Delegation remains NOT GRANTED / UNVERIFIED; implementation and SQL execution remain NOT AUTHORIZED. No human reviewer, approval or independent-security signature is supplied by this document.

Trace: FR-004/033; NFR-007/017/019; AT-004/033, NF-007/017/019, SEC-001/002; existing SC-04/05/24/31/32/39/40 partitions. D-S02/D-S15 apply only to the structural/integrity subset, not acceptance of either full decision. No requirement ID, priority, canonical test status, authoritative governance rule, auth/RBAC permission or public-location policy changes.

## Corrections versus choices awaiting acceptance

| Review finding | Technical clarification | Proposed choice requiring explicit acceptance |
|---|---|---|
| 1 whitespace | Default btrim removes ordinary spaces, not all whitespace; SQL and application rules need explicit parity | Exact W/B sets and name-edge trimming below — product/backend PENDING |
| 2 codes | Stored-value uniqueness does not define canonical identity or collation | Strict uppercase ASCII, rejection without normalization, deterministic C code collation — product/backend PENDING |
| 3 retirement races | Activity is cross-row policy; FK existence cannot serialize retirement | District-first locking, rechecks, handover and controlled races — backend/security/QA PENDING before future writers |
| 4 privileges | Constraints cannot prove who may associate valid parents; owner powers exceed ordinary ACLs | Explicit role matrix and trusted offline-writer boundary — security/backend/operator PENDING; no live grants installed |
| 5 identifiers | RESTRICT does not make all identifiers immutable or prohibit unreferenced deletion | Immutable UUID/code/pair, retained history and explicit reactivation rules — product/backend/security PENDING |
| 6 tests | Documentation or Prisma compilation cannot prove applied SQL/policy behavior | S1-01–S1-16 planned partitions in test-cases.md; SQL target and operational test execution require separate authorization |

These scoped corrections refine the earlier proposed Stage 1 design; they do not adopt the separate DEV-STAGE1 governance proposal. All broader D/C decisions and Stage 2/3 models remain unchanged. Technical review readiness is separate from permission to implement.

## Text and code policy proposal

Recommend exact ASCII codes for machine identity and unrestricted meaningful Unicode names for display. No extension, dependency, locale table or transliteration is needed. Product acceptance of the vocabulary and formats is **PENDING**.

| Alternative | Consequences | Recommendation |
|---|---|---|
| Opaque case-sensitive codes | Few format rules, but case/space variants can represent confusing duplicate concepts | Viable only if product explicitly accepts that behavior |
| Normalize input by trimming/casefolding | Convenient input, but every seed/import/API path must agree on normalization and collision handling | More moving parts; do not silently apply |
| Canonical uppercase ASCII; reject other input | One exact representation and simple SQL/application agreement; meaningful localized names remain separate | Recommended PENDING option |

For both code columns, proposed valid values have 1–32 characters: first character A–Z; remaining characters A–Z, 0–9 or underscore. The exact full-string grammar is `^[A-Z][A-Z0-9_]{0,31}$` under C collation. Trailing/consecutive underscores are allowed by this simple grammar; no additional shape rule is implied. Inputs are case-sensitive and must already be canonical: do not trim, casefold, NFC/NFKC-normalize, transliterate or truncate them. Reject lowercase, padding, embedded whitespace/control characters, hyphens and non-ASCII/confusable characters. A future application must consume the entire string, including rejecting a final newline, rather than relying on JavaScript `$` behavior alone.

Each parent retains an ordinary nonpartial UNIQUE(code), including inactive rows. Proposed database encoding is UTF8 and **only the two code columns** use the built-in deterministic `C` collation, inherited by their UQ indexes and code checks. No database-wide collation/locale change is proposed. An existing target with a conflicting encoding/collation/object is a stop-and-review condition, not permission to convert it. Prisma scalar syntax does not itself pin column collation; later reviewed native SQL and catalog assertions must do so. UUID/pair comparisons keep their native behavior. Fictional aliases `DEMO_DISTRICT_01`, `DEMO_DISTRICT_02`, `DEMO_ORG_01`, `DEMO_ORG_02` illustrate the grammar and are not an approved administrative code list or permission to seed.

For name blank detection, define W by **explicit code points**, matching the 25 Unicode 17.0 White_Space characters: U+0009–U+000D, U+0020, U+0085, U+00A0, U+1680, U+2000–U+200A, U+2028, U+2029, U+202F, U+205F, U+3000. Define B as W plus U+200B ZERO WIDTH SPACE and U+FEFF BOM for blank detection only. These extra two are not asserted to be Unicode White_Space. This fixed proposal avoids locale-dependent POSIX space classes and differences between JavaScript trim/Unicode regex sets. Source: [Unicode 17.0 property list](https://www.unicode.org/Public/17.0.0/ucd/PropList.txt).

Candidate literal definitions for documentation review only (W and B are notation, not SQL identifiers, variables or new database functions):

```text
W = U&'\0009\000A\000B\000C\000D\0020\0085\00A0\1680\2000\2001\2002\2003\2004\2005\2006\2007\2008\2009\200A\2028\2029\202F\205F\3000'
B = U&'\0009\000A\000B\000C\000D\0020\0085\00A0\1680\2000\2001\2002\2003\2004\2005\2006\2007\2008\2009\200A\2028\2029\202F\205F\3000\200B\FEFF'
Name CHECK expression = char_length(translate(name, B, '')) > 0
Code CHECK expression = code COLLATE "C" ~ '^[A-Z][A-Z0-9_]{0,31}$'
```

Future native SQL must inline the exact reviewed B literal in each name check. No CREATE/ALTER/GRANT or executable migration is generated here. The native name expression removes B characters from a copy solely to decide whether anything remains; it does not mutate stored names. SQL functions are documented in [PostgreSQL 17 string functions](https://www.postgresql.org/docs/17/functions-string.html).

The application proposal trims exactly W from name edges, rejects empty/B-only results, and preserves all other content and internal spacing. It does not normalize names, strip embedded joiners/combining marks, casefold or impose ASCII. Names are nonunique. Count Unicode code points after trimming (e.g. JS string iteration), matching SQL char_length: 1–100 for district names and 1–160 for organization names, rather than bytes, grapheme clusters or UTF-16 units. Validate the submitted raw name length against the same maximum before trimming too, so padding cannot bypass resource bounds. Native checks guarantee nonblank and varchar bounds; they do not guarantee that application edge trimming occurred. No comprehensive control-character or invisible-glyph sanitizer is claimed; any broader name-content policy requires review. Escape untrusted names in future renderers.

Preserve meaningful Sinhala/Tamil names and their joiners; U+200C/U+200D are not stripped by this proposal. Add positive localized examples and negative B-only examples; this is blank detection, not a guarantee that every remaining character renders visibly. Do not use this Stage 1 policy to change other entities' pending text rules.

## Physical inventory and Prisma boundary

All 18 columns, NN declarations, defaults, 3 PKs, 2 UQs, 2 validated nondeferrable UPDATE/DELETE RESTRICT FKs and the reverse B-tree remain as listed in [identity-migration-stages.md](identity-migration-stages.md). The only added physical setting proposed here is C collation on the two code columns; seven explicit Stage 1 CHECK candidates replace the earlier ambiguous text-check shorthand:

| Proposed name | Exact responsibility |
|---|---|
| districts_version_ck | version >= 1 |
| organizations_version_ck | version >= 1 |
| districts_code_text_ck | Exact code expression above, including code collation |
| organizations_code_text_ck | Exact code expression above, including code collation |
| districts_name_text_ck | Exact name expression above with B inlined |
| organizations_name_text_ck | Exact name expression above with B inlined |
| organizations_status_ck | status IN ('ACTIVE','INACTIVE') |

Do not add redundant nonblank checks for status/codes: their membership/grammar checks already exclude blank. All checks still need explicit NN columns, since CHECK alone can pass NULL. Name uniqueness, extra bridge UUID/version, code reuse and new active-only partial UQs are not proposed. No other Stage 1 indexes are added. Code/native text checks, column collation, FK actions and ACLs need pinned-version catalog/drift proof later; a Prisma schema diff cannot establish native-object preservation. Prisma `onUpdate: Restrict` must be explicit rather than accepting its default Cascade. No Prisma models or configuration changes are authorized now. Sources: [PostgreSQL 17 constraints](https://www.postgresql.org/docs/17/ddl-constraints.html), [Prisma v7 feature matrix](https://www.prisma.io/docs/orm/v7/reference/database-features), [Prisma referential actions](https://www.prisma.io/docs/orm/v7/prisma-schema/data-model/relations/referential-actions).

## Proposed district retirement and writer serialization

This is a future service/approved offline-writer protocol, not an operational feature or SQL execution permission. Current Stage 1 installs no writer or bootstrap. Recommend short READ COMMITTED transactions with explicit **FOR UPDATE** locks, rechecking current rows after lock acquisition and retaining locks until commit/rollback. All writers relying on an active district and all retirement/reactivation/association writers must participate; a raw maintenance write can bypass the protocol and is a trusted, human-controlled exception requiring review.

Within the shared protocol in [transactions.md](transactions.md), acquire: optional idempotency candidate → relevant users sorted by UUID → applicable account-security grants → **districts sorted by UUID → organizations sorted by UUID → existing organization_districts sorted by (organization_id,district_id)** → memberships/district grants → subsequent domain/profile locks in the existing order → audit/required durable effects. Only applicable objects are locked. No Stage 1 table is added to other slices. Full user/grant/authorization behavior is outside this correction.

Discover all reference keys before acquiring locks; revalidate discovery afterward. A late discovery of an earlier-order user/district/org requires rollback and restart with the complete sorted set. A missing parent fails closed. An absent bridge row cannot be row-locked: lock its district then organization before INSERT, and let the composite PK remain the final uniqueness arbiter. District FOR UPDATE serializes participating creators for the same absent pair. Never use SKIP LOCKED to decide district eligibility. This simple protocol also serializes unrelated writers within a district; benchmark later before proposing weaker locks or a different protocol. FK key locks alone do not prevent non-key active/status updates. See [PostgreSQL 17 locking](https://www.postgresql.org/docs/17/explicit-locking.html).

| Proposed operation | Locks, rechecks and atomic change | Failure/history behavior |
|---|---|---|
| Retire district | Lock district at its prescribed position; recheck actor/manifest and expected version; set active=false, increment version, set updated_at and append mandatory audit after audit support is available | Do not update/delete mappings or historical children; missing/stale/unauthorized transition has no success effects; active-work handover contract is required before operational retirement |
| Create association | Lock active district, then ACTIVE organization, then existing pair if present; check exact allowed manifest pair/current authority; insert only when absent with explicit intended active value and audit | Existing active/inactive pair conflicts; no upsert that changes active, no implicit all-district grant or default-derived permission |
| Reactivate association | Same parent/pair order; require active district/org, an existing inactive pair, fresh explicit authority and current locked state; set the same row active=true and audit once | No INSERT replacement; retain created_at/pair; repeated active request returns an explicit unchanged/conflict outcome with no second transition audit; exact API outcome deferred to its future contract |
| Deactivate association or organization | Acquire applicable reference locks in the same order, recheck authority/version as applicable, update non-key state and audit | Do not scan a mapping first and later lock its district; no cascade cancellation or history erasure; handover rules required for active work |
| Future district-active-dependent mutation | Lock/recheck all relevant district/org/mapping rows before writing later domain state; apply current actor/owner/org/district/role checks and durable effects atomically | Writer-first commits while retirement waits; retire-first commits inactive and waiting writer rejects after reread; no new eligible work after retirement commits |

District/organization reactivation is a separate explicit reviewed operation with version/audit, not a seed rerun. Reopening a parent does not flip an inactive mapping to active. Because retirement preserves mapping flags, a retained active mapping can become eligible again when its parents reactivate; approval of parent reactivation must enumerate and accept those resulting eligible pairs, otherwise refuse it. Membership/role grants never follow merely from table activity.

History and in-progress commitments remain; retirement is not automatic cancellation or an authorization bypass for continuing work. Exact handover/continuation actors remain PENDING in the owning future slice. Audit failure rolls back the transition. Lock/statement/transaction budgets and bounded retries need accepted values compatible with existing feature-004 limits; they are not raised here. Retry recognized deadlock/serialization failures only from the beginning; duplicate/stale/business conflicts do not receive blind retries. Controlled tests use two connections and observable barriers in both acquisition orders, rollback, timeout, competing creators/reactivators and opposite-order batch inputs. No fixed sleep is accepted as proof of serialization.

## Proposed PostgreSQL permission matrix

All entries are **PENDING SECURITY/OPERATOR ACCEPTANCE**, not actual grants, installed roles or changes to runtime RBAC. Semantic role labels below are not selected database role names. Scope is these three reference tables only; no audit/identity privilege is granted here. Stage 1 runtime needs only its existing connectivity/SELECT 1 behavior and receives **no privileges on these unused tables**, including no table SELECT. A future need for domain reads or lock-taking requires its own accepted role/slice record.

| Role | SELECT | INSERT | UPDATE | DELETE / TRUNCATE | Ownership, DDL, GRANT / SET ROLE |
|---|---|---|---|---|---|
| Current application runtime | None on E01/E04/E05 | Denied | Denied | Denied / denied | No ownership, schema CREATE, DDL, grant option, owner membership, owner SET ROLE or helper bypass |
| Migration operator / non-login owner | Necessary catalog/data inspection during approved work | Technically available as owner; not authorized for bootstrap by Stage 1 | Technically available as owner; no operational action inferred | Inherent owner ability, but forbidden by this task/stage scope; destructive action requires separate consent | Trusted DDL boundary; ideally NOLOGIN owner assumed only by separately authorized migration operator for exact target/SQL; runtime/bootstrap/maintenance cannot assume it |
| Future approved bootstrap | All three tables within reviewed isolated target | Explicit columns for reviewed fictional parents/pairs only, after audit dependencies and manifest approval | Only districts(active), organizations(status), organization_districts(active), to permit row locks; bootstrap workflow must not update/reactivate existing rows | Denied / denied | No owner/DDL/grant option or SET ROLE to elevated roles |
| Future maintenance | All three tables within reviewed target | Denied; new/replacement identities require a separate approved bootstrap manifest | districts(name,active,updated_at,version); organizations(name,status,updated_at,version); organization_districts(active) only | Denied / denied | No owner/DDL/grant option or SET ROLE to elevated roles |

The bootstrap INSERT column inventory is districts(id,created_at,updated_at,version,code,name,active), organizations(id,created_at,updated_at,version,code,name,status) and organization_districts(created_at,organization_id,district_id,active), restricted by its reviewed workflow/manifest values rather than per-row ACLs. It receives no UPDATE on id/code/created_at, no broader table UPDATE and no automatic default privileges on future tables. Maintenance column lists above are exhaustive; columns needed by later services require a new scoped privilege review.

PostgreSQL row-locking SELECT requires UPDATE privilege on at least one column of each locked table, so a SELECT-only bootstrap cannot implement this proposal. The bootstrap flag UPDATE privileges above are genuine write capability, **not** lock-only grants; manifest-bound insert-only behavior is enforced by the trusted offline workflow/review, not by column ACLs. Maintenance can technically change its allowed flags/names without a version/audit; its approved workflow must prohibit that. If security rejects this direct-SQL trust boundary, keep these writers disabled and review a separately authorized restricted procedure/interface; no SECURITY DEFINER function, trigger or RLS is silently selected. Source: [PostgreSQL 17 SELECT permissions](https://www.postgresql.org/docs/17/sql-select.html).

The future bootstrap is insert-only at the workflow level: fail on unrecognized existing state, verify unchanged known fixture rows without overwriting, and require a separate maintenance action to reactivate. Its manifest identifies target, actor, approved UUID/code/name/state, exact allowed org/district pairs, proposal revision and audit evidence; never form a Cartesian product of all fixture parents. Defaults active=true/ACTIVE are storage defaults, not authority. Use only synthetic aliases; no credentials, household locations, victim records or live dumps.

Inspect effective permissions as well as direct ACLs: PUBLIC/default privileges, inherited memberships, SET ROLE reachability, schema CREATE, ownership transfer, grant options, functions/search_path and role administration attributes (no superuser/BYPASSRLS/CREATEROLE in non-owner application roles). Shared schema USAGE alone does not give table access. Test denied ownership/ALTER/DROP/GRANT paths under non-owner roles and expected owner abilities separately; do not claim the owner/superuser is constrained by ordinary DML revocation. No database configuration, privileges or role identities are inspected now. Source: [PostgreSQL 17 privileges](https://www.postgresql.org/docs/17/ddl-priv.html).

## Proposed identity and lifecycle rules

| Attribute / action | Proposed rule | Enforced by |
|---|---|---|
| Parent UUIDs; bridge pair; all created_at values | Immutable after insert; retain same identity across retirement/reactivation | Future service/offline manifest and absence of corresponding UPDATE grants; PK/FK alone do not guarantee immutability |
| District/organization code | Immutable, reserved across inactive history; cosmetic name correction does not change code | Future workflow plus no code UPDATE permission; UQ prevents simultaneous duplicate code, not delete/reuse |
| Name edits | Approved localized label correction only, same UUID/code; parent version/time and audit in same transaction | Name/length CHECKs plus future locked service/maintenance policy; no implicit historical identity replacement |
| Association history | Keep original pair/created_at; deactivate with active=false; never delete/reinsert to reset grants/history | Bridge PK, no DELETE/TRUNCATE/key UPDATE privileges and future audit; active boolean alone is not a full event history |
| Retirement | District active=false or organization INACTIVE; mappings retained; new eligible work denied | Future locking/rechecks/version/audit; no cross-table CHECK claims |
| Reactivation | Explicit approved same-row transition and reviewed affected-pair manifest; no automatic grant creation or fixture overwrite | Future locked policy and audit; constraints alone allow boolean/status changes |
| Deletion / replacement | No physical deletion in this proposal, even unreferenced rows; genuine new identity uses a new UUID and unused code through a separately approved manifest | Privilege/workflow boundary; RESTRICT only prevents deletion/key change of referenced parents, not unreferenced deletion or all child key edits |

A correction requiring a code change or historical relink is outside routine maintenance: product/security must review meaning, references and recovery first. No replacement/supersedes column, deletion job, code-reuse interval or retention duration is invented. Owner-level tampering remains outside the application guarantee.

## Migration safeguards, evidence and review handoff

Parents precede bridge; keep one explicitly reviewed additive transaction, all native checks/collations, FKs and index definitions. Freeze schema namespace, owner/ACL matrix, prior migration state, checksum and bounded lock/statement/transaction settings before an authorized rehearsal. Verify no object/name collision; do not assume the actual database is empty or convert its encoding/collation automatically. Inject a precommit failure and distinguish rolled-back DDL from migration bookkeeping requiring reviewed repair. Application rollback retains tables/acknowledged history; forward correction is reviewed, never reset/drop/down or a restore that silently discards later work.

Any later offline-generation authorization must name a pinned-version offline method. `migrate dev --create-only` still uses a shadow database and is not permission-free offline generation. Native CHECKs/collations require separately reviewed source SQL and preservation checks; schema-only diff omits guarantees it cannot model. No generation/application occurs in 03B.0. Source: [Prisma v7 CLI reference](https://www.prisma.io/docs/orm/v7/reference/prisma-cli-reference).

[test-cases.md](test-cases.md) contains the 16 planned Stage 1 subdivisions. Rollback-only stage-local constraint tests require a separately authorized disposable SQL target. Committed races, audited lifecycle and future-writer privilege tests require complete three-stage disposable dependencies and separate test/writer authorization. No interim operational data/bootstrap/endpoints or audit exemption. Current liveness/readiness/shutdown contracts stay unchanged; table presence is not domain readiness.

Open decisions are acceptance/deviation of W/B/name handling, code grammar/vocabulary/C collation, immutable-reference and reactivation semantics, district serialization/handover, actual effective roles/trusted offline access, exact target/budgets/native SQL and applicable delegation/design acceptance. This document resolves the review's missing specification, not those human decisions or execution evidence. No extra approval of unrelated C-11/FR-027/session behavior is inferred from these three tables. Final documentation readiness and actual validation results are recorded in [evidence.md](evidence.md); implementation remains BLOCKED.
