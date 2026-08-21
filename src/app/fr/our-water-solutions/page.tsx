import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Image from "next/image";
import CtaButton from "@/components/CtaButton";
import Reveal from "@/components/Reveal";
import { QUOTE_PATH_FR } from "@/lib/site";

// Scoped to this page only — layout.tsx / Header / Footer keep Manrope.
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

// NOTE: AI-generated French translation — pending Rachel/Amelia review.
export const metadata: Metadata = {
  title: "Solutions de remplissage d'eau pour événements | O'land Stations",
  description:
    "Découvrez les stations de remplissage d'eau O'land à louer ou à acheter, avec écrans numériques en option, affichage personnalisé et rapports d'impact post-événement pour événements, lieux et commanditaires.",
  alternates: {
    canonical: "/fr/our-water-solutions",
    languages: {
      "en-CA": "/our-water-solutions",
      "fr-CA": "/fr/our-water-solutions",
    },
  },
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
    name: "Station de remplissage d'eau Premium",
    copy: "Station premium à 6 robinets conçue pour les événements à forte visibilité, les activations de commanditaires et une expérience client soignée.",
    tags: ["6 robinets", "Affichage disponible", "Écran numérique en option"],
    alt: "Station de remplissage d'eau O'land Premium à 6 robinets",
    img: "/images/our-solutions/premium-6-tap.jpg",
  },
  {
    name: "Station de remplissage d'eau Standard",
    copy: "Station durable à 6 robinets conçue pour les environnements événementiels à fort achalandage et une hydratation fiable des foules.",
    tags: ["6 robinets", "Prête pour l'événement", "Location ou achat"],
    alt: "Station de remplissage d'eau O'land Standard à 6 robinets",
    img: "/images/our-solutions/standard-6-tap.jpg",
  },
  {
    name: "Station de remplissage d'eau Mini",
    copy: "Station compacte à 2 robinets pour des aménagements flexibles, des zones plus petites et des points de remplissage additionnels.",
    tags: ["2 robinets", "Encombrement réduit", "Affichage disponible"],
    alt: "Station de remplissage d'eau O'land Mini",
    img: "/images/our-solutions/mini-oland.png",
  },
];

const screenFeatures = [
  "Messages des commanditaires",
  "Horaires de l'événement",
  "Signalisation",
  "Mises à jour sur la durabilité",
  "Avis publics",
  "Récits d'impact",
];

export default function OurSolutionsPageFr() {
  return (
    <div className={`${montserrat.variable} font-[family-name:var(--font-montserrat)]`}>
      {/* 1. Hero */}
      <section className="bg-nearwhite">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
          <Reveal>
            <div>
              <p className="eyebrow text-steel">Pour organisateurs d&rsquo;événements, lieux et commanditaires</p>
              <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-blue sm:text-5xl">
                Solutions de remplissage d&rsquo;eau pour événements, lieux et commanditaires
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/75">
                O&rsquo;land offre des stations de remplissage d&rsquo;eau prêtes pour
                l&rsquo;événement, à louer ou à acheter, avec écrans numériques en option,
                affichage personnalisé, soutien à l&rsquo;installation et rapports d&rsquo;impact
                post-événement inclus.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <CtaButton href={QUOTE_PATH_FR} variant="blue">
                  Demander une soumission
                </CtaButton>
                <CtaButton href="#stations" variant="outline-blue">
                  Découvrir nos stations
                </CtaButton>
              </div>
            </div>
          </Reveal>
          <Reveal className="reveal-right">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl ring-1 ring-inset ring-ink/10">
              <Image
                src="/images/our-solutions/banner-ourSolutions.png"
                alt="Stations de remplissage d'eau O'land premium, standard et mini avec un écran numérique affichant l'horaire de l'événement et l'image des commanditaires"
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2. Water Stations We Offer */}
      <section id="stations" className="scroll-mt-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-steel">Stations d&rsquo;eau offertes</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Des stations d&rsquo;eau conçues pour les conditions réelles d&rsquo;un événement
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink/70">
              Choisissez parmi des stations de remplissage haute capacité et des points
              d&rsquo;hydratation compacts conçus pour les festivals, événements sportifs,
              activations corporatives, municipalités, lieux et expériences commanditées.
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
            <CtaButton href={QUOTE_PATH_FR} variant="blue">
              Aidez-moi à choisir une station
            </CtaButton>
          </div>
        </div>
      </section>

      {/* 3. Digital Screens Add-On */}
      <section className="bg-gradient-to-br from-steel to-ink text-white">
        <div className="mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8 lg:py-36">
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <p className="eyebrow text-sand">Option premium</p>
              <h2 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                Transformez chaque remplissage en visibilité pour vos commanditaires
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-white/85">
                Ajoutez des écrans numériques pour diffuser des messages de commanditaires, des
                horaires d&rsquo;événement, de la signalisation, du contenu sur la durabilité et
                des récits d&rsquo;impact. Contrairement à un affichage passif, les écrans sont
                rattachés à un service utile que les visiteurs consultent activement tout au long
                de l&rsquo;événement.
              </p>
            </div>
          </Reveal>

          <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:items-center">
            <Reveal className="reveal-left">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl ring-1 ring-inset ring-white/20">
                <Image
                  src="/images/our-solutions/digital-screen.png"
                  alt="Écran numérique d'une station de remplissage O'land affichant le logo O'land, prêt pour l'affichage des commanditaires et le contenu de l'événement"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
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
            <p className="eyebrow text-steel">Inclus avec chaque événement</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Un accompagnement avant, pendant et après votre événement
            </h2>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <Reveal className="reveal-left h-full">
              <div className="flex h-full flex-col rounded-3xl bg-white p-8 ring-1 ring-ink/10 sm:p-10">
                <p className="eyebrow text-teal">Rapports d&rsquo;impact</p>
                <h3 className="mt-3 text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
                  Un rapport d&rsquo;impact après chaque événement
                </h3>
                <p className="mt-4 text-base leading-relaxed text-ink/75">
                  Après chaque événement, O&rsquo;land fournit un rapport d&rsquo;impact indiquant
                  l&rsquo;eau distribuée, le nombre estimé de bouteilles évitées, le CO₂e évité et
                  les faits saillants d&rsquo;utilisation.
                </p>
                <p className="mt-6 text-xs font-bold uppercase tracking-widest text-steel">
                  Litres distribués · Bouteilles évitées · CO₂e évité · Faits saillants
                </p>
                <div className="mt-auto pt-7">
                  <CtaButton href="/fr/our-impact" variant="outline-blue">
                    En savoir plus sur les rapports d&rsquo;impact
                  </CtaButton>
                </div>
              </div>
            </Reveal>

            <Reveal className="reveal-right h-full">
              <div className="flex h-full flex-col rounded-3xl bg-white p-8 ring-1 ring-ink/10 sm:p-10">
                <p className="eyebrow text-blue">Entretien</p>
                <h3 className="mt-3 text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
                  Entretien et soutien
                </h3>
                <p className="mt-4 text-base leading-relaxed text-ink/75">
                  O&rsquo;land aide à garder les stations prêtes pour l&rsquo;événement grâce à des
                  conseils d&rsquo;installation, à l&rsquo;entretien de l&rsquo;équipement et à un
                  soutien adapté à vos besoins de location ou d&rsquo;achat.
                </p>
                <p className="mt-6 text-xs font-bold uppercase tracking-widest text-steel">
                  Conseils d&rsquo;installation · Entretien de l&rsquo;équipement · Soutien
                  événementiel
                </p>
                <div className="mt-auto pt-7">
                  <CtaButton href={QUOTE_PATH_FR} variant="outline-blue">
                    En savoir plus sur l&rsquo;entretien
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
            Prêt à planifier votre installation d&rsquo;hydratation?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/85">
            Parlez-nous de votre événement, de son emplacement, de l&rsquo;achalandage prévu et de
            vos objectifs. O&rsquo;land vous aidera à recommander la bonne configuration de
            station, les options d&rsquo;écran numérique et l&rsquo;approche de rapport
            d&rsquo;impact.
          </p>
          <div className="mt-8">
            <CtaButton href={QUOTE_PATH_FR} variant="coral">
              Demander une soumission
            </CtaButton>
          </div>
        </div>
      </section>
    </div>
  );
}
