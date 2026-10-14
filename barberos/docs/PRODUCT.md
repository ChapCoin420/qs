# Product

**Client:** Wein's Barbershop, בת חן 64, חיפה (owner: Baruch Wein — to confirm).
Research summary: `docs/BUSINESS_PROFILE.md`.

## Vision
The most refined digital experience of any barbershop in Israel: a website that
feels like a luxury brand, booking that takes under 30 seconds, a WhatsApp
receptionist that answers in natural Hebrew at 2 a.m. with *real* availability,
and an owner who understands their business from one dashboard.

## Users
| Persona | Needs | Channel |
|---|---|---|
| **Customer (new)** | Trust, see work quality, prices, book fast | Mobile web, Instagram → web, WhatsApp |
| **Customer (regular)** | Rebook same barber/service in 2 taps, reminders, reschedule | WhatsApp, web |
| **Customer with disability** | Full use with screen reader / keyboard / zoom / voice control; physical access info | Web, WhatsApp, phone |
| **Barber** | See own day, block time, customer notes | Mobile dashboard |
| **Owner / manager** | Schedule, staff, services, prices, customers, revenue, utilization, campaigns, take over AI chats | Desktop + mobile dashboard |

## Scope by phase (summary — detail in ROADMAP.md)
1. Brand identity, premium website, accessibility, core infrastructure.
2. Booking engine (web), owner dashboard, reminders, waitlist.
3. WhatsApp AI receptionist with human handoff.
4. CRM, analytics, marketing automation with consent.
5. AI optimization (demand forecasting, smart fill, dynamic suggestions), multi-location.

## Out of scope (until explicitly requested)
POS / inventory, payroll, product e-commerce, native mobile apps, tax invoicing.

## Success metrics (proposed, confirm with owner)
- Online share of bookings ≥ 70% within 3 months of Phase 2.
- Median web booking time < 45 s on mobile.
- No-show rate reduced vs. baseline (baseline to be measured).
- Chair utilization visible daily; target set by owner.
- Lighthouse (mobile) Performance ≥ 90, Accessibility 100; zero axe violations.
- Zero double bookings (enforced by DB; monitored).

## Open business questions (blocking items marked ★)
### Identity & brand
1. ★ Shop name, legal entity (עוסק מורשה / חברה בע״מ, ID number), address, phone.
2. Existing logo / brand assets? Desired mood (references you love, colors you hate).
3. ★ Professional photography: existing photos (with rights), or plan a shoot? Video?
4. Domain name owned? Instagram / TikTok / Google Business Profile links.
### Operations
5. ★ Number of barbers; each with own schedule? Number of chairs.
6. ★ Service list: name, duration, price; differences per barber (e.g. senior price).
7. ★ Opening hours; Friday/Shabbat/holiday policy (closed on Shabbat? holiday eves?).
8. Walk-ins accepted? Breaks/buffers between appointments?
### Booking policy
9. ★ How far ahead can customers book? Minimum notice? Cancellation window?
10. No-show policy: deposits or card-on-file wanted? (affects payments provider choice)
11. Who may book: anyone, or only verified phone numbers? Max active bookings per customer?
### Current systems & data
12. ★ Current booking tool (if any) and customer list — do customers consent to marketing today?
    Can we export history? (Migration and consent status matter legally.)
13. ★ The WhatsApp number to use: currently on the WhatsApp Business *app*? (Moving to the
    Cloud API changes how the owner uses WhatsApp on their phone.) Meta Business Manager exists?
14. Google Calendar in use by barbers?
### Accessibility & legal
15. ★ Name/contact of the accessibility coordinator (רכז/ת נגישות) for the statement.
16. Physical accessibility of the shop (step-free entry, accessible restroom, parking).
17. Existing lawyer for privacy policy / terms review?
### Budget & hosting
18. Monthly budget ceiling for hosting + WhatsApp conversations + AI usage.
19. Preference for data residency (Israel region vs. EU)? Default proposal: AWS Tel Aviv
    (`il-central-1`) or an EU region.
### Repository
20. ★ Move BarberOS to its own repository (recommended) or keep it in `barberos/` here?

## Working assumptions (until answered)
- One location, 3–5 barbers, each with individual schedule and per-barber service pricing possible.
- Closed Shabbat; Friday short day; Jewish holidays closed (configurable per date).
- Booking up to 30 days ahead, minimum notice 60 min, free cancellation until 3 h before.
- No payments/deposits in Phases 1–3; architecture leaves a payments adapter slot.
- Hebrew only (customer-facing). English/Arabic/Russian possible later via i18n layer.
- Customer identity = mobile phone number (E.164), verified via OTP or WhatsApp.
