import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CtaButton from "@/components/CtaButton";
import Reveal from "@/components/Reveal";
import LogoCarousel from "@/components/LogoCarousel";
import { QUOTE_PATH_FR, social } from "@/lib/site";

// Staggered transition-delay utilities cycled across testimonial cards.
// Kept as literal strings so Tailwind can detect and generate them.
const revealDelays = ["delay-100", "delay-200", "delay-300"];

// NOTE: AI-generated French translation — pending Rachel/Amelia review.
export const metadata: Metadata = {
  title: "Stations d'eau pour événements | O'land Stations",
  description:
    "Découvrez nos stations de remplissage d'eau haut de gamme conçues pour rehausser les grands événements. Avec des designs personnalisés à 360 degrés pour une expérience optimale, écologiques, données d'impact gratuites et plus encore. Choisissez la durabilité avec nos solutions d'hydratation innovantes!",
  alternates: {
    canonical: "/fr",
    languages: {
      "en-CA": "/",
      "fr-CA": "/fr",
    },
  },
};

// 6 client testimonials (French localization of the live English quotes).
const testimonials = [
  {
    quote:
      "Il n'y avait aucun doute que nous voulions travailler avec O'land. C'est une entreprise tellement dévouée, qui partage les mêmes valeurs que nous, comme le fait de bien prendre soin de notre planète. Nous ne retrouvons pas cette philosophie chez les autres entreprises du marché.",
    author: "Eric Fortin Lambert, directeur des opérations chez Evenko",
  },
  {
    quote:
      "Nous avons fait appel à O'land cette année pour notre festival. Les années précédentes, nous avions reçu des plaintes concernant la lenteur de la distribution d'eau, causant de longues files d'attente, et j'ai partagé cette préoccupation avec l'équipe. Ils m'ont assurée que ce ne serait pas un problème - et ils ont livré la marchandise! Nous n'avons reçu que d'excellents commentaires - ce qui était important étant donné la chaleur de cette journée-là! L'équipe s'est montrée très accommodante et agréable à travailler!",
    author: "Sherri McGurnaghan — Montreal Highland Games 2024",
  },
  {
    quote:
      "Au Parc olympique, nous croyons que chaque petit geste compte pour améliorer la situation de la vie marine, c'est pourquoi nous avons fait affaire avec O'land. Cette entreprise écoresponsable offre des infrastructures d'eau mobiles. Alors n'oubliez pas votre bouteille réutilisable lors de votre prochaine visite à l'Esplanade!",
    author: "Parc olympique",
  },
  {
    quote:
      "Dans l'ensemble, un excellent produit! Ce fut un grand succès et nous avons hâte de voir davantage de développement dans les années à venir.",
    author: "Emily Simon, Whitecap Entertainment",
  },
  {
    quote:
      "D'une idée née lors d'un concours d'innovation à un impact mesurable dans le monde réel! O'land Stations tient sa promesse - une bouteille d'eau évitée à la fois.",
    author: "Kariann Aarup, Aqua Action Toronto IWA",
  },
  {
    quote:
      "Avoir la station de remplissage d'eau portative sur place a tout changé. Elle a offert un accès facile à l'hydratation pour les athlètes et les spectateurs, tout en réduisant le plastique à usage unique. C'est une solution efficace et responsable sur le plan environnemental que nous utiliserions à nouveau sans hésiter.",
    author: "Gabe Amick, Hamilton County Sports Authority",
  },
];

export default function HomeFr() {
  return (
    <>
      {/* 1. Hero */}
      <section className="relative min-h-[85vh]">
        <Image
          src="/images/homepage/hero/homepage-hero.png"
          alt="Personnes à une station d'eau O'land"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 mx-auto flex min-h-[85vh] max-w-7xl flex-col items-center justify-center px-4 py-20 text-center text-white sm:px-6 lg:px-8">
          <Reveal className="reveal w-full">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Stations de remplissage d&rsquo;eau durables et haut de gamme pour événements et
              lieux de rassemblement
            </h1>
            <div className="mt-8 flex justify-center">
              <CtaButton href={QUOTE_PATH_FR} variant="blue">
                Demander une soumission
              </CtaButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2. 360-degree custom design */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal className="reveal-right">
            <Image
              src="/images/homepage/sections/brita-station.jpg"
              alt="Station de remplissage d'eau de marque Brita"
              width={600}
              height={600}
              className="w-full h-auto rounded-2xl"
            />
          </Reveal>
          <Reveal className="reveal-left">
            <h2 className="text-3xl font-extrabold tracking-tight text-blue sm:text-4xl">
              Design personnalisé à 360 degrés
            </h2>
            <p className="mt-5 text-lg text-ink/75">
              Engagez votre auditoire avec un affichage personnalisé et créez une expérience fluide
              lors de votre événement, tout en rehaussant l&rsquo;expérience globale des
              participants.
            </p>
            <div className="mt-7">
              <CtaButton href={QUOTE_PATH_FR} variant="blue">
                Demander une soumission
              </CtaButton>
            </div>
            <p className="mt-8 text-xl font-bold text-steel">
              1 CONSOMMATEUR SUR 2 convient que la commandite a un impact positif sur les marques
              impliquées
            </p>
          </Reveal>
        </div>
      </section>

      {/* 3. No lines / No waste — full-bleed cropped banner */}
      <section className="relative w-full overflow-hidden h-[500px]">
        <Image
          src="/images/homepage/sections/no-line-no-waste.jpg"
          alt="Aucune file, aucun gaspillage"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 z-10 flex items-center justify-center px-4 text-center">
          <p className="text-4xl font-extrabold leading-tight tracking-tight text-white drop-shadow-lg sm:text-6xl lg:text-7xl">
            &laquo; Aucune file
            <br />
            aucun gaspillage &raquo;
          </p>
        </div>
      </section>

      {/* 4. Fan-centric design */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal className="reveal-right">
            <p className="eyebrow text-coral">Une conception axée sur les participants</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-blue sm:text-4xl">
              Rehausser votre image de marque et la fidélité des participants
            </h2>
            <p className="mt-5 text-lg text-ink/75">
              Nos stations d&rsquo;eau sont conçues pour donner la priorité à vos clients. Nous
              comprenons qu&rsquo;offrir une expérience supérieure avec un équipement comme le
              nôtre facilite non seulement la réduction de l&rsquo;utilisation du plastique, mais
              rehausse aussi l&rsquo;expérience globale et la sécurité d&rsquo;hydratation des
              participants à l&rsquo;événement. Cette approche contribue à renforcer la notoriété
              et la confiance envers vos commanditaires, rendant leur implication encore plus
              significative.
            </p>
          </Reveal>
          <Reveal className="reveal-left">
            <Image
              src="/images/homepage/sections/fan-centric-design.jpg"
              alt="Conception axée sur les participants dans un festival"
              width={600}
              height={600}
              className="w-full h-auto rounded-2xl"
            />
          </Reveal>
        </div>
      </section>

      {/* 5. Filtered & Chilled Water */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <Reveal className="reveal-left">
              <h2 className="text-3xl font-extrabold tracking-tight text-blue sm:text-4xl">
                Eau filtrée et rafraîchie
              </h2>
              <p className="mt-5 text-lg text-teal">
                Étanchez votre soif avec notre eau filtrée, rafraîchie et distribuée rapidement,
                pour un rafraîchissement pur à chaque fois.
              </p>
              <div className="mt-7">
                <CtaButton href={QUOTE_PATH_FR} variant="blue">
                  Demander une soumission
                </CtaButton>
              </div>
            </Reveal>
            <Reveal className="reveal-right">
              <Image
                src="/images/homepage/sections/filtered-chilled-water.jpg"
                alt="Participant profitant d'une eau filtrée et rafraîchie"
                width={480}
                height={640}
                className="aspect-[3/4] w-full max-w-[480px] rounded-2xl object-cover"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 6a. Creating a world without — text strip */}
      <section className="bg-[#f2f2f1]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4 py-8 text-center text-xl font-extrabold uppercase tracking-tight sm:text-2xl lg:px-8">
          <span className="text-blue">
            Créer un monde{" "}
            <span className="underline decoration-teal decoration-4 underline-offset-4">
              sans
            </span>
          </span>
          <span className="text-ink">bouteilles de plastique à usage unique</span>
        </div>
      </section>

      {/* 6b. Refill a bottle in 5 seconds */}
      <section className="bg-blue">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          {/* LEFT: refill-in-action photo */}
          <div className="flex items-center justify-center">
            <div className="relative aspect-[4/5] w-full max-w-[500px] overflow-hidden rounded-2xl shadow-lg">
              <Image
                src="/images/faq/IMG_5985.jpeg"
                alt="Un participant remplit une bouteille réutilisable en quelques secondes à une station de remplissage d'eau O'land"
                fill
                sizes="(min-width: 1024px) 500px, 90vw"
                className="object-cover"
              />
            </div>
          </div>
          {/* RIGHT: large headline, vertically centred */}
          <div className="flex items-center">
            <p className="text-5xl font-extrabold text-white lg:text-7xl">
              Remplissez une bouteille en 5 secondes
            </p>
          </div>
        </div>
      </section>

      {/* 7. For the planet we love — full-bleed background image */}
      <section className="relative min-h-[600px] overflow-hidden">
        <Image
          src="/images/homepage/sections/for-the-planet-we-love.jpg"
          alt=""
          fill
          className="object-cover"
        />
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
          {/* LEFT: semi-transparent blue card */}
          <Reveal className="reveal-left">
            <div className="rounded-xl bg-blue/85 p-8">
              <p className="text-lg font-semibold text-white">
                Dans notre cheminement vers un avenir durable, nous reconnaissons l&rsquo;impact
                profond que chacune de nos stations d&rsquo;eau a sur les gens, les événements et
                la planète.
              </p>
              <p className="mt-4 text-lg font-semibold text-white">
                Chez O&rsquo;land Water Stations, notre engagement réside dans la conception et la
                fabrication responsables de nos produits, en veillant à ce qu&rsquo;ils aient un
                impact minimal sur l&rsquo;environnement. Nous nous consacrons à créer des stations
                d&rsquo;eau qui résistent à l&rsquo;épreuve du temps, incarnant la responsabilité
                environnementale tout en minimisant le gaspillage.
              </p>
            </div>
          </Reveal>
          {/* RIGHT: text directly on the image */}
          <Reveal className="reveal-right">
            <div className="text-white drop-shadow-lg">
              <h2 className="text-5xl font-bold leading-tight text-white">
                <span className="block w-fit border-b-2 border-white/70 pb-1">Pour la planète</span>
                <span className="mt-2 block w-fit border-b-2 border-white/70 pb-1">que nous aimons</span>
              </h2>
              <p className="mt-6 text-2xl">Nous avons évité :</p>
              <p className="mt-2 text-3xl">
                4 MILLIONS de bouteilles de plastique et <span className="font-extrabold">57 505 t</span>{" "}
                d&rsquo;émissions de CO2e
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 8. Rent / Purchase */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-blue sm:text-4xl">
            Choisissez votre option et <span className="text-coral">demandez une soumission</span>
          </h2>
          <div className="mt-12 grid grid-cols-2 gap-12">
            {[
              {
                title: "Louer",
                src: "/images/homepage/sections/rent.jpg",
                alt: "Un jeune homme dans un festival près d'une station de remplissage d'eau",
              },
              {
                title: "Acheter",
                src: "/images/homepage/sections/purchase.png",
                alt: "Station d'eau à l'extérieur lors d'un événement",
              },
            ].map((opt, i) => (
              <Reveal key={opt.title} className={`flex flex-col ${i === 0 ? "reveal-left" : "reveal-right"}`}>
                <div className="aspect-[3/4] overflow-hidden rounded-xl">
                  <Image
                    src={opt.src}
                    alt={opt.alt}
                    width={700}
                    height={900}
                    className="h-full w-full rounded-xl object-cover"
                  />
                </div>
                <h3 className="mt-6 text-center text-2xl font-extrabold text-ink">
                  {opt.title.toUpperCase()}
                </h3>
                <p className="mt-2 text-center text-ink/60">
                  seulement les matériaux et la fabrication de la plus haute qualité
                </p>
                <div className="mt-6 flex justify-center">
                  <Link
                    href={QUOTE_PATH_FR}
                    className="inline-flex items-center justify-center rounded-full bg-blue px-8 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-blue/90"
                  >
                    Cliquez ici
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-blue sm:text-4xl">
          Ce que disent nos clients
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.author} className="reveal h-full" delay={revealDelays[i % revealDelays.length]}>
              <figure className="flex h-full flex-col rounded-2xl bg-offwhite p-7 ring-1 ring-ink/5">
                <svg
                  viewBox="0 0 24 24"
                  className="h-8 w-8 text-coral"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M9.5 7C6.5 7 4 9.5 4 12.5V19h6v-6H7.2c0-1.6 1-2.7 2.3-2.9V7Zm10 0c-3 0-5.5 2.5-5.5 5.5V19h6v-6h-2.8c0-1.6 1-2.7 2.3-2.9V7Z" />
                </svg>
                <blockquote className="mt-4 flex-1 text-ink/80">{t.quote}</blockquote>
                <figcaption className="mt-5 text-sm font-bold text-steel">{t.author}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 10. Clients */}
      <LogoCarousel locale="fr" />

      {/* 11. Instagram + updates CTA (replaces the unwired newsletter form and
          the Instagram placeholder tiles for V1). */}
      <section className="bg-offwhite">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-blue sm:text-4xl">
            Suivez-nous sur Instagram
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink/75">
            Suivez O&rsquo;land pour des faits saillants d&rsquo;événements, des récits d&rsquo;impact,
            des coulisses et de l&rsquo;inspiration sur nos stations de remplissage.
          </p>
          <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-ink/60">
            Vous voulez des nouvelles d&rsquo;O&rsquo;land? Suivez-nous sur Instagram ou contactez
            notre équipe pour des nouvelles, des partenariats et des mises à jour sur les
            événements.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-blue px-7 py-3 text-sm font-bold uppercase tracking-wide text-white transition-all duration-200 hover:bg-blue/90 hover:shadow-md"
            >
              Suivez-nous sur Instagram
            </a>
            <CtaButton href="/fr/contact-1" variant="outline-blue">
              Nous contacter
            </CtaButton>
          </div>
        </div>
      </section>
    </>
  );
}
