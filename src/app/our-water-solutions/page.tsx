import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Placeholder from "@/components/Placeholder";
import CtaButton from "@/components/CtaButton";
import Reveal from "@/components/Reveal";
import { QUOTE_PATH } from "@/lib/site";

// Scoped to this page only — layout.tsx / Header / Footer keep Manrope.
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Water Refill Solutions for Events | O'land Stations",
  description:
    "Explore O'land water refill stations for rent or purchase, with digital screen add-ons, custom branding, and post-event impact reports for events, venues, and sponsors.",
};

// Staggered transition-delay utilities cycled across grid cards.
// Kept as literal strings so Tailwind can detect and generate them.
const revealDelays = ["delay-100", "delay-200", "delay-300", "delay-[400ms]"];

function CheckIcon({ className = "h-4 w-4 shrink-0 text-teal" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      aria-hidden="true"
    >
      <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type Station = {
  name: string;
  copy: string;
  bestFor: string[];
  features: string[];
  alt: string;
  img: string;
};

const stations: Station[] = [
  {
    name: "Standard 6-Tap Refill Station",
    copy: "A high-capacity refill station designed for busy event environments where guests need quick, reliable access to water.",
    bestFor: ["Festivals", "Sports events", "Public events", "Large outdoor sites"],
    features: [
      "6 refill taps",
      "Built for high-traffic areas",
      "Available for rent or purchase",
      "Custom branding available",
      "Impact reporting included",
    ],
    alt: "The O'land Standard 6-Tap Refill Station set up at a busy outdoor festival with guests refilling reusable bottles",
    img: "station-standard-6tap.jpg",
  },
  {
    name: "Premium 6-Tap Refill Station",
    copy: "A polished refill station for events where presentation, sponsor visibility, and guest experience matter.",
    bestFor: [
      "Sponsor activations",
      "Golf and premium sports events",
      "Corporate events",
      "VIP or high-visibility zones",
    ],
    features: [
      "6 refill taps",
      "Premium visual presence",
      "Branding and digital screen options",
      "Available for rent or purchase",
      "Impact reporting included",
    ],
    alt: "The O'land Premium 6-Tap Refill Station with sponsor branding and a digital screen at a corporate event",
    img: "station-premium-6tap.jpg",
  },
  {
    name: "Mini O'land Tap",
    copy: "A compact hydration point for smaller spaces, indoor areas, VIP zones, or additional refill locations across a larger site.",
    bestFor: ["Smaller venues", "Indoor activations", "VIP areas", "Secondary refill zones"],
    features: [
      "Compact footprint",
      "Easy to place across event zones",
      "Branding available",
      "Available for rent or purchase",
      "Impact reporting included",
    ],
    alt: "The compact Mini O'land Tap refill point placed in a VIP lounge area indoors",
    img: "station-mini-oland-tap.jpg",
  },
];

const screenUseCases = [
  {
    label: "Sponsor Branding",
    body: "Feature sponsor names, logos, and messaging",
    icon: (
      <path
        d="m12 3 2.2 4.9 5.3.6-4 3.6 1.1 5.2L12 14.8 7.4 17.3l1.1-5.2-4-3.6 5.3-.6L12 3Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    label: "Event Schedules",
    body: "Set times, race starts, match schedules",
    icon: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" />
      </>
    ),
  },
  {
    label: "Wayfinding",
    body: "Entrances, washrooms, stages, VIP, first aid",
    icon: (
      <>
        <path
          d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="9" r="2.3" />
      </>
    ),
  },
  {
    label: "Sustainability Messaging",
    body: "Reinforce your event's sustainability commitment",
    icon: (
      <path
        d="M12 21c-4.5-1.2-7-4.6-7-9 0-4 2.8-7.3 7-8 4.2.7 7 4 7 8 0 4.4-2.5 7.8-7 9Z M12 13c2-3 2-6.5 0-9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    label: "Public Notices",
    body: "Heat alerts, safety updates, lost & found",
    icon: (
      <>
        <path
          d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M10 20a2 2 0 0 0 4 0" strokeLinecap="round" />
      </>
    ),
  },
  {
    label: "Impact Storytelling",
    body: "Show guests the impact of every refill",
    icon: <path d="M4 19h16M4 19V9l4 3 4-6 4 4 4-2v11" strokeLinecap="round" strokeLinejoin="round" />,
  },
];

const rentPurchase = [
  {
    title: "Rent O'land Stations",
    eyebrow: "Short-Term",
    accentText: "text-blue",
    accentBg: "bg-blue/10 ring-blue/20",
    bulletColor: "text-blue",
    bestFor: [
      "Festivals",
      "Sports events",
      "Corporate activations",
      "Seasonal events",
      "Sponsor activations",
      "Temporary municipal events",
    ],
    copy: "Rentals are ideal for events that need professional hydration infrastructure without permanent ownership. O'land helps match the right station setup to your site, schedule, guest flow, and branding needs.",
  },
  {
    title: "Purchase O'land Stations",
    eyebrow: "Long-Term",
    accentText: "text-steel",
    accentBg: "bg-steel/10 ring-steel/20",
    bulletColor: "text-steel",
    bestFor: [
      "Venues",
      "Municipalities",
      "Campuses",
      "Permanent public spaces",
      "Recurring event sites",
      "Facilities with ongoing refill needs",
    ],
    copy: "Purchase options are available for organizations that need long-term hydration infrastructure and want a durable alternative to single-use bottled water.",
  },
];

const impactMetrics = [
  {
    label: "Litres of Water Dispensed",
    body: "Total refill volume across every station on-site",
    icon: (
      <path
        d="M12 3s6 7.2 6 11.2a6 6 0 1 1-12 0C6 10.2 12 3 12 3Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    label: "Estimated 500 mL Bottles Avoided",
    body: "Single-use bottles kept out of circulation",
    icon: (
      <path
        d="M9 2h6M10 2v4l-3 3v11a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V9l-3-3V2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    label: "Estimated CO₂e Avoided",
    body: "Emissions reduction from bottles never produced",
    icon: (
      <path
        d="M7 18a4 4 0 1 1 .9-7.9A5 5 0 0 1 17 9a4 4 0 0 1 0 8H7Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    label: "Usage by Day, Station, or Event Zone",
    body: "A breakdown of refill activity across your event",
    icon: <path d="M4 20V10M10 20V4M16 20v-7M4 20h16" strokeLinecap="round" strokeLinejoin="round" />,
  },
];

export default function OurSolutionsPage() {
  return (
    <div className={`${montserrat.variable} font-[family-name:var(--font-montserrat)]`}>
      {/* 1. Hero */}
      <section className="bg-nearwhite">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
          <Reveal>
            <div>
              <p className="eyebrow text-steel">For Event Organizers, Venues & Sponsors</p>
              <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-ink sm:text-5xl">
                Water Refill Solutions for Events, Venues, and Sponsors
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/75">
                O&rsquo;land provides event-ready water refill stations for rent or purchase, with
                optional digital screens, custom branding, installation support, and post-event
                impact reports included.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <CtaButton href={QUOTE_PATH} variant="coral">
                  Request a Quote
                </CtaButton>
                <CtaButton href="#stations" variant="outline-dark">
                  Explore Our Stations
                </CtaButton>
              </div>
            </div>
          </Reveal>
          <Reveal className="reveal-right">
            <Placeholder
              alt="An O'land premium refill station with a digital screen at an outdoor festival, guests refilling reusable bottles"
              data-img="hero-solutions-station-lineup.jpg"
              className="aspect-[4/3] w-full"
            />
          </Reveal>
        </div>
      </section>

      {/* 2. Water Stations We Offer */}
      <section id="stations" className="scroll-mt-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-steel">Water Stations We Offer</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Water Stations Built for Real Event Conditions
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink/70">
              Choose from high-capacity refill stations and compact hydration points designed for
              festivals, sports events, corporate activations, municipalities, venues, and
              sponsor-branded experiences.
            </p>
          </div>

          <div className="mt-16 space-y-14">
            {stations.map((s, i) => {
              const media = (
                <Placeholder alt={s.alt} data-img={s.img} className="aspect-[4/3] w-full" />
              );
              const content = (
                <div>
                  <h3 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                    {s.name}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-ink/75">{s.copy}</p>
                  <div className="mt-7 grid gap-6 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-steel">
                        Best For
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {s.bestFor.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink/75 ring-1 ring-ink/10"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-steel">
                        Features
                      </p>
                      <ul className="mt-3 space-y-2">
                        {s.features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-sm text-ink/80">
                            <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
              return (
                <Reveal key={s.name} className={i % 2 === 0 ? "reveal-left" : "reveal-right"}>
                  <div className="grid items-center gap-10 rounded-3xl bg-offwhite p-8 lg:grid-cols-2 lg:p-12">
                    {i % 2 === 0 ? (
                      <>
                        {media}
                        {content}
                      </>
                    ) : (
                      <>
                        {content}
                        {media}
                      </>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>

          <div className="mt-14 text-center">
            <CtaButton href={QUOTE_PATH} variant="coral">
              Help Me Choose the Right Station
            </CtaButton>
          </div>
        </div>
      </section>

      {/* 3. Digital Screens Add-On */}
      <section className="bg-gradient-to-br from-steel to-ink text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <p className="eyebrow text-sand">Premium Add-On</p>
              <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                Add Digital Screens to Turn Every Refill Into Sponsor Visibility
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-white/85">
                O&rsquo;land stations can be equipped with digital screens to display sponsor
                messaging, event schedules, wayfinding, sustainability content, public
                announcements, and live impact storytelling. Because guests actively visit refill
                stations throughout the event, screens become a useful high-traffic communication
                point instead of passive signage.
              </p>
              <blockquote className="mx-auto mt-6 max-w-xl border-l-4 border-coral pl-5 text-left text-lg font-semibold italic text-white">
                Unlike passive signage, digital screens are attached to a useful service guests
                actively visit throughout the day.
              </blockquote>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:items-center">
            <Reveal className="reveal-left">
              <Placeholder
                alt="A digital screen mounted above an O'land refill station displaying sponsor branding and the event schedule"
                data-img="digital-screen-sponsor-hero.jpg"
                className="aspect-[4/3] w-full ring-white/20"
              />
            </Reveal>
            <Reveal className="reveal-right">
              <div className="grid grid-cols-2 gap-4">
                {screenUseCases.map((u) => (
                  <div
                    key={u.label}
                    className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur-sm"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4.5 w-4.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        aria-hidden="true"
                      >
                        {u.icon}
                      </svg>
                    </span>
                    <p className="mt-3 text-sm font-bold uppercase tracking-wide text-sand">
                      {u.label}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-white/75">{u.body}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal>
            <div className="mt-14 rounded-3xl bg-white/10 p-8 ring-1 ring-white/15 sm:p-10">
              <div className="mx-auto max-w-2xl text-center">
                <p className="eyebrow text-coral">Built for Sponsor Activations</p>
                <p className="mt-4 text-lg leading-relaxed text-white/90">
                  Digital screens help sponsors create repeated, positive brand interactions by
                  associating their message with free water access, sustainability, convenience,
                  and a better guest experience.
                </p>
              </div>
            </div>
          </Reveal>

          <div className="mt-12 text-center">
            <CtaButton href={QUOTE_PATH} variant="coral">
              Add Digital Screens to My Quote
            </CtaButton>
          </div>
        </div>
      </section>

      {/* 4. Rent or Purchase */}
      <section className="bg-offwhite">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-steel">Flexible Terms</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Rent for Events. Purchase for Long-Term Use.
            </h2>
          </div>
          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {rentPurchase.map((r, i) => (
              <Reveal key={r.title} className={i === 0 ? "reveal-left h-full" : "reveal-right h-full"}>
                <div className={`flex h-full flex-col rounded-3xl p-8 ring-1 sm:p-10 ${r.accentBg}`}>
                  <p className={`eyebrow ${r.accentText}`}>{r.eyebrow}</p>
                  <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-ink">{r.title}</h3>
                  <p className="mt-3 text-xs font-bold uppercase tracking-widest text-steel">
                    Best For
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {r.bestFor.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink/75 ring-1 ring-ink/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="mt-6 text-base leading-relaxed text-ink/75">{r.copy}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Impact Reports Included */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-teal">Included With Every Booking</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Impact Reporting Is Included After Every Event
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink/70">
              After each event, O&rsquo;land provides an impact report at no extra cost. These
              reports help organizers, sponsors, and sustainability teams understand the
              measurable results of refill behavior.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {impactMetrics.map((m, i) => (
              <Reveal key={m.label} className="reveal h-full" delay={revealDelays[i % revealDelays.length]}>
                <div className="flex h-full flex-col rounded-2xl bg-offwhite p-7 ring-1 ring-ink/5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-teal/10 text-teal">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      aria-hidden="true"
                    >
                      {m.icon}
                    </svg>
                  </span>
                  <h3 className="mt-5 text-base font-bold text-ink">{m.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/70">{m.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <p className="mx-auto mt-12 max-w-2xl text-center text-base leading-relaxed text-ink/70">
            Impact reports can be used in sponsor recaps, sustainability reports, stakeholder
            updates, and post-event communications.
          </p>

          <div className="mt-8 text-center">
            <CtaButton href="/our-impact" variant="outline-dark">
              Learn About Impact Reports
            </CtaButton>
          </div>
        </div>
      </section>

      {/* 6. Final CTA */}
      <section className="bg-blue text-white">
        <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Ready to Plan Your Hydration Setup?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/85">
            Tell us about your event, location, expected attendance, and goals. O&rsquo;land will
            help recommend the right station setup, digital screen options, and impact reporting
            approach.
          </p>
          <div className="mt-8">
            <CtaButton href={QUOTE_PATH} variant="coral">
              Request a Quote
            </CtaButton>
          </div>
        </div>
      </section>
    </div>
  );
}
