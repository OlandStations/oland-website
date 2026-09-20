# O'land Stations — olandstations.com

A faithful reproduction of [olandstations.com](https://www.olandstations.com), migrated off
Squarespace to a self-owned, static **Next.js + Tailwind CSS v4 + TypeScript** site deployed on
**Cloudflare Pages**. Same content, same section order, same brand identity — not a redesign.
The site ships in **English and French** (`/fr/*`).

## Tech stack

- **Next.js 15** (App Router, `src/` dir, `@/*` import alias) + **TypeScript** (strict)
- **Static export** (`output: "export"` in `next.config.ts`) — no Next.js server at runtime;
  `next/image` is unoptimized since Cloudflare Pages just serves `/out` as static files
- **Tailwind CSS v4** — theme tokens live in `src/app/globals.css` via `@theme` (no JS config)
- **Manrope** font via `next/font/google` (weights 300/400/500/700/800), exposed as `--font-manrope`
- **Cloudflare Pages Functions** (`functions/api/*.ts`) provide the only server-side code — small
  fetch-based endpoints called from the client forms. Everything else is fully static.
- **Vitest** for the impact-calculator math/parsing (`src/lib/impact/__tests__`)

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to /out (passes with zero type errors)
npm start        # serve the last production build (Next server, not the static export)
npm test         # vitest run — impact calculator formulas/parsing/charts
```

To exercise the Pages Functions locally (HubSpot/Monday calls from the quote form), run the
build through Wrangler instead: `npx wrangler pages dev out` with `.dev.vars` populated (see
[Environment variables](#environment-variables--secrets) below).

## Routes

Paths intentionally match the old Squarespace URLs for SEO. Each page exports `metadata` with the
live site's title + description; `metadataBase` is `https://www.olandstations.com`. Every route
below also exists under `/fr/...` (see [Localization](#localization--frfr)), except where noted.

| Path | Page |
|---|---|
| `/` | Home (long scroll, 12 sections) |
| `/our-water-solutions` | Our Solutions |
| `/faqs` | FAQs |
| `/what-we-do` | Who We Are / About |
| `/read-me` | Founder's Letter |
| `/our-impact` | Our Impact |
| `/partners` | Partners |
| `/news-about-sustainability` | News (placeholder) |
| `/contact-1` | Contact |
| `/get-quote` | HubSpot quote form (replaces the old Typeform) |
| `/cookies-policy`, `/give-back-act` | Footer placeholders (content TBD); no French version |
| `/tools/impact-calculator` | Internal staff tool, not localized — see below |

## Brand tokens (`src/app/globals.css`)

| Token | Hex | Use |
|---|---|---|
| `--color-coral` | `#eb684b` | Primary CTA / accents |
| `--color-teal` | `#6bbbae` | |
| `--color-blue` | `#0099cc` | Primary brand, hero, quote-form bg |
| `--color-steel` | `#3776a3` | Headings, captions, form nav |
| `--color-sand` | `#ebdac6` | |
| `--color-offwhite` | `#f2f2f1` | Section bands |
| `--color-nearwhite` | `#fcfcfd` | |
| `--color-ink` | `#0c3a4f` | Body text, footer bg |

Utilities like `bg-blue`, `text-coral`, `border-steel` are generated from these tokens.

## Project structure

```
functions/
  api/create-deal.ts          # POST /api/create-deal — HubSpot contact+deal upsert (Pages Function)
  api/create-rental-item.ts   # POST /api/create-rental-item — creates a monday.com board item
src/
  app/
    layout.tsx                 # root layout: Manrope, Header, Footer, skip-link, base metadata
    globals.css                # Tailwind v4 import + @theme brand tokens
    page.tsx                   # Home
    <route>/page.tsx           # one folder per English route above
    fr/<route>/page.tsx        # French counterpart of each localized route
    get-quote/page.tsx         # renders <QuoteForm />, noindex
    tools/impact-calculator/   # internal, noindex, not in nav — see below
  components/
    Header.tsx, Footer.tsx     # nav/social; French labels come from lib/site.ts's navFr
    Placeholder.tsx             # stand-in for every image not yet real (see below)
    QuoteForm.tsx, QuoteFormFr.tsx           # multi-step HubSpot quote form (client)
    ImpactSampleForm.tsx, ImpactSampleFormFr.tsx
    Accordion.tsx, LogoCarousel.tsx, PartnersCarousel.tsx, Reveal.tsx
    NewsletterForm.tsx         # "Stay tuned!" signup (no provider wired yet)
    CtaButton.tsx, Logo.tsx
  hooks/useScrollReveal.ts
  lib/site.ts                  # nav/navFr, locale helpers, social, contact, QUOTE_PATH
  lib/impact/                  # parsing, formulas, anomaly detection, chart data for the calculator
_reference/                    # source Python scripts the impact calculator was ported from (not shipped)
```

### Localization (`/fr/*`)

Every localized route lives twice — once under `src/app/<route>/` and once under
`src/app/fr/<route>/` — as a deliberate mirror rather than a derived/generated page, so the two
stay easy to read and diff. `src/lib/site.ts` holds:

- `nav` / `navFr` — separate nav trees (not one nav translated at render time)
- `LOCALIZED_ROUTES` — the EN⇄FR path map used by the header's language toggle
- `getLocale()` / `otherLocaleHref()` — resolve the current locale and the equivalent URL in the
  other one, falling back to that locale's home page if the current route has no counterpart

Pages without a French version (`/cookies-policy`, `/give-back-act`, `/tools/impact-calculator`)
simply aren't in `LOCALIZED_ROUTES`.

### Images — `<Placeholder>`

Real assets are not all in the repo yet, so any image still using `<Placeholder>` carries:

- the **real alt text** from the live site (accessibility + parity), and
- a **`data-img="<filename-hint>"`** attribute,

so swapping to real `next/image` later is 1:1. We do **not** hotlink Squarespace CDN URLs. To find
every image that still needs a real asset:

```bash
grep -rn 'data-img=' src/
```

### Quote form — `/get-quote` (and `/fr/get-quote`)

Full-viewport, Typeform-style multi-step form on a solid blue background. On submit it:

1. POSTs to **HubSpot's public Forms API** (Portal `5617063`, Form GUID
   `166e67c3-16c9-4ccb-b5c2-6ef88678fa87`) — unchanged from the original implementation.
2. Calls the Pages Function `POST /api/create-deal`, which does its own contact upsert + deal
   creation in HubSpot (doesn't trust that step 1 has landed yet, so there's no race).
3. Calls `POST /api/create-rental-item`, which creates an item on the monday.com "Rental
   Operations" board in the "Quote Stage Only - Requests from Hubspot" group.

Steps: welcome → contact (first/last/email, validated) → Rent/Purchase/Both (auto-advance) →
attendance → location (required) → start date → end date → notes → potable water access → thank
you. Features: progress bar, prev/next arrows, top-left logo, top-right close (→ `/`),
Enter-to-advance, letter keys pick choices, focus management, `prefers-reduced-motion` respected.

Two fixes baked into both `QuoteForm.tsx` and the Pages Functions (keep them):

1. **Date conversion** — HubSpot's date-picker/date properties require midnight-UTC epoch
   **milliseconds**, not `YYYY-MM-DD`. `toHubSpotDate()` (client) and `toHubSpotDateProperty()`
   (`functions/api/create-deal.ts`) both do this conversion independently.
2. **Submit error handling** — a non-2xx response or network error from the HubSpot Forms POST
   shows a "Something went wrong / Try again" state; the "Thank you!" screen is **never** shown on
   a failed submit. Failures in `/api/create-deal` or `/api/create-rental-item` are logged but
   don't block the user-visible thank-you state (they run after the form already succeeded).

### Contact — `/contact-1` (and `/fr/contact-1`)

No form — a static block of contact info with three category emails as `mailto:` links
(General Inquiries → info@, Marketing → marketing@, Troubleshooting → amelia@). No client-side
submission, no backend call.

### Internal tool — `/tools/impact-calculator`

Staff-only calculator that reproduces `_reference/impact_calculator.py` /
`_reference/impact_chart.py` in the browser: paste/upload event usage data, get back O'land's
impact-report figures and charts, entirely client-side (no server, no data leaves the browser).
Not localized, not in the nav, `noindex`. Access is restricted via Cloudflare Access at the
dashboard/DNS level — there's no auth code in the app itself. Logic lives in `src/lib/impact/`
(parsing, formulas, anomaly detection, chart data) and is covered by the Vitest suite in
`src/lib/impact/__tests__`.

## Environment variables / secrets

The Pages Functions need these as **Cloudflare Pages secrets** in production (Project Settings →
Environment variables) and as local values in `.dev.vars` (gitignored) for `wrangler pages dev`:

| Variable | Used by | Purpose |
|---|---|---|
| `HUBSPOT_PRIVATE_APP_TOKEN` | `functions/api/create-deal.ts` | Private-app token for the contact/deal upsert |
| `MONDAY_API_TOKEN` | `functions/api/create-rental-item.ts` | monday.com API v2 token for creating board items |

Neither token is used anywhere in `src/` — only in `functions/`, which only runs server-side.

## Deployment

Deploys to **Cloudflare Pages** as a static site:

- Build command: `npm run build`; output directory: `out`
- `functions/api/*.ts` deploy automatically as Pages Functions alongside the static export
- Set the two secrets above in the Pages project before the quote form's HubSpot/monday.com steps
  will work in production

---

## TODO before launch (owner input / follow-ups)

- [ ] **Real images.** Replace every remaining `<Placeholder>` with `next/image`. Find them with
  `grep -rn 'data-img=' src/`; the `data-img` hint is the intended filename and the `alt` is final.
- [ ] **HubSpot custom properties.** `functions/api/create-deal.ts`'s `DEAL_PROPERTY_MAP` only
  maps the deal properties confirmed to exist on the portal (`first_date`, `end_date`,
  `number_of_attendees`); there's no deal property for event location yet. The Forms API side
  (`QuoteForm.tsx`) posts the fuller original field set — confirm both stay in sync as HubSpot
  properties are added.
- [ ] **Google Tag Manager `GTM-WFGXZXTD`.** Add the GTM container (e.g. via `@next/third-parties`
  `<GoogleTagManager gtmId="GTM-WFGXZXTD" />` in `layout.tsx`).
- [ ] **Newsletter provider.** `NewsletterForm.tsx` currently just shows "Thank you!" with no
  backend. Wire it to the real provider (Mailchimp / HubSpot / etc.).
- [ ] **Cookies Policy & Give Back Act pages.** `/cookies-policy` and `/give-back-act` are
  placeholders linked from the footer — add the real content (and decide if they should be
  localized too).
- [ ] **News / blog migration.** `/news-about-sustainability` is a placeholder. Migrate the
  Squarespace blog posts (consider MDX or a headless source).

## Notes on faithfulness

Long-form copy (founder's letter, all FAQ answers, the testimonials, SDG/section text) and every
page's `<title>`/meta description were taken from the live site so SEO and content match. Client
names and partner logos use the names called out on the live site; confirm the full list before
launch if any are missing.
