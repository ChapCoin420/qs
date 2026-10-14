# Architecture

## 1. Shape: modular monolith
One Next.js application + one background worker process, sharing one codebase and
one PostgreSQL database. No microservices. Modules have explicit public APIs.

```
                ┌──────────────────────── Next.js app (web) ────────────────────────┐
 Browser ──────▶│ (site) public pages   (book) booking flow   (dashboard) owner/staff │
                │ Route handlers: /api/webhooks/whatsapp, /api/calendar/*, /api/ics │
                │ Server Actions ──▶ module services (domain logic, Zod-validated)   │
                └───────────────┬───────────────────────────────────┬───────────────┘
                                │ Drizzle (SQL)                     │ enqueue
                          ┌─────▼─────┐                       ┌─────▼─────┐
                          │ PostgreSQL │◀──── pg-boss queue ───│  Worker   │
                          │ (source of │                       │ (Node)    │
                          │   truth)   │                       └─────┬─────┘
                          └────────────┘                             │
                                         WhatsApp Cloud API · Claude API · Google Calendar · Email
```

- **Web** handles HTTP only; anything slow, retried, or scheduled goes to the **worker**
  (reminders, waitlist offers, AI conversation turns, calendar sync, campaigns, retention purge).
- WhatsApp webhooks are acknowledged immediately (store + enqueue), processed by the worker.

## 2. Repository layout (Phase 1 target)
```
barberos/
  src/
    app/
      (site)/            # public Hebrew website (RSC, mostly static)
      (book)/            # booking flow (Phase 2)
      (dashboard)/       # owner/staff dashboard (auth required)
      api/               # route handlers: webhooks, health, ics
    modules/
      shop/              # tenant, locations, settings, business info
      catalog/           # services, staff-services, pricing
      staff/             # barbers, working hours, exceptions
      scheduling/        # availability engine, booking, holds, reschedule, cancel
      waitlist/
      customers/         # profiles, consents, privacy requests
      messaging/         # WhatsApp channel, templates, conversations, outbound
      assistant/         # LLM orchestration + tool registry (calls other modules' APIs)
      marketing/         # segments, campaigns, opt-out
      analytics/         # read models, KPIs
      identity/          # auth, sessions, roles, permissions
      audit/             # append-only audit log
      integrations/      # adapters: calendar, email, maps, payments (ports & adapters)
    db/
      schema/            # Drizzle schema per module
      migrations/        # SQL migrations (incl. exclusion constraints)
    jobs/                # pg-boss job definitions + worker entry
    ui/                  # design system: tokens, components (React Aria based)
    lib/                 # env (Zod), logger (PII-redacting), time (Asia/Jerusalem), money
    content/             # Hebrew site copy (typed), until a CMS is justified
  tests/ (unit, integration w/ real Postgres, e2e + axe)
  docs/
```
**Module rule:** `modules/x/index.ts` is the only import surface. Each module owns its
tables; other modules call its functions, never its tables. Enforced by ESLint
`no-restricted-imports` boundaries.

## 3. Cross-cutting
| Concern | Approach |
|---|---|
| Tenancy | `shop_id` on every business row; `TenantContext` resolved per request; all repository functions require it. Postgres RLS considered for Phase 5 multi-tenant. |
| Time | `timestamptz` UTC storage; working hours stored as local `time` + weekday; conversion via `Temporal` polyfill or `date-fns-tz`, always `Asia/Jerusalem`. DST transitions covered by tests. |
| Holidays | Israeli/Jewish holiday dates imported into `schedule_exceptions` (generated from a holiday dataset, owner-approved per year, never auto-closing silently). |
| Money | integer agorot; prices snapshotted on appointments. VAT display rule: consumer prices shown VAT-inclusive. |
| Validation | Zod schemas at every boundary (forms, server actions, webhooks, LLM tool inputs). |
| Errors | Typed `Result`/domain errors in services; no thrown strings; user messages in Hebrew mapped at the edge. |
| Logging | Structured JSON; PII redaction (phone, names, message bodies) by default; correlation IDs. |
| Config | `lib/env.ts` validates env at boot; secrets only from env/secret manager. |
| i18n | Hebrew only now, but all customer strings live in `content/` dictionaries (no hard-coded copy in components) so locales can be added. `<html lang="he" dir="rtl">`. |

## 4. Domain model (v1)
All tables: `id uuid pk`, `shop_id uuid fk` (except `shops`, `users`), `created_at`, `updated_at`.

**Tenant & identity**
- `shops` — name, slug, timezone (`Asia/Jerusalem`), legal_name, business_id, settings jsonb (booking policy).
- `locations` — shop_id, name, address, geo, phone, accessibility_info (one row initially).
- `users` — dashboard accounts: email, name, phone, status. Credentials in auth library tables (passkeys, TOTP).
- `memberships` — user_id, shop_id, role: `owner | manager | barber | receptionist`.

**Catalog & staff**
- `staff` — location_id, user_id (nullable), display_name, bio_he, photo, is_bookable, sort_order, active.
- `services` — name_he, description_he, category, duration_min, price_agorot, buffer_before_min, buffer_after_min, is_online_bookable, active, sort_order.
- `staff_services` — staff_id, service_id, duration_override_min, price_override_agorot.
- `working_hours` — staff_id, weekday (0–6), start_local time, end_local time, valid_from, valid_to. Multiple rows per day allowed (split shifts).
- `schedule_exceptions` — staff_id (null = whole shop), period tstzrange, kind `closed | time_off | extra_hours`, reason.

**Customers & consent**
- `customers` — phone_e164 (unique per shop), first_name, last_name (optional), email (optional), preferred_staff_id, staff_notes, phone_verified_at, source, last_visit_at, visit_count (denormalized), deleted_at, anonymized_at.
- `consents` — customer_id, channel `whatsapp | sms | email`, purpose `marketing | service_reminders`, status `granted | withdrawn`, wording_version, source `web | whatsapp | dashboard | import`, evidence jsonb, recorded_at. **Append-only**; current state = latest row.
- `privacy_requests` — customer_id, kind `access | correction | deletion`, status, due_at, handled_by.

**Scheduling**
- `appointments` — location_id, staff_id, customer_id, `period tstzrange`, status `held | confirmed | completed | cancelled | no_show`, hold_expires_at, source `web | whatsapp | dashboard | walk_in`, total_price_agorot (snapshot), customer_note, cancelled_at, cancel_reason, cancelled_by, rescheduled_from_id, version int, created_by_actor.
  - **Constraint:** `EXCLUDE USING gist (staff_id WITH =, period WITH &&) WHERE (status IN ('held','confirmed'))` (requires `btree_gist`). This is the double-booking guarantee.
- `appointment_items` — appointment_id, service_id, duration_min, price_agorot (snapshot), sequence. (Multi-service bookings without schema change.)
- `idempotency_keys` — key, scope, request_hash, response jsonb, expires_at.
- `waitlist_entries` — customer_id, service_id, staff_id (nullable = any), earliest_date, latest_date, time_windows jsonb, status `active | offered | fulfilled | expired | cancelled`, priority.
- `waitlist_offers` — entry_id, appointment_id (the hold), sent_at, expires_at, outcome.
- `calendar_links` — staff_id, provider, encrypted credentials, sync state; `calendar_event_map` — appointment_id ↔ external_event_id.

**Messaging & AI**
- `conversations` — channel `whatsapp`, customer_id, wa_id, mode `bot | human | closed`, assigned_user_id, last_inbound_at (24 h window), handoff_reason.
- `messages` — conversation_id, direction, provider_message_id (unique, idempotency), kind, body (retention-limited), template_name, delivery_status, sent_at.
- `message_templates` — name, language `he`, category `utility | marketing | authentication`, provider_status.
- `assistant_runs` — conversation_id, model, prompt_version, input/output token counts, latency, outcome; `assistant_tool_calls` — run_id, tool, validated_input, result_summary, error.

**Marketing & analytics**
- `segments` — name, definition jsonb (declarative filter, compiled to SQL server-side).
- `campaigns` — segment_id, channel, template_id, scheduled_at, status; `campaign_recipients` — customer_id, consent_snapshot_id, status, sent/delivered/read/clicked/booked_at.
- Analytics: SQL views / materialized views (`daily_utilization`, `revenue_by_service`, `retention_cohorts`) refreshed by jobs. No separate warehouse.

**Governance**
- `audit_log` — actor_type `user | customer | system | assistant`, actor_id, action, entity, entity_id, before/after jsonb (PII-minimized), ip_hash, at. Append-only (DB role lacks UPDATE/DELETE).

## 5. Booking engine
**Availability** (pure function, heavily unit-tested):
`slots = (working_hours ∪ extra_hours) − closed/time_off − busy(held+confirmed, incl. buffers) − policy(min notice, max horizon)`, stepped by slot granularity (default 15 min), fitted to the service duration for that staff member.

**Booking flow (atomic):**
1. Client requests a slot with an `Idempotency-Key`.
2. One transaction: delete expired holds overlapping the target; insert appointment (`held` for multi-step flows, or `confirmed` directly); insert items; write audit.
3. Exclusion-constraint violation ⇒ `SLOT_TAKEN` → UI shows fresh alternatives. No retries that could double-book.
4. Holds expire after N minutes (default 7); a sweeper job cancels them; availability queries ignore expired holds anyway.

**Reschedule** = single transaction: insert new (confirmed) + cancel old, linked by `rescheduled_from_id`; constraint protects the new slot.
**Cancellation** emits `appointment.cancelled` → waitlist matcher job.
**Optimistic concurrency** on dashboard edits via `version` column.

**Waitlist:** on freed capacity, the matcher ranks entries (fit, priority, waiting time), creates a short hold for the top candidate, sends an offer (WhatsApp utility template / web link). First confirmation wins through the same atomic path; unanswered offers expire and cascade to the next candidate.

**Calendar adapters:** port `CalendarProvider { pushEvent, updateEvent, deleteEvent, listBusy }`. v1: Google Calendar one-way push + private ICS feed per barber. Two-way busy import later; external busy blocks become `schedule_exceptions`, never appointments.

## 6. WhatsApp AI receptionist (Phase 3)
```
Meta webhook ─▶ verify X-Hub-Signature-256 ─▶ dedupe by message id ─▶ store ─▶ enqueue ─▶ 200 OK
worker: load conversation (mode=bot?) ─▶ Claude with tool definitions ─▶ tool loop ─▶ send reply
```
- **Tools (server-side, Zod-validated, tenant-scoped):** `get_business_info`, `list_services`,
  `find_available_slots` (returns server-signed `slot_token`s, short TTL), `hold_slot(slot_token)`,
  `confirm_booking(hold_id)`, `list_my_appointments`, `cancel_appointment`, `reschedule_appointment`,
  `join_waitlist`, `escalate_to_human`.
- **Guarantees:**
  - LLM has no DB access; tools call the same module services as the website.
  - Slots exist only as signed tokens issued by `find_available_slots`; forged/expired tokens are rejected.
  - Mutating tools require a prior explicit confirmation turn ("לאשר?" → "כן"), checked by
    server state machine, not by the model's say-so.
  - Identity = the WhatsApp sender number (verified by Meta); actions limited to that customer's own appointments.
  - Customer text is untrusted input (prompt-injection): system prompt + tool permissions, not
    model obedience, enforce policy. No tool exposes other customers' data.
  - Escalation triggers: complaint/anger, medical/allergy questions, payment disputes, repeated
    failure, low confidence, explicit request. Mode → `human`; owner notified; bot silent until released.
  - Rate limits per number; daily cost budget with graceful degradation to "a human will reply".
  - Scope stays a business-specific booking/support assistant (Meta bans general-purpose AI assistants
    on the Business Platform since Jan 2026).
- Offline eval suite of Hebrew conversations (slang, typos, relative dates "מחר אחרי 5", "יום ראשון הבא")
  gates prompt/model changes.

## 7. Auth & authorization
- Dashboard: email + passkeys (WebAuthn) with TOTP fallback; mandatory 2FA for owner/manager.
- Customers: no passwords. Phone OTP (WhatsApp authentication template or SMS) to manage bookings;
  magic links in confirmations are signed, single-purpose, expiring.
- RBAC permission map in `identity` (e.g. `barber` sees own schedule + limited customer fields;
  `owner` sees revenue and exports). Checked in every server action — never only in UI.

## 8. Deployment (proposal, pending budget/residency answer)
- Containers: `web` and `worker` from one Docker image; managed Postgres with PITR backups.
- Region: AWS `il-central-1` (Tel Aviv) or an EU region (EU is an approved destination under the
  Israeli transfer-abroad regulations — verify with counsel).
- CDN for static assets/images; image optimization via Next.js.
- CI: GitHub Actions — lint, typecheck, unit, integration (Postgres service), e2e + axe, build.
- Environments: local (docker compose), preview, production.
