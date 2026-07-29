import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Image from "next/image";
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

type Station = {
  name: string;
  copy: string;
  tags: string[];
  alt: string;
  img: string;
};

const stations: Station[] = [
  {
    name: "Premium Water Filling Station",
    copy: "Premium 6-tap station designed for high-visibility events, sponsor activations, and polished guest experiences.",
    tags: ["6 taps", "Branding available", "Digital screen add-on"],
    alt: "Premium 6-tap O'land water filling station",
    img: "/images/our-solutions/premium-6-tap.jpg",
  },
  {
    name: "Standard Water Filling Station",
    copy: "Durable 6-tap station built for high-traffic event environments and reliable crowd hydration.",
    tags: ["6 taps", "Event-ready", "Rent or purchase"],
    alt: "Standard 6-tap O'land water filling station",
    img: "/images/our-solutions/standard-6-tap.jpg",
  },
  {
    name: "Mini Water Filling Station",
    copy: "Compact 2-tap station for flexible layouts, smaller zones, and additional refill points.",
    tags: ["2 taps", "Compact footprint", "Branding available"],
    alt: "Mini O'land water filling station",
    img: "/images/our-solutions/mini-oland.png",
  },
];

const screenFeatures = [
  "Sponsor messaging",
  "Event schedules",
  "Wayfinding",
  "Sustainability updates",
  "Public notices",
  "Impact storytelling",
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

          <div className="mt-16 divide-y divide-ink/10">
            {stations.map((s, i) => {
              const media = (
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl ring-1 ring-inset ring-ink/10">
                  <Image
                    src={s.img}
                    alt={s.alt}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              );
              const content = (
                <div>
                  <h3 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                    {s.name}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-ink/75">{s.copy}</p>
                  <p className="mt-6 text-xs font-bold uppercase tracking-widest text-steel">
                    {s.tags.join(" · ")}
                  </p>
                </div>
              );
              return (
                <Reveal key={s.name} className={i % 2 === 0 ? "reveal-left" : "reveal-right"}>
                  <div className="grid items-center gap-10 py-14 lg:grid-cols-2 lg:gap-16 lg:py-16">
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
              Help Me Choose a Station
            </CtaButton>
          </div>
        </div>
      </section>

      {/* 3. Digital Screens Add-On */}
      <section className="bg-gradient-to-br from-steel to-ink text-white">
        <div className="mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8 lg:py-36">
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <p className="eyebrow text-sand">Premium Add-On</p>
              <h2 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                Turn Every Refill Into Sponsor Visibility
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-white/85">
                Add digital screens to display sponsor messaging, event schedules, wayfinding,
                sustainability content, and impact storytelling. Unlike passive signage, screens
                are attached to a useful service guests actively visit throughout the event.
              </p>
            </div>
          </Reveal>

          <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:items-center">
            <Reveal className="reveal-left">
              <Placeholder
                alt="A digital screen mounted above an O'land refill station displaying sponsor branding and the event schedule"
                data-img="digital-screen-sponsor-hero.jpg"
                className="aspect-[4/3] w-full ring-white/20"
              />
            </Reveal>
            <Reveal className="reveal-right">
              <div className="flex flex-wrap gap-3">
                {screenFeatures.map((f) => (
                  <span
                    key={f}
                    className="rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-white/20"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 4. Impact Reports + Maintenance */}
      <section className="bg-offwhite">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-steel">Included With Every Event</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Support Before, During, and After Your Event
            </h2>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <Reveal className="reveal-left h-full">
              <div className="flex h-full flex-col rounded-3xl bg-white p-8 ring-1 ring-ink/10 sm:p-10">
                <p className="eyebrow text-teal">Impact Reports</p>
                <h3 className="mt-3 text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
                  Impact Reports After Every Event
                </h3>
                <p className="mt-4 text-base leading-relaxed text-ink/75">
                  After each event, O&rsquo;land provides an impact report showing water
                  dispensed, estimated bottles avoided, CO₂e avoided, and usage highlights.
                </p>
                <p className="mt-6 text-xs font-bold uppercase tracking-widest text-steel">
                  Litres dispensed · Bottles avoided · CO₂e avoided · Usage highlights
                </p>
                <div className="mt-auto pt-7">
                  <CtaButton href="/our-impact" variant="outline-dark">
                    Learn About Impact Reports
                  </CtaButton>
                </div>
              </div>
            </Reveal>

            <Reveal className="reveal-right h-full">
              <div className="flex h-full flex-col rounded-3xl bg-white p-8 ring-1 ring-ink/10 sm:p-10">
                <p className="eyebrow text-blue">Maintenance</p>
                <h3 className="mt-3 text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
                  Maintenance and Support
                </h3>
                <p className="mt-4 text-base leading-relaxed text-ink/75">
                  O&rsquo;land helps keep stations event-ready through setup guidance, equipment
                  care, and maintenance support based on your rental or purchase needs.
                </p>
                <p className="mt-6 text-xs font-bold uppercase tracking-widest text-steel">
                  Setup guidance · Equipment care · Event-ready support
                </p>
                <div className="mt-auto pt-7">
                  <CtaButton href={QUOTE_PATH} variant="outline-dark">
                    Ask About Maintenance
                  </CtaButton>
                </div>
              </div>
            </Reveal>
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
