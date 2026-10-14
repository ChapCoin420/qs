# Changelog

## 2026-10-14 — Phase 1 build started (website + foundation)

- Owner instruction: build on own judgment at the highest level. Phase 1 started on documented
  assumptions (VERIFY flags in seed data and copy).
- App scaffold: Next.js 16 (App Router, Turbopack), React 19, TypeScript strict, Tailwind 4,
  Drizzle ORM + node-postgres, Zod, self-hosted Hebrew fonts. ESLint (next + jsx-a11y strict +
  module-boundary rule), Prettier, Vitest, Playwright + axe.
- Database: schema + migrations for shops, locations, location_hours, staff, working_hours,
  schedule_exceptions, services, staff_services, audit_log; append-only audit trigger;
  updated_at triggers; idempotent seed for Wein's Barbershop.
- Website (Hebrew, RTL, mobile-first): home, services & prices (+FAQ), story & team, visit,
  accessibility statement (draft), privacy policy (draft), 404, sitemap, robots, HairSalon JSON-LD,
  security headers + CSP, /api/health. Booking CTA links to the shop's current Calmark page.
- Tests: 23 unit/integration (Vitest) and 30 e2e (Playwright, mobile + desktop; 2 viewport-specific
  tests skipped per project) — all passing locally; axe reports 0 violations on every route.
  Lighthouse mobile (local): Perf 95, A11y 100, BP 100, SEO 100; LCP 2.7 s.
- CI: `.github/workflows/barberos.yml` (not yet run on GitHub).

## 2026-10-14 — Brand brief draft

- Added `docs/BRAND_BRIEF.md` (v0.1) from 2 owner photos + research: concept "Mediterranean craft
  noir", palette with computed contrast ratios, Hebrew typography, voice, home-page structure.
- 5 HEIC uploads were empty iOS placeholders (135 bytes) — not readable; re-send requested.
- Photos not committed (identifiable people; rights/consent pending).

## 2026-10-14 — Business research

- Added `docs/BUSINESS_PROFILE.md`: public-web research on Wein's Barbershop (identity, story,
  services, reputation, conflicts, design/booking implications). Search results only; pages and
  photos not viewable (network policy). All facts pending owner confirmation.

## 2026-10-14 — Phase 0 draft

- Created project memory: `CLAUDE.md`, PRODUCT, ARCHITECTURE (incl. domain model), DECISIONS
  (ADR-001…011), ROADMAP (phases + Phase 1 plan with acceptance criteria), SECURITY (privacy,
  threat model, risk register), ACCESSIBILITY (IS 5568 / WCAG 2.2 AA plan), INTEGRATIONS.
- No application code. Awaiting owner answers (PRODUCT.md ★) and Phase 1 approval.
- Placed in `barberos/` because the repository root holds an unrelated QS project (ADR-001).
