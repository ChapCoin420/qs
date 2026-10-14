# Architecture Decision Records

Format: context → decision → consequences. Status: Proposed / Accepted / Superseded.

## ADR-001 Project location — Proposed

**Context:** The provided repository (`qs`) contains an unrelated quantity-surveying project
with its own agent manual. A root-level `CLAUDE.md` would contaminate that project's context.
**Decision:** Keep BarberOS isolated in `barberos/` with its own `CLAUDE.md` until the owner
decides. Recommended: move to a dedicated repository before Phase 1 code lands.
**Consequences:** CI workflows must be path-filtered to `barberos/**` if it stays here.
Implemented: `.github/workflows/barberos.yml` at the repo root is the only file outside `barberos/`.

## ADR-002 Modular monolith on Next.js — Accepted

**Context:** One shop, small team, need for speed and reliability; expansion later.
**Decision:** Single Next.js app + one worker process from the same codebase; modules with
explicit public APIs and lint-enforced boundaries.
**Consequences:** Simple deploys and transactions; must guard boundaries with tooling.

## ADR-003 Drizzle over Prisma — Accepted

**Context:** Booking correctness relies on Postgres-specific features: `tstzrange`,
`btree_gist` exclusion constraints, partial indexes, `SELECT … FOR UPDATE SKIP LOCKED`.
**Decision:** Drizzle ORM with SQL-first migrations (generated, then hand-reviewed; custom SQL
for constraints).
**Consequences:** Type-safe queries close to SQL; no heavy engine binary; team must be
comfortable reading SQL migrations.

## ADR-004 Double-booking prevention in the database — Accepted

**Decision:** `EXCLUDE USING gist (staff_id WITH =, period WITH &&) WHERE status IN ('held','confirmed')`
plus idempotency keys. Application checks are UX only.
**Consequences:** Concurrency safety independent of code paths (web, WhatsApp, dashboard).

## ADR-005 pg-boss for background jobs — Accepted

**Context:** Need reminders, retries, scheduled jobs, AI turns. Want no extra infrastructure.
**Decision:** pg-boss on the same Postgres; worker as separate process.
**Consequences:** Transactional enqueue with business writes; revisit only if throughput demands.

## ADR-006 React Aria Components for interactive primitives — Proposed (deferred to Phase 2)

Phase 1 needs only a disclosure menu and FAQ (`<details>`), built natively without a dependency.
Adopt when the booking date/time picker is built.

**Context:** Need robust keyboard/screen-reader behavior, RTL, and full visual control.
**Decision:** React Aria Components (unstyled, RTL-aware, i18n-aware) styled with Tailwind.
Alternative considered: Radix UI (good, weaker built-in RTL/locale handling for date pickers).
**Consequences:** Accessible date/time pickers for booking with Hebrew locale out of the box.

## ADR-007 LLM is a planner, never a writer — Accepted

**Decision:** The assistant can only call typed, validated server tools; slots are server-signed
tokens; mutations need a server-tracked explicit confirmation.
**Consequences:** Hallucinated slots/bookings are structurally impossible; more engineering in tools.

## ADR-008 No accessibility overlay widgets — Accepted

**Context:** Overlays do not make a site conform and are widely criticized by disabled users.
**Decision:** Accessibility implemented in components and content; accessibility statement page
and contact channel instead.

## ADR-009 Tenant column from day one — Accepted

**Decision:** `shop_id` on all business tables, `locations` table from day one.
**Consequences:** Small upfront cost; multi-location/multi-shop expansion without schema rewrite.

## ADR-010 Site content in typed code files (no CMS yet) — Proposed

**Decision:** Hebrew copy in `src/content/*.ts`; services/prices/staff from DB (editable in dashboard).
Revisit a headless CMS if the owner needs to edit marketing pages frequently.

## ADR-011 Auth library — Open

Candidates: Better Auth (passkeys, 2FA, phone OTP plugins, organization model) vs Auth.js.
Decide at Phase 1 milestone 1.4 after a dependency evaluation (maintenance, security record, size).

## ADR-012 Static CSP without nonces for public pages — Accepted

**Context:** Marketing pages are statically generated (ISR) for speed; nonces require per-request
rendering. Next.js injects inline bootstrap scripts.
**Decision:** Header CSP with `script-src 'self' 'unsafe-inline'`, everything else locked down
(`default-src 'self'`, `frame-ancestors 'none'`, `object-src 'none'`, no third-party origins).
The site renders no user-generated HTML. Authenticated dashboard routes will use a nonce CSP.
**Consequences:** Weaker XSS defense-in-depth on public pages; acceptable given no untrusted input.

## ADR-013 Self-hosted fonts via Fontsource — Accepted

**Context:** No third-party requests (privacy, CSP, speed); Google Fonts fetch at build is not
reliable in all build environments.
**Decision:** `@fontsource-variable/frank-ruhl-libre` (display) and `@fontsource-variable/assistant`
(body), bundled and served from our origin; `unicode-range` subsets load only Hebrew/Latin as needed.

## ADR-014 Public pages read the database with ISR — Accepted

**Context:** Services, prices, staff and hours must have one source of truth for website,
booking and WhatsApp.
**Decision:** Pages query the catalog/shop modules and revalidate every 5 minutes. Build and CI
need a migrated, seeded database.
**Consequences:** Owner edits appear within minutes without redeploy; the DB is a build dependency.
