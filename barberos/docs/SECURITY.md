# Security, Privacy & Risk

> Engineering summary prepared for professional legal review. Not legal advice. No design can
> guarantee immunity from claims; the goal is demonstrable, documented good practice.

## 1. Applicable Israeli frameworks (to be confirmed by counsel)
| Area | Source | Engineering implication |
|---|---|---|
| Privacy | Privacy Protection Law 5741-1981, **Amendment 13 (in force 14 Aug 2025)** — expanded definitions, PPA enforcement powers and financial sanctions | Data minimization, purpose limitation, notice at collection, access/correction/deletion handling, security controls, documentation |
| Data security | Privacy Protection (Data Security) Regulations 5777-2017 | Database definition doc, security procedure, access control, access logging, backups, incident handling, periodic review |
| Transfer abroad | Privacy Protection (Transfer of Data to Databases Abroad) Regulations | Hosting/vendor regions (EU generally permitted); DPAs with Meta, Anthropic, hosting, email providers |
| Marketing messages | Communications Law (Telecommunications & Broadcasting), **section 30A** ("spam law") | Prior explicit opt-in for advertising via SMS/email/automated messages; "פרסומת" labeling; free opt-out in every message; statutory damages per message without proof of damage. Treat WhatsApp marketing as covered. |
| Consumer | Consumer Protection Law | Clear prices, cancellation/no-show terms disclosed before booking |
| Accessibility | See ACCESSIBILITY.md | — |

## 2. Data inventory & minimization
| Data | Purpose | Required? | Retention (proposal) |
|---|---|---|---|
| Phone (E.164) | Identity, booking, reminders | Yes | While customer active + 24 months inactivity → anonymize |
| First name | Personal service | Yes | Same |
| Last name, email | Optional | No | Same |
| Appointment history | Service, CRM, accounting | Yes | 7 years for financial records (verify), else anonymized |
| Staff notes | Service preferences | Optional; **no health data** (warn in UI; allergies only if customer volunteers, flagged sensitive) | Same as profile |
| WhatsApp message bodies | Conversation handling | Yes | 90 days, then redacted (metadata kept) |
| AI run logs | Quality, audit | Yes | 90 days full / summaries 12 months |
| Consent records | Legal evidence | Yes | Life of relationship + limitation period |
| Audit log | Accountability | Yes | 7 years |
Birthdate, gender, photos of customers: **not collected** unless a later feature justifies it.

## 3. Threat model (top items)
| Threat | Mitigation |
|---|---|
| Account takeover of owner dashboard | Passkeys/TOTP mandatory for owner/manager, session rotation, new-device alerts, rate limiting |
| Booking abuse (bots reserving slots) | Phone OTP before confirm, per-phone/IP rate limits, max active bookings per customer, hold expiry |
| Webhook spoofing / replay | Verify `X-Hub-Signature-256` with app secret, dedupe by message id, timestamp checks |
| Prompt injection via WhatsApp | Tools scoped to sender's own data, server-side confirmation state machine, no free-form SQL/HTTP tools, output filtering for other customers' PII |
| IDOR on appointments/links | Opaque IDs, signed expiring tokens, tenant + ownership checks in every service function |
| XSS / injection | React escaping, strict CSP with nonces, Zod validation, parameterized SQL only |
| Secrets leak | Env-only secrets, secret scanning in CI, encrypted OAuth tokens at rest (app-level key) |
| Data loss | Managed PITR backups, quarterly restore test, migration review |
| Vendor outage (Meta/LLM) | Queue + retry with backoff; graceful "a human will reply" fallback; website booking unaffected |

## 4. Controls
- **AuthN:** see ARCHITECTURE §7. **AuthZ:** RBAC permission map, enforced server-side, tested per role.
- **Audit log:** append-only; logs logins, permission changes, exports, customer data views of
  sensitive fields, booking mutations, consent changes, AI-initiated actions.
- **Transport/headers:** HTTPS only, HSTS, CSP, `frame-ancestors 'none'`, Referrer-Policy,
  Permissions-Policy. Cookies `Secure; HttpOnly; SameSite=Lax`.
- **Dependencies:** lockfile, Dependabot/Renovate, `pnpm audit` in CI, new deps evaluated
  (maintenance, downloads, license, transitive size) before adoption.
- **Privacy UX:** notice at collection (short Hebrew text + link), separate unticked marketing
  consent checkbox, consent center via signed link, opt-out keyword "הסר" on WhatsApp/SMS.
- **Data subject requests:** dashboard workflow for access/correction/deletion; deletion =
  anonymization where records must be kept.

## 5. Incident response (outline)
1. Detect (alerts, error tracking, reports) → 2. Triage severity → 3. Contain (rotate secrets,
disable integrations, revoke sessions) → 4. Assess personal-data impact → 5. Notify as required
(PPA reporting duties for severe security incidents under the Data Security Regulations — verify
current thresholds with counsel) → 6. Recover → 7. Post-mortem + doc update.
Owner contact tree and runbook to be completed in Phase 1.4.

## 6. Risk register
| # | Risk | Type | Likelihood | Impact | Mitigation |
|---|---|---|---|---|---|
| R1 | Accessibility lawsuit (statutory compensation without proof of damage) | Legal | Med | High | Build-in a11y, audits, statement, professional audit before launch, fast fix SLA |
| R2 | Spam-law claims from marketing messages | Legal | Med | High | Opt-in only, consent evidence, opt-out, "פרסומת" label, no marketing to imported lists without proven consent |
| R3 | Privacy enforcement (Amendment 13) | Legal | Low–Med | High | Minimization, documentation, security regs compliance, DPAs |
| R4 | Meta policy change / account restriction / template rejection | Vendor | Med | High | Business-specific bot scope, quality rating monitoring, SMS fallback, web booking primary |
| R5 | Meta Business verification delay | Schedule | Med | Med | Start verification during Phase 2 |
| R6 | LLM wrong answer (prices, hours, policy) | Technical | Med | Med | Answers grounded in tools only; eval suite; handoff |
| R7 | Double booking / stale holds | Technical | Low | High | Exclusion constraint, idempotency, hold expiry, concurrency tests |
| R8 | DST / holiday / Shabbat scheduling bugs | Technical | Med | Med | Timezone-explicit code, property tests, owner-approved holiday calendar |
| R9 | Missing premium photography | Business | High | High | Plan a shoot early; site design degrades gracefully with fewer images |
| R10 | Owner adoption of dashboard | Business | Med | Med | Mobile-first dashboard, onboarding session, minimal required actions |
| R11 | LLM / messaging cost overrun | Financial | Low–Med | Med | Budgets, caching, cheaper model for routing, per-number limits |
| R12 | Shared repository with unrelated project | Process | — | Low | ADR-001; move to dedicated repo |
