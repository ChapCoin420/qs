# Brand Brief — Wein's Barbershop (DRAFT v0.1, pending owner approval)

Based on: 2 owner-supplied photos (2026-10-14) + public research (`BUSINESS_PROFILE.md`).
5 further uploads (HEIC) arrived empty (135-byte iOS placeholders) and could not be read.
Photos: used on the site from 2026-10-14 after the owner asked us to build on our own judgment
(stored EXIF-free in `public/images/`). **Rights and model consent still need written confirmation
before public launch.**

## 1. What the photos say

**Photo A — in the shop (documentary).** Straight-razor line-up at the temple; barber's hand
tattooed with a straight razor; dark interior (black shelving, dark walls); warm tungsten bulbs;
retail products on shelves; several chairs working at once; barbers in black tees; white
pinstripe cape with black collar and a script "Wein's" wordmark.
→ Craft, precision, busy and alive, tattoo culture, warm-dark atmosphere.

**Photo B — editorial portrait.** Golden-hour light, amber skin tones against cool teal/glass;
long wet-look hair, sculpted moustache and goatee, sunglasses, woven straw hat, open linen
shirt, rings and finger tattoos.
→ Mediterranean, cinematic, fashion-forward, self-assured. Campaign-grade image.

## 2. Positioning insight

The brand is **not** classic "gentlemen's club" luxury (marble, gold, leather armchairs).
Its luxury is **craft + style**: the precision of the razor and the confidence of an
editorial look, rooted in Haifa (sea, light, mountain). Generic luxury clichés would make
it feel _less_ authentic.

**Working concept: "חיפה. אור. דיוק." — Mediterranean craft noir.**
Two worlds alternate across the site:

- **Shop / craft** — dark, warm, intimate (tungsten, black, brass).
- **Style / light** — golden-hour, open, sea-air (amber, linen, teal).

## 3. Visual system (proposal)

| Token                                                                                          | Value     | Use                                    | Notes                                                                                       |
| ---------------------------------------------------------------------------------------------- | --------- | -------------------------------------- | ------------------------------------------------------------------------------------------- |
| `ink`                                                                                          | `#0F0E0D` | Primary dark background, text on light | Warm near-black                                                                             |
| `linen`                                                                                        | `#EFE8DC` | Primary light background, text on dark | Contrast with ink 15.8:1                                                                    |
| `brass`                                                                                        | `#C28A3F` | Accents, rules, focus ring on dark     | On ink 6.4:1 ✓; on sea 4.1:1 (large text/UI only). **Not** for body text on linen (2.5:1 ✗) |
| `brass-deep`                                                                                   | `#7A5321` | Accent text/links on linen             | On linen 5.6:1 ✓                                                                            |
| `sea`                                                                                          | `#1E3A3C` | Secondary dark sections, footer        | Linen on sea 10:1 ✓                                                                         |
| `smoke`                                                                                        | `#8A8379` | Meta text on ink only                  | On ink 5.2:1 ✓; on linen 3.1:1 ✗                                                            |
| Contrast ratios computed with the WCAG 2 relative-luminance formula (2026-10-14); the CI token |
| contrast check (Phase 1.2) will re-verify them.                                                |

**Typography (Hebrew-first)**

- Display: high-contrast Hebrew serif — free option _Frank Ruhl Libre_; premium options
  (licensed Hebrew foundries) if budget allows. Large, tight, confident headlines.
- Body/UI: clean Hebrew sans — _Assistant_ or _Heebo_; 18 px base on mobile, 1.6 line height.
- Latin: the existing script "Wein's" wordmark is used **only as the logo** — never set as text.
  Need vector logo files (SVG/AI/PDF) from the owner.

**Photography direction**

- Real team, real clients, real shop. No stock imagery.
- Two lighting families: warm tungsten interiors and golden-hour exteriors.
- Close-ups of craft (razor, comb, fade line, beard shaping) + editorial portraits + wide interior.
- Text over photos always gets a gradient scrim (contrast ≥ 4.5:1) or moves off the image.

**Motion:** slow, restrained (fades, gentle reveals); disabled under `prefers-reduced-motion`.
**Texture:** subtle film grain on dark sections (CSS, low-cost); thin brass rules as dividers.

## 4. Voice (Hebrew)

Short, confident, warm, local. Little punctuation, no exclamation marks, no clichés like
"חוויה בלתי נשכחת". Address the reader in second person, masculine-default with gender-neutral
phrasing wherever natural (e.g. "קביעת תור" rather than "קבע תור").
Examples (drafts): "דיוק של תער. סטייל של חיפה." · "תור בשלושים שניות." · "בת חן 64. אנחנו כאן."

## 5. Home page structure (mobile-first draft)

1. **Hero** — full-bleed editorial photo (Photo B type), display headline, primary CTA "קביעת תור",
   secondary "וואטסאפ".
2. **The craft** — razor close-up (Photo A type) + 3 short lines about precision.
3. **Services & prices** — clean list (from DB), duration and price, "קביעת תור" per service.
4. **The team** — portraits, names, specialties.
5. **Gallery** — work grid (cuts, beards), captioned.
6. **Story** — Baruch's story (founded 2019), owner portrait.
7. **Social proof** — rating summary + selected testimonials (with permission).
8. **Visit us** — address, hours, Waze/Google Maps links, parking & accessibility info.
9. **Footer** — contact, social, accessibility statement, privacy, terms.
   A sticky "קביעת תור" button stays reachable on mobile without covering content (WCAG 2.4.11).

## 6. Needed from the owner

1. Logo vector files + any brand colors already in use (cape/signage).
2. The 5 photos re-sent as JPEG/PNG, plus: wide interior, storefront, team portraits, detail shots.
3. Who appears in Photo B, and confirmation of rights/consent for web use of both photos.
4. Approval or corrections for the concept "Mediterranean craft noir".
