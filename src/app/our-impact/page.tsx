import type { Metadata } from "next";
import Placeholder from "@/components/Placeholder";
import CtaButton from "@/components/CtaButton";
import { QUOTE_PATH } from "@/lib/site";

export const metadata: Metadata = {
  title: "Over 1 million plastic bottles reduced — O'land water stations for events",
  description:
    "Explore our impact: We've successfully reduced over 4 million plastic bottles, significantly cutting down plastic waste and preserving our environment. Our ambitious goal for 2026 is to eliminate 6 million plastic bottles. Join us in this crucial mission to create a plastic-free future, protect our oceans, and promote sustainable living through our innovative refill stations.",
};

const sdgs = [
  {
    n: 13,
    alt: "Green background with white text and icon representing climate action, featuring the number 13 and an eye with a globe inside.",
  },
  {
    n: 9,
    alt: "Graphic representing the United Nations Sustainable Development Goal 9: Industry, Innovation, and Infrastructure, featuring three connected cubes on an orange background.",
  },
  {
    n: 11,
    alt: "Iconic illustration of urban buildings representing sustainable cities, with the text '11 Sustainable Cities and Communities' on an orange background.",
  },
  {
    n: 12,
    alt: "Icon representing goal 12 of the Sustainable Development Goals, responsible consumption and production, featuring an infinity symbol on a gold background.",
  },
  {
    n: 6,
    alt: "United Nations Sustainable Development Goal 6 logo for clean water and sanitation, featuring a drinking glass with a water droplet and downward arrow on a blue background.",
  },
];

export default function OurImpactPage() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="eyebrow text-steel">Our current impact</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-extrabold uppercase leading-tight tracking-tight text-ink sm:text-5xl">
          We reduced over 4 million single-use plastic bottles
        </h1>
        <Placeholder
          alt="O'land water refill station reducing single-use plastic bottles"
          data-img="impact-hero.jpeg"
          className="mt-10 aspect-[16/7] w-full"
        />
      </section>

      {/* Blue band */}
      <section className="bg-blue text-white">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <p className="text-xl font-semibold sm:text-2xl">
            And we&rsquo;re dreaming bigger. By the end of 2026 we&rsquo;re aiming to reduce
          </p>
          <p className="mt-4 text-4xl font-extrabold uppercase tracking-tight sm:text-6xl">
            6 Million Plastic Bottles
          </p>
        </div>
      </section>

      {/* Get your impact sample */}
      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          Get your impact sample here
        </h2>
        <div className="mt-8">
          <CtaButton href={QUOTE_PATH} variant="coral">
            Get my sample
          </CtaButton>
        </div>
      </section>

      {/* SDGs */}
      <section className="bg-offwhite">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">
            Making the SDG&rsquo;s a reality
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-center text-lg text-ink/75">
            We are committed to aligning with the UN Sustainable Development Goals and turning them
            into a reality.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {sdgs.map((s) => (
              <Placeholder
                key={s.n}
                alt={s.alt}
                data-img={`sdg-goal-${s.n}.png`}
                className="aspect-square w-full"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">
          Get your freedom from plastic too!
        </h2>
        <div className="mt-8">
          <CtaButton href={QUOTE_PATH} variant="coral">
            Get a quote
          </CtaButton>
        </div>
      </section>
    </>
  );
}
