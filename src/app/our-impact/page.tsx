import type { Metadata } from "next";
import Image from "next/image";
import CtaButton from "@/components/CtaButton";
import ImpactSampleForm from "@/components/ImpactSampleForm";
import { QUOTE_PATH } from "@/lib/site";

export const metadata: Metadata = {
  title: "Over 1 million plastic bottles reduced — O'land water stations for events",
  description:
    "Explore our impact: We've successfully reduced over 4 million plastic bottles, significantly cutting down plastic waste and preserving our environment. Our ambitious goal for 2026 is to eliminate 6 million plastic bottles. Join us in this crucial mission to create a plastic-free future, protect our oceans, and promote sustainable living through our innovative refill stations.",
};

const sdgs = [
  {
    n: 13,
    alt: "SDG 13 Climate Action",
    img: "/images/our-impact/sdg-13-climate-action.png",
  },
  {
    n: 9,
    alt: "SDG 9 Industry, Innovation and Infrastructure",
    img: "/images/our-impact/svg-9IndustryInnovation.png",
  },
  {
    n: 11,
    alt: "SDG 11 Sustainable Cities and Communities",
    img: "/images/our-impact/sdg-11-sustainable-cities.png",
  },
  {
    n: 12,
    alt: "SDG 12 Responsible Consumption and Production",
    img: "/images/our-impact/sdg-12-responsible-consumption.png",
  },
  {
    n: 6,
    alt: "SDG 6 Clean Water and Sanitation",
    img: "/images/our-impact/sdg-6-clean-water.png",
  },
];

export default function OurImpactPage() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="eyebrow text-steel">Our current impact</p>
        <h1 className="mx-auto mt-3 max-w-4xl text-4xl font-extrabold uppercase leading-tight tracking-tight text-ink sm:text-5xl">
          We reduced over 4 million single-use plastic bottles
        </h1>
        <div className="relative mx-auto mt-10 aspect-[16/7] w-full overflow-hidden rounded-3xl shadow-xl">
          <Image
            src="/images/our-impact/our-impact-image-1.jpeg"
            alt="O'land water refill station reducing single-use plastic bottles"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* Get your impact sample */}
      <section className="bg-blue text-white">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Get your impact sample here
          </h2>
          <ImpactSampleForm />
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
          <div className="mt-12 grid grid-cols-2 place-items-center gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {sdgs.map((s) => (
              <div
                key={s.n}
                className="relative aspect-square w-full max-w-[160px] overflow-hidden rounded-2xl bg-white ring-1 ring-ink/10"
              >
                <Image
                  src={s.img}
                  alt={s.alt}
                  fill
                  sizes="160px"
                  className="object-contain p-4"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Make it stand out */}
      <section className="relative isolate overflow-hidden">
        <div className="relative aspect-[4/5] w-full sm:aspect-[16/9] lg:aspect-[21/9]">
          <Image
            src="/images/our-impact/MakeItStandOut.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-ink/60" aria-hidden="true" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
              Make it stand out.
            </h2>
            <p className="mt-4 max-w-xl text-lg text-white/90 sm:text-xl">
              get your freedom from plastic too!
            </p>
            <div className="mt-8">
              <CtaButton href={QUOTE_PATH} variant="coral">
                Get a quote
              </CtaButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
