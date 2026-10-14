# Roadmap

Status legend: ☐ not started · ◐ in progress · ☑ done (verified). A phase starts only after the
previous phase's acceptance criteria are verified and the owner approves.

## Phase 0 — Discovery & architecture ◐
- ☑ Architecture, domain model, ADRs, risk register, Phase 1 plan drafted.
- ☐ Owner answers blocking questions (PRODUCT.md ★).
- ☐ Owner approves Phase 1 plan.
**Acceptance:** blocking questions answered or explicitly assumed; Phase 1 plan approved.

## Phase 1 — Brand, premium website, accessibility, core infrastructure ☐
### Milestones
**1.1 Foundation**
- Next.js (App Router) + TS strict (`noUncheckedIndexedAccess`), pnpm, ESLint (incl. jsx-a11y,
  module-boundary rules), Prettier, Vitest, Playwright + `@axe-core/playwright`.
- `lib/env.ts` (Zod), PII-redacting logger, security headers + CSP, `/api/health`.
- Docker compose (Postgres 16), Drizzle setup, first migration, seed script.
- GitHub Actions CI (path-filtered): lint → typecheck → unit → integration → build → e2e+axe.

**1.2 Brand identity & design system**
- Brand brief (moodboard, tone of voice in Hebrew, logo usage) → owner approval.
- Tokens: color (AA-verified pairs, light theme first; dark sections as brand accents),
  type scale, spacing, radius, motion (respects `prefers-reduced-motion`).
- Hebrew typography: display serif + body sans with full Hebrew glyph support, self-hosted,
  subset, `font-display: swap`. Candidates: Frank Ruhl Libre / David Libre (display),
  Assistant / Heebo / Rubik (body); premium licensed Hebrew faces if budget allows.
- Components: Button, Link, Header/Nav (mobile menu dialog), SkipLink, Footer, Section, Card,
  Image (with required alt), Dialog, Accordion (FAQ), Map embed with text alternative, Toast.

**1.3 Website (Hebrew, RTL, mobile-first)**
- Pages: Home · Services & prices · Team (barbers) · Gallery · About/Story · Contact & directions ·
  FAQ · Accessibility statement · Privacy policy · Terms · 404/500.
- Booking CTA on every page: until Phase 2, routes to WhatsApp click-to-chat / phone.
- Services, prices, staff, hours read from DB (seeded) — same source Phase 2 will use.
- SEO: metadata, Open Graph, `HairSalon` JSON-LD (schema.org), sitemap, robots, canonical URLs.
- Performance budget: LCP < 2.5 s (4G mobile), CLS < 0.1, JS < 150 KB gz on marketing pages.

**1.4 Core infrastructure for Phase 2**
- Schema: shops, locations, users, memberships, staff, services, staff_services,
  working_hours, schedule_exceptions, audit_log.
- Dashboard auth (ADR-011 decision), owner 2FA, RBAC permission map, audit writes.
- Minimal dashboard: edit business info, services/prices, staff, opening hours.
- Error tracking (EU-hosted, PII scrubbing), uptime check, daily backups verified by restore test.

**1.5 Accessibility & legal deliverables**
- Automated: axe on every route in CI (desktop + mobile viewport), eslint-plugin-jsx-a11y.
- Manual audit: keyboard-only, NVDA+Firefox/Chrome, VoiceOver iOS Safari, TalkBack, 200%/400%
  zoom, text-spacing, Windows high contrast — per ACCESSIBILITY.md checklist.
- Accessibility statement (Hebrew), privacy policy & terms drafts for lawyer review.
- Cookie/analytics: privacy-friendly analytics without consent-requiring cookies, or consent banner.

### Phase 1 acceptance criteria
1. All pages complete in Hebrew, RTL, owner-approved copy and imagery.
2. CI green: lint, typecheck, unit, integration, build, e2e; **0 axe violations** on all routes.
3. Manual accessibility audit completed and documented; blocking findings fixed.
4. Lighthouse mobile: Performance ≥ 90, Accessibility = 100, Best Practices ≥ 95, SEO ≥ 95.
5. Owner can log in with 2FA and edit services/prices/hours; changes appear on the site; audit logged.
6. Security headers (CSP, HSTS, etc.) verified; no secrets in repo; backups restore-tested.
7. Accessibility statement, privacy policy, terms drafted and sent for professional review.

## Phase 2 — Booking engine & owner dashboard ☐
Availability engine; web booking (service → barber/any → slot → details → OTP → confirm);
holds, idempotency, exclusion constraint; cancel/reschedule via signed links; reminders
(WhatsApp utility template / SMS fallback); waitlist + offers; dashboard calendar (day/week,
per barber, drag-to-reschedule with optimistic concurrency), walk-ins, no-shows, blocks;
Google Calendar push + ICS. **Acceptance:** concurrency tests (parallel booking attempts) prove
zero double bookings; DST/holiday tests; e2e + axe on booking flow; owner pilot week.

## Phase 3 — WhatsApp AI receptionist ☐
Meta Business verification, Cloud API number, templates approved; webhook pipeline; tool
registry; conversation state machine; human handoff inbox in dashboard; Hebrew eval suite;
cost/rate limits. **Acceptance:** eval pass-rate threshold agreed with owner; 0 bookings created
without explicit confirmation in tests; handoff works end-to-end; 2-week supervised pilot.

## Phase 4 — CRM, analytics, marketing ☐
Customer profiles & history, visit-frequency/churn signals, retention workflows
("time for your next cut"), consent center & opt-out, segments, campaigns with analytics,
dashboards (revenue, utilization, no-shows, cohorts). **Acceptance:** no marketing send possible
without recorded consent (tested); opt-out effective immediately; KPIs reconcile with raw data.

## Phase 5 — Advanced AI & expansion ☐
Demand forecasting, smart gap-filling, personalized rebooking timing, review requests,
multi-location, multi-shop (RLS), additional languages.
