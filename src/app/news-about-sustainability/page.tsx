import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "News & Sustainability Updates | O'land Stations",
  description:
    "Sustainability news from O'land Stations: reuse systems, plastic waste reduction, and event hydration. Read our latest features, press mentions, and milestones, including our Green Sports Alliance partnership.",
};

const pressReleaseUrl =
  "https://www.greensportsalliance.org/media/oland-stations-and-green-sports-alliance-team-up-to-tackle-plastic-pollution-aiming-to-refill-5-million-bottles-by-end-of-2025";

type NewsItem = {
  eyebrow: string;
  title: string;
  body?: ReactNode;
  cta: string;
  ctaHref: string;
  ctaAriaLabel: string;
  /** Where the card image links to (only when the original page linked it). */
  imageHref?: string;
  imageAriaLabel?: string;
  img: string;
  alt: string;
  /** "contain" for designed covers/graphics (never crop text), "cover" for photos. */
  fit: "contain" | "cover";
};

const newsItems: NewsItem[] = [
  {
    eyebrow: "Reuse Playbook with Green Sports Alliance",
    title: "Comprehensive Guide to Implementing Reuse Systems in Sports and Entertainment Venues",
    cta: "Download",
    ctaHref: "https://www.greensportsalliance.org/playbooks/reuse",
    ctaAriaLabel: "Download the Reuse Playbook from Green Sports Alliance",
    imageHref:
      "https://www.greensportsalliance.org/press/comprehensive-guide-to-implementing-reuse-systems-in-sports-and-entertainment-venues-green-sports-alliance-releases-reuse-playbook",
    imageAriaLabel: "Read the Green Sports Alliance announcement of the Reuse Playbook",
    img: "/images/news/reuse-playbook.webp",
    alt: "Reuse PlayBook 2024 - O'land Stations as a contributing author and success stories covered in this report.",
    fit: "contain",
  },
  {
    eyebrow: "Series",
    title: "Inspirational Women in Sustainability",
    body: (
      <>
        Welcome to the <em>Inspirational Women in Sustainability</em> series. To launch this
        series, we’re shining a spotlight on a true pioneer in ocean conservation—a name synonymous
        with marine advocacy: <strong>Sylvia Earle</strong>.
      </>
    ),
    cta: "Read More",
    ctaHref:
      "https://www.linkedin.com/pulse/inspirational-women-sustainability-sylvia-earle-oland-stations-xsbrf/?trackingId=Mv0rXUIKEDIe3cZ1MjyHDg%3D%3D",
    ctaAriaLabel: "Read more about Inspirational Women in Sustainability: Sylvia Earle on LinkedIn",
    img: "/images/news/sylvia-earle.webp",
    alt: "Quote on blue background with a black and white photo of Sylvia Earle smiling, reading, 'We need to respect the oceans and take care of them as if our lives depended on it. Because they do.'",
    fit: "contain",
  },
  {
    eyebrow: "Milestone",
    title: "Together, we’ve made history!",
    body: <>Over 100,000 metric tons of CO2e emissions avoided</>,
    cta: "Read More",
    ctaHref:
      "https://www.linkedin.com/pulse/together-weve-made-history-oland-stations-7radf/?trackingId=hH3JH7aWTgeh3wfwHMv8GQ%3D%3D",
    ctaAriaLabel: "Read more about our emissions milestone on LinkedIn",
    img: "/images/news/impact-report.webp",
    alt: "Person holding a colorful impact report titled 'Impact Mollion' with a collage of photos on the cover, sitting on a wooden floor wearing a gray knit sweater and blue jeans.",
    fit: "cover",
  },
  {
    eyebrow: "Podcast",
    title: "We were guests on Resilient Earth Radio.",
    body: <>Listen here</>,
    cta: "Click here",
    ctaHref:
      "https://open.spotify.com/episode/10OKdByfDDC6i1jyBt7gH5?si=bf015cae82304d63&nd=1&dlsi=f7a0e30632fb4aca",
    ctaAriaLabel: "Listen to our Resilient Earth Radio episode on Spotify",
    img: "/images/news/resilient-earth-radio.webp",
    alt: "Cover art for Resilient Earth Radio & Podcast, featuring an image of the Earth held by a hand, with the title and subtitle of the podcast and the logo of O'land Fill Station.",
    fit: "contain",
  },
];

export default function NewsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-offwhite via-nearwhite to-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-28 left-1/2 -z-10 h-[26rem] w-[44rem] -translate-x-1/2 rounded-full bg-blue/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 right-[10%] -z-10 h-64 w-64 rounded-full bg-teal/15 blur-3xl"
        />
        <div className="mx-auto max-w-4xl px-4 pb-24 pt-20 text-center sm:px-6 sm:pb-32 sm:pt-28 lg:px-8">
          <p className="eyebrow text-steel">News</p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-ink sm:text-6xl">
            News for a greener future
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink/70 sm:text-xl">
            Check out our newsfeed and latest features &amp; mentions
          </p>
        </div>
      </section>

      {/* Featured story */}
      <section
        aria-labelledby="featured-story"
        className="relative mx-auto -mt-10 max-w-7xl px-4 pb-16 sm:-mt-14 sm:px-6 sm:pb-20 lg:px-8"
      >
        <Reveal>
          <article className="group grid overflow-hidden rounded-3xl bg-white shadow-lg shadow-ink/5 ring-1 ring-ink/10 transition-shadow duration-300 hover:shadow-xl hover:shadow-ink/10 lg:grid-cols-2">
            <a
              href={pressReleaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Read the press release: O'land Stations and Green Sports Alliance team up to tackle plastic pollution"
              className="flex items-center justify-center bg-gradient-to-br from-blue/10 via-teal/10 to-offwhite p-6 sm:p-10"
            >
              <div className="relative aspect-square w-full max-w-md">
                <Image
                  src="/images/news/gsa-5-million-refills.webp"
                  alt="Refill Bottles Partnership Announcement with Green Sports Alliance"
                  fill
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  className="object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
            </a>
            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
              <span className="inline-flex w-fit items-center rounded-full bg-coral/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-coral">
                Featured
              </span>
              <p className="eyebrow mt-5 text-steel">Creating a world without single-use plastic</p>
              <h2
                id="featured-story"
                className="mt-4 text-2xl font-extrabold leading-snug tracking-tight text-ink sm:text-3xl"
              >
                O&rsquo;land Stations and Green Sports Alliance Team Up to Tackle Plastic Pollution,
                Aiming to Refill 5 Million Bottles by end of 2025.
              </h2>
              <div className="mt-8">
                <a
                  href={pressReleaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-coral px-7 py-3 text-sm font-bold uppercase tracking-wide text-white transition-all duration-200 hover:bg-coral/90 hover:shadow-md"
                >
                  Read the Press Release
                </a>
              </div>
            </div>
          </article>
        </Reveal>
      </section>

      {/* Newsfeed grid */}
      <section aria-labelledby="newsfeed-heading" className="bg-offwhite">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <p className="eyebrow text-steel">Newsfeed</p>
          <h2
            id="newsfeed-heading"
            className="mt-3 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl"
          >
            Latest features &amp; mentions
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:gap-8">
            {newsItems.map((item, i) => (
              <Reveal key={item.title} className="reveal h-full" delay={i % 2 ? "delay-150" : ""}>
                <article className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-md shadow-ink/5 ring-1 ring-ink/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/10">
                  {item.imageHref ? (
                    <a
                      href={item.imageHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.imageAriaLabel}
                      className="relative block aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-blue/10 via-white to-teal/10"
                    >
                      <Image
                        src={item.img}
                        alt={item.alt}
                        fill
                        sizes="(min-width: 640px) 45vw, 90vw"
                        className={`${
                          item.fit === "cover" ? "object-cover" : "object-contain p-4"
                        } transition-transform duration-500 group-hover:scale-[1.03]`}
                      />
                    </a>
                  ) : (
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-blue/10 via-white to-teal/10">
                      <Image
                        src={item.img}
                        alt={item.alt}
                        fill
                        sizes="(min-width: 640px) 45vw, 90vw"
                        className={`${
                          item.fit === "cover" ? "object-cover" : "object-contain p-4"
                        } transition-transform duration-500 group-hover:scale-[1.03]`}
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6 sm:p-7">
                    <p className="eyebrow text-steel">{item.eyebrow}</p>
                    <h3 className="mt-3 text-xl font-extrabold leading-snug tracking-tight text-ink">
                      {item.title}
                    </h3>
                    {item.body && (
                      <p className="mt-3 text-base leading-relaxed text-ink/70">{item.body}</p>
                    )}
                    <div className="mt-auto pt-6">
                      <a
                        href={item.ctaHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={item.ctaAriaLabel}
                        className="group/cta inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-steel transition-colors hover:text-coral"
                      >
                        {item.cta}
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 16 16"
                          fill="none"
                          className="h-4 w-4 transition-transform duration-200 group-hover/cta:translate-x-1"
                        >
                          <path
                            d="M2 8h11m0 0L9 4m4 4-4 4"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Closing quote */}
      <section className="relative isolate overflow-hidden bg-ink">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 right-[12%] -z-10 h-80 w-80 rounded-full bg-teal/15 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-28 left-[8%] -z-10 h-72 w-72 rounded-full bg-blue/20 blur-3xl"
        />
        <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
          <Reveal>
            <figure>
              <blockquote>
                <p className="text-2xl font-extrabold uppercase leading-snug tracking-tight text-white sm:text-4xl sm:leading-tight">
                  &ldquo;Our past, our present, and whatever remains of our future, absolutely
                  depend on what we do now.&rdquo;
                </p>
              </blockquote>
              <figcaption className="eyebrow mt-8 text-teal">&mdash; Sylvia Earle</figcaption>
            </figure>
          </Reveal>
        </div>
      </section>
    </>
  );
}
