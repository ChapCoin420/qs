# Accessibility

> Prepared for review by a certified accessibility consultant (מורשה/יועץ נגישות) and counsel.
> Conformance to WCAG does not by itself establish Israeli legal compliance.

## 1. Legal & standards landscape (verify current versions before launch)

- **Equal Rights for Persons with Disabilities Law, 5758-1998** and the
  **Equal Rights for Persons with Disabilities (Service Accessibility Adjustments) Regulations,
  5773-2013**, regulation 35 — internet services must meet **Israeli Standard SI 5568**.
- **SI 5568 Part 1** adopts WCAG with Israeli modifications at level **AA**. Historically based on
  **WCAG 2.0**; the standards institute replaced the 2021 edition with an edition published
  28 Sep 2023 (gazetted 22 Oct 2023). Sources disagree on whether it now references WCAG 2.0 or
  2.1 — **must be confirmed against the official SII text**. SI 5568 Part 2 covers digital documents (PDFs).
- Statutory compensation for violations can be awarded without proof of damage — amount and
  exemptions for small businesses to be confirmed by counsel.
- Regulations require an **accessibility statement** (הצהרת נגישות) including: adjustments made,
  known limitations, accessibility coordinator contact details, and date of last update; and
  information about **physical** accessibility of the premises.

**Our engineering target:** WCAG **2.2 AA** (superset of 2.0/2.1 AA) + SI 5568 Israeli deviations +
Hebrew/RTL specifics. If the official text adds requirements, they are added here.

## 2. Design & build rules

- Semantic HTML first; ARIA only when no native element exists. `lang="he" dir="rtl"`; English
  fragments wrapped with `lang="en" dir="ltr"`/`<bdi>`.
- Landmarks on every page; one `h1`; logical heading order; skip link to main content.
- Visible focus indicator ≥ 2 px, AA contrast, never removed; focus not obscured by sticky header (2.4.11).
- Color contrast: text 4.5:1, large text 3:1, UI/graphics 3:1 — verified for every token pair.
- Target size ≥ 24×24 CSS px (2.5.8); primary actions ≥ 44×44.
- No information by color alone; no auto-playing media with sound; carousels pausable or avoided.
- Motion: honor `prefers-reduced-motion`; no parallax essential to content.
- Reflow at 320 CSS px; text resizes to 200% without loss; text-spacing override safe.
- Forms: visible labels, programmatic errors (`aria-describedby`), error summary, Hebrew messages,
  `autocomplete` attributes, no CAPTCHA puzzles (accessible authentication 3.3.8 — OTP via paste/autofill).
- Booking time picker: keyboard operable, announced in Hebrew, alternative list view.
- Dialogs: focus trap, Escape closes, focus returns; no time limits without extension (holds show
  remaining time accessibly and can be extended).
- Images: meaningful alt in Hebrew; gallery has captions; decorative images `alt=""`.
- Maps: text address + directions + accessible link; map iframe has title.
- Consistent help (3.2.6): contact (phone/WhatsApp) in the same place on every page.
- Redundant entry (3.3.7): returning customers' details prefilled.
- No accessibility overlay widgets (ADR-008).

## 3. Automated testing

- `eslint-plugin-jsx-a11y` (CI blocking).
- Playwright + `@axe-core/playwright` on every route and key states (menu open, dialog open,
  form errors, booking steps), mobile + desktop viewports — 0 violations required.
- Component tests assert roles/names (Testing Library `getByRole`).
- Contrast check script for design tokens.

## 4. Manual audit procedure (each release with UI change; full audit before launch)

1. Keyboard only: every interactive element reachable, order logical in RTL, no traps.
2. Screen readers: NVDA + Chrome/Firefox (Windows), VoiceOver + Safari (iOS), TalkBack + Chrome (Android) — Hebrew voices.
3. Zoom 200% and 400%; 320 px reflow; text-spacing bookmarklet.
4. Windows contrast themes / forced colors.
5. Voice control (Voice Control iOS / Voice Access) on booking flow.
6. Cognitive: plain Hebrew, consistent navigation, clear errors.
7. Record findings: criterion, severity, page, fix, retest date.

## 5. Deliverables

- Hebrew accessibility statement page (template drafted in Phase 1; filled with coordinator details).
- Audit report per release; issue tracker labels `a11y-blocker` / `a11y`.
- Accessible alternative channels: phone and WhatsApp for anyone unable to use the site.
