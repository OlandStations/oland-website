# O'land Stations — olandstations.com

A faithful reproduction of [olandstations.com](https://www.olandstations.com), migrated off
Squarespace to a self-owned, fully static **Next.js + Tailwind CSS v4 + TypeScript** site for
deployment on **Vercel**. Same content, same section order, same brand identity — not a redesign.

## Tech stack

- **Next.js 15** (App Router, `src/` dir, `@/*` import alias) + **TypeScript** (strict)
- **Tailwind CSS v4** — theme tokens live in `src/app/globals.css` via `@theme` (no JS config)
- **Manrope** font via `next/font/google` (weights 300/400/500/700/800), exposed as `--font-manrope`
- No CMS, no database, no backend. Fully static. Quote capture POSTs client-side to **HubSpot**.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (passes with zero type errors)
npm start        # serve the production build
```

## Routes

Paths intentionally match the old Squarespace URLs for SEO. Each page exports `metadata` with the
live site's title + description; `metadataBase` is `https://www.olandstations.com`.

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
| `/cookies-policy`, `/give-back-act` | Footer placeholders (content TBD) |

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
src/
  app/
    layout.tsx                 # root layout: Manrope, Header, Footer, skip-link, base metadata
    globals.css                # Tailwind v4 import + @theme brand tokens
    page.tsx                   # Home
    <route>/page.tsx           # one folder per route above
    get-quote/page.tsx         # renders <QuoteForm />, noindex
  components/
    Header.tsx                 # sticky/blur header, About+News dropdowns, mobile hamburger
    Footer.tsx                 # ink footer, links, Instagram/LinkedIn/YouTube
    Placeholder.tsx            # stand-in for every image (see below)
    QuoteForm.tsx              # multi-step HubSpot quote form (client)
    Accordion.tsx              # used by FAQs + Solutions
    NewsletterForm.tsx         # "Stay tuned!" signup (no provider wired yet)
    CtaButton.tsx, Logo.tsx
  lib/site.ts                  # nav, social URLs, contact details, QUOTE_PATH
```

### Images — `<Placeholder>`

Real assets are not in the repo yet, so **every image is a `<Placeholder>`**. Each one carries:

- the **real alt text** from the live site (accessibility + parity), and
- a **`data-img="<filename-hint>"`** attribute,

so swapping to real `next/image` later is 1:1. We do **not** hotlink Squarespace CDN URLs. To find
every image that needs an asset:

```bash
grep -rn 'data-img=' src/
```

### Quote form — `/get-quote`

Full-viewport, Typeform-style multi-step form on a solid blue background, posting to HubSpot
(**Portal `5617063`**, **Form GUID `166e67c3-16c9-4ccb-b5c2-6ef88678fa87`**).

Steps: welcome → contact (first/last/email, validated) → Rent/Purchase/Both (auto-advance) →
attendance → location (required) → start date → end date → notes → potable water access → thank you.
Features: progress bar, prev/next arrows, top-left logo, top-right close (→ `/`), Enter-to-advance,
letter keys pick choices, focus management, `prefers-reduced-motion` respected.

HubSpot field mapping (`fields[]`): `firstname, lastname, email, rent_or_purchase, event_attendance,
event_location, event_start_date, event_end_date, potable_water_access, messages`.

Two fixes baked in (keep them):

1. **Date conversion** — `toHubSpotDate()` converts the `YYYY-MM-DD` picker value to midnight-UTC
   epoch **milliseconds**, which HubSpot date-picker properties require.
2. **Submit error handling** — a non-2xx response or network error shows a "Something went
   wrong / Try again" state; the "Thank you!" screen is **never** shown on a failed submit.

---

## TODO before launch (owner input / follow-ups)

- [ ] **Real images.** Replace every `<Placeholder>` with `next/image`. Find them with
  `grep -rn 'data-img=' src/`; the `data-img` hint is the intended filename and the `alt` is final.
  Add the image host to `next.config.ts` `images.remotePatterns` if serving remotely.
- [ ] **HubSpot custom properties.** The 7 custom properties (`rent_or_purchase`, `event_attendance`,
  `event_location`, `event_start_date`, `event_end_date`, `potable_water_access`, `messages`) must
  exist in HubSpot with those exact internal names and be added to the form. If `event_start_date` /
  `event_end_date` are **date-picker** properties, keep the epoch conversion; if they are plain
  **text** properties, change `toHubSpotDate()` in `QuoteForm.tsx` to return the raw string.
- [ ] **Google Tag Manager `GTM-WFGXZXTD`.** Add the GTM container (e.g. via `@next/third-parties`
  `<GoogleTagManager gtmId="GTM-WFGXZXTD" />` in `layout.tsx`).
- [ ] **Newsletter provider.** `NewsletterForm.tsx` currently just shows "Thank you!" with no
  backend. Wire it to the real provider (Mailchimp / HubSpot / etc.).
- [ ] **Cookies Policy & Give Back Act pages.** `/cookies-policy` and `/give-back-act` are
  placeholders linked from the footer — add the real content.
- [ ] **News / blog migration.** `/news-about-sustainability` is a placeholder. Migrate the
  Squarespace blog posts (consider MDX or a headless source).
- [ ] **Deploy to Vercel.** `vercel` (CLI) or connect the Git repo in the Vercel dashboard. Then
  point the `olandstations.com` domain at the new deployment and set up the legacy-URL redirects
  if any old paths changed (none are expected — routes mirror the Squarespace URLs).

## Notes on faithfulness

Long-form copy (founder's letter, all FAQ answers, the 6 testimonials, SDG/section text) and every
page's `<title>`/meta description were taken from the live site so SEO and content match. Client
names and partner logos use the names called out on the live site; confirm the full list before
launch if any are missing.
