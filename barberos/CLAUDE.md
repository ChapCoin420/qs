# BarberOS — Project Context

Persistent context for Claude Code sessions. Read this first, then the docs below.

## What this is

Client: **Wein's Barbershop**, Bat Chen 64, Haifa.
BarberOS: a premium, Hebrew-first, RTL-native digital platform for one Israeli
barbershop (luxury website, booking engine, owner dashboard, WhatsApp AI
receptionist, CRM, marketing, analytics). Single tenant now; multi-tenant /
multi-location later without a rewrite.

> Location note: this project currently lives in `barberos/` inside a repository
> that also holds an unrelated quantity-surveying project (repo root). Do not touch
> files outside `barberos/`. Moving to a dedicated repository is recommended
> (see `docs/DECISIONS.md` ADR-001).

## Current status

- Phase 0 closed; **Phase 1 in progress** (owner said: build on your own judgment, highest level).
- Public website built; owner dashboard/auth not started. Status table in `docs/ROADMAP.md`.
- Facts awaiting owner confirmation are marked `VERIFY` in `src/db/seed-data.ts` / `src/content/site.ts`.

## Documentation map

| File                       | Purpose                                                                    |
| -------------------------- | -------------------------------------------------------------------------- |
| `docs/BUSINESS_PROFILE.md` | Researched facts about Wein's Barbershop (unverified until owner confirms) |
| `docs/BRAND_BRIEF.md`      | Draft brand concept, palette, typography, voice, home-page structure       |
| `docs/PRODUCT.md`          | Vision, users, scope, open business questions, assumptions                 |
| `docs/ARCHITECTURE.md`     | System design, modules, domain model, booking & AI design                  |
| `docs/DECISIONS.md`        | Architecture Decision Records (ADRs)                                       |
| `docs/ROADMAP.md`          | Phases, milestones, acceptance criteria, Phase 1 plan                      |
| `docs/SECURITY.md`         | Threat model, privacy (Israel), auth, audit, retention, incidents          |
| `docs/ACCESSIBILITY.md`    | WCAG 2.2 AA target, IS 5568, statement, test procedures                    |
| `docs/INTEGRATIONS.md`     | WhatsApp Cloud API, LLM, calendar, maps, payments, email                   |
| `docs/CHANGELOG.md`        | Changes per session                                                        |

## Stack (decided, see ADRs)

Next.js (App Router) · TypeScript strict · PostgreSQL · Drizzle ORM (SQL migrations) ·
Tailwind CSS (logical properties only) · React Aria Components for accessible primitives ·
pg-boss for background jobs (Postgres-backed, no Redis) · Zod at every boundary ·
Vitest + Playwright + axe-core · pnpm.

## Non-negotiable rules

1. **Database is the booking source of truth.** Double-booking prevention is enforced by
   a Postgres exclusion constraint, never only by application code.
2. **The LLM never mutates data and never invents slots.** It calls typed server tools;
   slot IDs are server-signed opaque tokens; confirmations require explicit customer yes.
3. **All customer-facing text is Hebrew.** Code, comments, docs, commits: English.
4. **RTL-native:** use logical CSS (`ms-`, `pe-`, `start`, `end`); never `left/right` for layout.
5. **Accessibility is built in, not bolted on.** No accessibility overlay widgets.
   Every page passes axe in CI; keyboard + screen reader paths are tested.
6. **Every business table carries `shop_id`.** Queries are scoped through the tenant context.
7. **Money in agorot (integer).** Time stored as `timestamptz` (UTC); business logic in
   `Asia/Jerusalem` via explicit conversion.
8. **Privacy:** collect the minimum; marketing requires recorded opt-in consent;
   PII never in logs; every privileged action writes to `audit_log`.
9. **Modular monolith:** modules talk through their `index.ts` public API only.
   No cross-module table access.
10. Never claim tests/lint/build passed unless they were run in this session.

## Working protocol (each session)

1. Read this file, `docs/ROADMAP.md`, and the latest `docs/CHANGELOG.md` entry.
2. Inspect affected modules; write a short plan.
3. One milestone at a time; add tests with the change.
4. Run: `pnpm lint && pnpm typecheck && pnpm test && pnpm build` (+ `pnpm test:e2e` when UI changes).
5. Update CHANGELOG, ROADMAP status, and ADRs when a decision changes.
6. Report risks and unfinished work honestly.

## Commands

Run from `barberos/` (Node ≥ 22.12, pnpm 10, Postgres 16 with `DATABASE_URL` in `.env`):

```
pnpm install
pnpm db:migrate && pnpm db:seed        # schema + Wein's seed data (idempotent)
pnpm dev                                # http://localhost:3000
pnpm lint --max-warnings=0 && pnpm typecheck && pnpm format:check
TEST_DATABASE_URL=postgres://…/barberos_test pnpm test   # unit + integration (drops that DB's schema!)
pnpm build && pnpm test:e2e             # e2e + axe; set PLAYWRIGHT_CHROMIUM_PATH in the cloud sandbox
pnpm db:generate --name <change>        # new migration after schema edits; review the SQL
```

The build reads the database (pages are ISR, revalidate 5 min), so migrate + seed before building.
