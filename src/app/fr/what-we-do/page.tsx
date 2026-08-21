import type { Metadata } from "next";
import Image from "next/image";
import Placeholder from "@/components/Placeholder";
import CtaButton from "@/components/CtaButton";
import PartnersCarousel from "@/components/PartnersCarousel";

// NOTE: AI-generated French translation — pending Rachel/Amelia review.
export const metadata: Metadata = {
  title: "Qui sommes-nous — Stations d'eau O'land pour événements",
  description:
    "Joignez-vous à notre mission de défenseurs passionnés de l'environnement et guerriers contre la pollution plastique. Depuis 2019, nous menons des initiatives pour protéger les océans et réduire les déchets plastiques. Présents dans les grands festivals au Canada et aux États-Unis, nous fournissons de l'eau fraîche et réduisons l'empreinte carbone grâce à nos stations de remplissage. Notre objectif : un monde sans plastique à usage unique.",
  alternates: {
    canonical: "/fr/what-we-do",
    languages: {
      "en-CA": "/what-we-do",
      "fr-CA": "/fr/what-we-do",
    },
  },
};

type TeamMember = { name: string; role: string; alt: string; img?: string };

const team: TeamMember[] = [
  {
    name: "Rachel Labbe-Bellas",
    role: "FONDATRICE ET PDG",
    alt: "Rachel Labbe-Bellas, membre de l'équipe O'land",
    img: "/images/about/who-we-are/team/rachel.jpg",
  },
  {
    name: "Francis De Courval",
    role: "DIRECTEUR DES OPÉRATIONS",
    alt: "Francis De Courval, membre de l'équipe O'land",
    img: "/images/about/who-we-are/team/Francis.jpg",
  },
  {
    name: "Maria Munarini",
    role: "DIRECTRICE MARKETING",
    alt: "Maria Munarini, membre de l'équipe O'land",
    img: "/images/about/who-we-are/team/Maria.jpg",
  },
  {
    name: "Amélia Morgan",
    role: "Responsable production et opérations",
    alt: "Amélia Morgan, membre de l'équipe O'land",
    img: "/images/about/who-we-are/team/Amelia.jpg",
  },
  {
    name: "Marc Decelles",
    role: "CONCEPTION DE PRODUITS",
    alt: "Marc Decelles, membre de l'équipe O'land",
    img: "/images/about/who-we-are/team/MarcDecelles.jpg",
  },
  {
    name: "Daniel",
    role: "SOUTIEN AUX OPÉRATIONS",
    alt: "Daniel, membre de l'équipe O'land",
    img: "/images/about/who-we-are/team/Daniel.jpg",
  },
];

export default function WhatWeDoPageFr() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="max-w-4xl text-3xl font-extrabold leading-tight tracking-tight text-blue sm:text-4xl lg:text-5xl">
          Nous sommes une entreprise à mission composée de guerriers passionnés contre la pollution
          plastique.
        </h1>
        <div className="mt-10 grid items-center gap-10 lg:grid-cols-2">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl">
            <Image
              src="/images/about/who-we-are/story/WhoWeAre1.jpeg"
              alt="Personne buvant à une station de remplissage O'land"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <p className="text-lg leading-relaxed text-ink/80">
            Nous menons des initiatives pour préserver les océans et nous protéger de la pollution
            plastique depuis 2019. Nous avons été au cœur de presque tous les grands festivals au
            Canada et aux États-Unis, <strong>fournissant de l&rsquo;eau fraîche</strong> aux
            foules et réduisant notre empreinte carbone grâce à nos stations de remplissage. Être
            une entreprise à mission, ce n&rsquo;est pas seulement une question de profits; c&rsquo;est
            une question de <strong>raison d&rsquo;être</strong> – celle qui nous guide :
          </p>
        </div>
      </section>

      {/* Blue band */}
      <section className="relative bg-blue text-white">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <p className="eyebrow text-white/80">Notre cause est intemporelle</p>
          <h2 className="mt-3 text-3xl font-extrabold uppercase tracking-tight sm:text-5xl">
            Créer un monde sans plastique à usage unique
          </h2>
        </div>
      </section>

      {/* Green shift */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Nous aidons votre entreprise à faire le virage vert facilement, avec style et plaisir.
          </h2>
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
            <Image
              src="/images/about/who-we-are/story/WhoWeAre2.png"
              alt="Station de remplissage O'land à l'image d'un événement extérieur"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Owned and operated */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl">
            <Image
              src="/images/about/who-we-are/story/WhoWeAre3.gif"
              alt="Personne faisant de l'escalade en plein air"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Détenue et exploitée par des amoureux de la nature
            </h2>
            <p className="mt-5 text-lg text-ink/80">
              Nous sommes une entreprise indépendante de stations d&rsquo;eau, créée pour réduire le
              plastique à usage unique à la source. Sur un marché saturé de marques détenues par de
              grandes entreprises qui privilégient le profit maximal au détriment de la planète,
              O&rsquo;land se consacre à faire le maximum pour arrêter les bouteilles de plastique à
              la source, car nous croyons que c&rsquo;est en vivant la nature que nous la protégeons.
            </p>
            <div className="mt-7">
              <CtaButton href="/fr/read-me" variant="blue">
                Lire un message de notre fondatrice
              </CtaButton>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="bg-offwhite">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Rencontrez l&rsquo;équipe
          </h2>
          <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-3">
            {team.map((m) =>
              m.img ? (
                <div key={m.name} className="text-center">
                  <div className="relative mx-auto aspect-square w-full max-w-[220px] overflow-hidden rounded-2xl">
                    <Image
                      src={m.img}
                      alt={m.alt}
                      fill
                      sizes="220px"
                      className="object-cover"
                    />
                  </div>
                  <h3 className="mt-4 text-lg font-extrabold text-ink">{m.name}</h3>
                  <p className="mt-1 text-xs font-bold uppercase tracking-widest text-steel">
                    {m.role}
                  </p>
                </div>
              ) : (
                <div key={m.name} className="text-center">
                  <Placeholder
                    alt={m.alt}
                    data-img={`team-${m.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.jpg`}
                    className="mx-auto aspect-square w-full max-w-[220px]"
                  />
                  <h3 className="mt-4 text-lg font-extrabold text-ink">{m.name}</h3>
                  <p className="mt-1 text-xs font-bold uppercase tracking-widest text-steel">
                    {m.role}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Our partners */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="eyebrow text-center text-steel">Nos partenaires</p>
        <div className="mt-10">
          <PartnersCarousel locale="fr" />
        </div>
      </section>
    </>
  );
}
