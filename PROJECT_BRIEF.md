# O'land Stations — Website Project Brief (for ChatGPT)

> Paste this whole file into ChatGPT as context. It describes an existing codebase.
> Ask it to produce implementation prompts / code to (1) finish the site, (2) optimize
> for SEO + AEO (Answer Engine Optimization), and (3) make it robust to future changes.

---

## 1. What this is

A marketing website for **O'land Stations** (olandstations.com), a Montreal-based company
that rents/sells premium, sustainable, branded water-refill stations for large events,
festivals, and venues (Canada + USA). The site was **migrated off Squarespace** to a
self-owned, mostly-static site. It is **content-faithful** to the original (same copy,
same section order, same URLs) — not a redesign.

Primary business goal: capture **quote requests** (lead gen) via a multi-step form that
POSTs to HubSpot. Secondary: communicate sustainability impact + credibility (partners,
testimonials).

## 2. Tech stack

- **Next.js 15.5** (App Router, `src/` dir, `@/*` alias) — installed 15.5.19
- **React 19**, **TypeScript 5** (strict mode on)
- **Tailwind CSS v4** — theme tokens via `@theme` in `globals.css` (NO `tailwind.config.js`)
- **Manrope** font via `next/font/google` (weights 300/400/500/700/800)
- Fully static / no CMS / no DB / no backend. Quote form POSTs client-side to HubSpot.
- Deploy target: **Vercel**. Node v22.
- Package manager: npm. Scripts: `dev`, `build`, `start`, `lint`.

## 3. Directory structure

```
src/
  app/
    layout.tsx        # root layout: Manrope font, Header, Footer, skip-link, base metadata
    globals.css       # Tailwind v4 @import + @theme brand tokens + reveal animations
    page.tsx          # Home (long scroll, 12 sections) — 393 lines
    our-water-solutions/page.tsx     # "Our Solutions"
    faqs/page.tsx                    # FAQ accordions
    what-we-do/page.tsx              # About / Who we are + team
    read-me/page.tsx                 # Founder's letter
    our-impact/page.tsx              # Impact + UN SDGs
    partners/page.tsx                # Partners
    news-about-sustainability/page.tsx  # News — PLACEHOLDER (no content)
    contact-1/page.tsx               # Contact
    get-quote/page.tsx               # renders <QuoteForm/>, noindex
    cookies-policy/page.tsx          # PLACEHOLDER (no content)
    give-back-act/page.tsx           # PLACEHOLDER (no content)
  components/
    Header.tsx        # sticky/blur header, About + News dropdowns, mobile hamburger (client)
    Footer.tsx        # blue footer, links, Instagram/LinkedIn/YouTube
    QuoteForm.tsx     # 692-line multi-step HubSpot quote form (client)
    Accordion.tsx     # used by FAQs + Solutions (client)
    LogoCarousel.tsx  # client logos marquee (client)
    NewsletterForm.tsx# "Stay tuned!" signup — NO backend wired (client)
    Placeholder.tsx   # gray stand-in for images not yet added
    CtaButton.tsx, Logo.tsx, Reveal.tsx
  hooks/
    useScrollReveal.ts  # IntersectionObserver scroll-reveal (client)
  lib/
    site.ts           # nav, social URLs, contact details, QUOTE_PATH — single source of truth
public/
  images/             # ~24 real assets (logos, hero, section photos) + thumbnail.jpeg
next.config.ts        # images: webp/avif formats only
package.json, tsconfig.json, postcss.config.mjs, README.md
```

There is **no `.git` repository** (not version controlled yet).

## 4. Routes + current metadata

`metadataBase` = `https://www.olandstations.com`. Root layout `title.template` is `"%s"`
(i.e. NO automatic site-name suffix — each page sets its own full title). `lang="en-CA"`.

| Path | Purpose | Title (current) | Indexed? |
|---|---|---|---|
| `/` | Home | "Water Stations for Events" | yes |
| `/our-water-solutions` | Solutions | "Eco-Friendly Water Stations for Events & Indoor Spaces — O'land…" | yes |
| `/faqs` | FAQs | "FAQs \| Enhance Your Event Experience…" | yes |
| `/what-we-do` | About/team | "About Us — O'land…" | yes |
| `/read-me` | Founder's letter | "A letter from our Founder…" | yes |
| `/our-impact` | Impact + SDGs | "Over 1 million plastic bottles reduced…" | yes |
| `/partners` | Partners | "Partners for a world without single-use plastic…" | yes |
| `/news-about-sustainability` | News | "News — O'land…" | yes (but empty) |
| `/contact-1` | Contact | "Contact \| Connect Today…" | yes |
| `/get-quote` | Quote form | "Get a Quote — O'land…" | **noindex** |
| `/cookies-policy` | Legal | "Cookies Policy — O'land…" | yes (but empty) |
| `/give-back-act` | Program | "Give Back Act — O'land…" | yes (but empty) |

All pages export `metadata` with a title + description carried over from the live site.

## 5. Brand system (design tokens in `src/app/globals.css`)

| Token | Hex | Use |
|---|---|---|
| `--color-coral` | `#eb684b` | Primary CTA / accents |
| `--color-teal` | `#6bbbae` | Secondary |
| `--color-blue` | `#0099cc` | Primary brand, hero, footer, quote-form bg |
| `--color-steel` | `#3776a3` | Headings, captions |
| `--color-sand` | `#ebdac6` | |
| `--color-offwhite` | `#f2f2f1` | Section bands |
| `--color-nearwhite` | `#fcfcfd` | |
| `--color-ink` | `#0c3a4f` | Body text |

Generates utilities `bg-blue`, `text-coral`, etc. Scroll-reveal via `.reveal`,
`.reveal-left`, `.reveal-right` + `.revealed` class (IntersectionObserver).
`prefers-reduced-motion` is respected. Visible `:focus-visible` outlines. Skip-to-content link.

## 6. Contact + social (from `lib/site.ts`)

- Phone: (438)-389-4057 / `tel:+14383894057`
- Emails: info@olandstations.com, marketing@olandstations.com
- Location: Montreal, CA
- Instagram: instagram.com/olandstations
- LinkedIn: linkedin.com/company/oland-stations/
- YouTube: youtube.com/@olandstations336

## 7. Quote form (`/get-quote`, `QuoteForm.tsx`)

Full-viewport, Typeform-style multi-step form on solid blue bg. POSTs to **HubSpot**
(Portal `5617063`, Form GUID `166e67c3-16c9-4ccb-b5c2-6ef88678fa87`).

Steps: welcome → contact (first/last/email, validated) → Rent/Purchase/Both (auto-advance)
→ attendance → location (required) → start date → end date → notes → potable water access → thank you.

HubSpot fields: `firstname, lastname, email, rent_or_purchase, event_attendance,
event_location, event_start_date, event_end_date, potable_water_access, messages`.

Two baked-in behaviors to preserve: (1) `toHubSpotDate()` converts `YYYY-MM-DD` to midnight-UTC
epoch **ms** (HubSpot date-picker requirement); (2) failed submit shows an error state, never
the "Thank you!" screen. Accessibility: progress bar, keyboard nav, focus management,
reduced-motion respected.

## 8. Known unfinished work (from README TODO)

- [ ] Some images are still `<Placeholder>` gray boxes (find via `grep -rn 'data-img=' src/`).
      ~20 placeholders remain (founder photos, team photos, SDG goal icons, instagram posts,
      infographics, video). Real hero/section photos + client logos ARE present in `public/images`.
- [ ] HubSpot custom properties must exist with exact internal names + be added to the form.
- [ ] **Google Tag Manager `GTM-WFGXZXTD`** is NOT installed yet.
- [ ] `NewsletterForm` has no backend — shows "Thank you!" with no provider.
- [ ] `/cookies-policy`, `/give-back-act`, `/news-about-sustainability` are empty placeholders.
- [ ] Not deployed yet; domain not pointed; no redirects configured.

---

## 9. SEO gaps (what's MISSING — have ChatGPT address these)

1. **No `favicon.ico`** exists, but `layout.tsx` references `/favicon.ico`. Also no
   `apple-icon`, no `icon.png`, no PWA `manifest`.
2. **No `sitemap.xml`** — need `src/app/sitemap.ts` listing all indexable routes.
3. **No `robots.txt`** — need `src/app/robots.ts` (allow all, point to sitemap, disallow
   `/get-quote`).
4. **No canonical URLs** — no `alternates.canonical` on any page. Risk of www vs non-www
   and trailing-slash duplication.
5. **No Open Graph / Twitter images** — `openGraph` has siteName/type/locale but NO `images`,
   no per-page `og:image`, no `twitter` card block. Social shares will look bare.
6. **Title template is `"%s"`** — every page manually repeats "— O'land water stations for
   events". Consider a proper `template: "%s | O'land Stations"` and shorter per-page titles.
7. **Empty indexable pages** (`/news…`, `/cookies-policy`, `/give-back-act`) — thin/empty
   content that's indexable = quality risk. Either fill them or `noindex` until ready.
8. **No image `sizes`/dimensions audit** — LCP/Core Web Vitals. Hero uses `priority` (good),
   but verify all `next/image` have correct width/height/sizes.
9. **No structured breadcrumbs**, no `hreflang` (site is en-CA only, but worth confirming).
10. **Meta descriptions** on some pages are very long (>160 chars, e.g. `/our-impact`,
    `/what-we-do`, `/partners`) — will be truncated in SERPs.

## 10. AEO gaps (Answer Engine Optimization — for Google AI Overviews, ChatGPT, Perplexity)

AEO = being the citable, machine-readable source that LLMs/answer engines quote. Missing:

1. **No JSON-LD structured data anywhere.** High-value schemas to add:
   - `Organization` / `LocalBusiness` (name, logo, url, sameAs socials, address Montreal,
     phone, email) — in root layout.
   - `Product` / `Service` + `Offer` for the rent/purchase water stations.
   - `FAQPage` schema on `/faqs` (the accordion Q&As) — strong AEO win, eligible for rich results.
   - `BreadcrumbList` per page.
   - `Person` for founder/team on `/what-we-do` and `/read-me`.
   - `Review`/`AggregateRating` for the 6 testimonials on the home page.
2. **No clear entity/answer formatting** — AEO favors concise question-style H2s, direct
   first-sentence answers, definition lists, and tables. Content should be restructured so
   each key claim (impact numbers, "how fast is a refill", "rent vs buy") is a self-contained,
   quotable unit.
3. **Impact stats are unsourced** — "4 million bottles", "57,505t CO2e", "70+ events". Answer
   engines prefer sourced/dated stats. Add "as of <date>" + methodology page.
4. **No `llms.txt`** (emerging convention for LLM crawlers) — worth adding.
5. **No author/E-E-A-T signals** — about page, founder bio, credentials help AEO trust.
6. **News/blog is empty** — regularly-updated, question-answering content is the main AEO
   engine. A real blog (MDX or headless) targeting event-planner questions would help.

## 11. Robustness / maintainability gaps (make it future-proof)

1. **Not in git.** Initialize a repo, commit, push to GitHub, connect Vercel. This is #1.
2. **No tests, no CI, no linting gate.** Add ESLint config check in CI, plus basic
   type-check (`tsc --noEmit`) and maybe Playwright smoke tests for the quote form.
3. **Content is hard-coded in JSX.** Testimonials, FAQs, team, partners, SDGs are inline
   arrays inside page files. Consider extracting to typed data files (`src/data/*.ts`) or
   MDX/headless CMS so non-devs can edit and so schema (JSON-LD) can be generated from the
   same source of truth.
4. **HubSpot IDs + GTM ID are hard-coded** — move to env vars (`.env.local` +
   `process.env.NEXT_PUBLIC_*`) so staging/prod differ safely.
5. **No error boundary / `not-found.tsx` / `error.tsx`** custom pages.
6. **No analytics/consent** — GTM + a cookie-consent banner (esp. for CA/QC privacy law,
   Quebec Law 25) tied to the (currently empty) cookies policy.
7. **Newsletter + quote form have no spam protection** (honeypot / rate limit / captcha).
8. **`next.config.ts`** has `remotePatterns` commented out — fine while images are local,
   but document the plan if a CDN is introduced.
9. **Accessibility is already good** (skip link, focus-visible, reduced-motion, aria labels,
   semantic nav) — keep this standard; add automated a11y checks to CI.
10. **Placeholder component** ships gray boxes to production if not all replaced — add a
    build-time check or lint rule that fails if `data-img=` remains on launch.

---

## 12. What to ask ChatGPT for

Ask it to generate, in priority order:
1. `robots.ts`, `sitemap.ts`, `favicon`/icons/manifest, canonical URLs, OG/Twitter image
   strategy, tightened titles/descriptions.
2. A **JSON-LD system**: a reusable `<JsonLd>` component + Organization/LocalBusiness in
   layout + FAQPage on /faqs + Product/Service + Review + BreadcrumbList, ideally generated
   from extracted typed data files.
3. A **content-data refactor** (move inline arrays to `src/data/*.ts` with types).
4. **Env-var migration** for HubSpot/GTM IDs + GTM install + consent banner (Quebec Law 25).
5. **Git + CI setup** (GitHub Actions: install, typecheck, lint, build; optional Playwright
   quote-form smoke test).
6. Filling or noindex-ing the empty pages; wiring the newsletter; a real blog for AEO.

When asking for code, tell ChatGPT: **Next.js 15 App Router, React 19, TypeScript strict,
Tailwind v4 with `@theme` tokens (no JS config), `next/font`, deploy on Vercel. Keep the
existing brand tokens and the `lib/site.ts` single-source-of-truth pattern.**
