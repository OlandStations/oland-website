import type { Metadata } from "next";
import Image from "next/image";
import CtaButton from "@/components/CtaButton";
import ImpactSampleFormFr from "@/components/ImpactSampleFormFr";
import { QUOTE_PATH_FR } from "@/lib/site";

// NOTE: AI-generated French translation — pending Rachel/Amelia review.
export const metadata: Metadata = {
  title: "Notre impact | O'land Stations",
  description:
    "Découvrez comment O'land Stations réduit les bouteilles de plastique à usage unique lors des événements — plus de 4 millions évitées jusqu'à présent. En savoir plus sur nos rapports d'impact, l'hydratation durable des événements et notre mission de créer un monde sans plastique à usage unique.",
  alternates: {
    canonical: "/fr/our-impact",
    languages: {
      "en-CA": "/our-impact",
      "fr-CA": "/fr/our-impact",
    },
  },
};

const sdgs = [
  {
    n: 13,
    alt: "ODD 13 Mesures relatives à la lutte contre les changements climatiques",
    img: "/images/our-impact/sdg-13-climate-action.png",
  },
  {
    n: 9,
    alt: "ODD 9 Industrie, innovation et infrastructure",
    img: "/images/our-impact/svg-9IndustryInnovation.png",
  },
  {
    n: 11,
    alt: "ODD 11 Villes et communautés durables",
    img: "/images/our-impact/sdg-11-sustainable-cities.png",
  },
  {
    n: 12,
    alt: "ODD 12 Consommation et production responsables",
    img: "/images/our-impact/sdg-12-responsible-consumption.png",
  },
  {
    n: 6,
    alt: "ODD 6 Eau propre et assainissement",
    img: "/images/our-impact/sdg-6-clean-water.png",
  },
];

export default function OurImpactPageFr() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="eyebrow text-steel">Notre impact actuel</p>
        <h1 className="mx-auto mt-3 max-w-4xl text-4xl font-extrabold uppercase leading-tight tracking-tight text-blue sm:text-5xl">
          Nous avons réduit plus de 4 millions de bouteilles de plastique à usage unique
        </h1>
        <div className="relative mx-auto mt-10 aspect-[16/7] w-full overflow-hidden rounded-3xl shadow-xl">
          <Image
            src="/images/our-impact/our-impact-image-1.jpeg"
            alt="Station de remplissage d'eau O'land réduisant les bouteilles de plastique à usage unique"
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
            Obtenez votre échantillon d&rsquo;impact ici
          </h2>
          <ImpactSampleFormFr />
        </div>
      </section>

      {/* SDGs */}
      <section className="bg-offwhite">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">
            Concrétiser les ODD
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-center text-lg text-ink/75">
            Nous nous engageons à nous aligner sur les objectifs de développement durable de
            l&rsquo;ONU et à les concrétiser.
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
              Démarquez-vous.
            </h2>
            <p className="mt-4 max-w-xl text-lg text-white/90 sm:text-xl">
              libérez-vous du plastique, vous aussi!
            </p>
            <div className="mt-8">
              <CtaButton href={QUOTE_PATH_FR} variant="blue">
                Demander une soumission
              </CtaButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
