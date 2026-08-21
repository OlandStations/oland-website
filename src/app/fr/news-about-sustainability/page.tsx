import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Reveal from "@/components/Reveal";

// NOTE: AI-generated French translation — pending Rachel/Amelia review.
export const metadata: Metadata = {
  title: "Actualités et mises à jour sur la durabilité | O'land Stations",
  description:
    "Actualités durabilité d'O'land Stations : systèmes de réutilisation, réduction des déchets plastiques et hydratation événementielle. Lisez nos dernières mentions, articles et jalons, y compris notre partenariat avec Green Sports Alliance.",
  alternates: {
    canonical: "/fr/news-about-sustainability",
    languages: {
      "en-CA": "/news-about-sustainability",
      "fr-CA": "/fr/news-about-sustainability",
    },
  },
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
    eyebrow: "Guide de réutilisation avec Green Sports Alliance",
    title:
      "Guide complet pour la mise en œuvre de systèmes de réutilisation dans les lieux d'événements sportifs et de divertissement",
    cta: "Télécharger",
    ctaHref: "https://www.greensportsalliance.org/playbooks/reuse",
    ctaAriaLabel: "Télécharger le guide de réutilisation de Green Sports Alliance",
    imageHref:
      "https://www.greensportsalliance.org/press/comprehensive-guide-to-implementing-reuse-systems-in-sports-and-entertainment-venues-green-sports-alliance-releases-reuse-playbook",
    imageAriaLabel: "Lire l'annonce de Green Sports Alliance sur le guide de réutilisation",
    img: "/images/news/reuse-playbook.webp",
    alt: "Reuse PlayBook 2024 - O'land Stations en tant que co-auteure et histoires de réussite couvertes dans ce rapport.",
    fit: "contain",
  },
  {
    eyebrow: "Série",
    title: "Femmes inspirantes en durabilité",
    body: (
      <>
        Bienvenue dans la série <em>Femmes inspirantes en durabilité</em>. Pour lancer cette
        série, nous mettons en lumière une véritable pionnière de la conservation des océans — un
        nom synonyme de défense marine : <strong>Sylvia Earle</strong>.
      </>
    ),
    cta: "Lire plus",
    ctaHref:
      "https://www.linkedin.com/pulse/inspirational-women-sustainability-sylvia-earle-oland-stations-xsbrf/?trackingId=Mv0rXUIKEDIe3cZ1MjyHDg%3D%3D",
    ctaAriaLabel: "Lire l'article sur Sylvia Earle dans la série Femmes inspirantes en durabilité, sur LinkedIn",
    img: "/images/news/sylvia-earle.webp",
    alt: "Citation sur fond bleu avec une photo en noir et blanc de Sylvia Earle souriante, où l'on peut lire : « Nous devons respecter les océans et en prendre soin comme si notre vie en dépendait. Parce que c'est le cas. »",
    fit: "contain",
  },
  {
    eyebrow: "Jalon",
    title: "Ensemble, nous avons fait l'histoire!",
    body: <>Plus de 100 000 tonnes métriques d&rsquo;émissions de CO2e évitées</>,
    cta: "Lire plus",
    ctaHref:
      "https://www.linkedin.com/pulse/together-weve-made-history-oland-stations-7radf/?trackingId=hH3JH7aWTgeh3wfwHMv8GQ%3D%3D",
    ctaAriaLabel: "Lire l'article sur notre jalon d'émissions évitées, sur LinkedIn",
    img: "/images/news/impact-report.webp",
    alt: "Personne tenant un rapport d'impact coloré intitulé « Impact Mollion » avec un collage de photos sur la couverture, assise sur un plancher de bois, portant un chandail tricoté gris et un jean bleu.",
    fit: "cover",
  },
  {
    eyebrow: "Balado",
    title: "Nous étions invités sur Resilient Earth Radio.",
    body: <>Écouter ici</>,
    cta: "Cliquez ici",
    ctaHref:
      "https://open.spotify.com/episode/10OKdByfDDC6i1jyBt7gH5?si=bf015cae82304d63&nd=1&dlsi=f7a0e30632fb4aca",
    ctaAriaLabel: "Écouter notre épisode de Resilient Earth Radio sur Spotify",
    img: "/images/news/resilient-earth-radio.webp",
    alt: "Pochette de Resilient Earth Radio & Podcast, avec une image de la Terre tenue par une main, le titre et le sous-titre du balado, et le logo d'O'land Fill Station.",
    fit: "contain",
  },
];

export default function NewsPageFr() {
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
          <p className="eyebrow text-steel">Actualités</p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-blue sm:text-6xl">
            Des nouvelles pour un avenir plus vert
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink/70 sm:text-xl">
            Consultez notre fil d&rsquo;actualités et nos dernières mentions
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
              aria-label="Lire le communiqué de presse : O'land Stations et Green Sports Alliance s'associent pour lutter contre la pollution plastique"
              className="flex items-center justify-center bg-gradient-to-br from-blue/10 via-teal/10 to-offwhite p-6 sm:p-10"
            >
              <div className="relative aspect-square w-full max-w-md">
                <Image
                  src="/images/news/gsa-5-million-refills.webp"
                  alt="Annonce du partenariat de remplissage de bouteilles avec Green Sports Alliance"
                  fill
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  className="object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
            </a>
            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
              <span className="inline-flex w-fit items-center rounded-full bg-coral/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-coral">
                À la une
              </span>
              <p className="eyebrow mt-5 text-steel">Créer un monde sans plastique à usage unique</p>
              <h2
                id="featured-story"
                className="mt-4 text-2xl font-extrabold leading-snug tracking-tight text-ink sm:text-3xl"
              >
                O&rsquo;land Stations et Green Sports Alliance s&rsquo;associent pour lutter contre
                la pollution plastique, visant à remplir 5 millions de bouteilles d&rsquo;ici la fin
                de 2025.
              </h2>
              <div className="mt-8">
                <a
                  href={pressReleaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-blue px-7 py-3 text-sm font-bold uppercase tracking-wide text-white transition-all duration-200 hover:bg-blue/90 hover:shadow-md"
                >
                  Lire le communiqué de presse
                </a>
              </div>
            </div>
          </article>
        </Reveal>
      </section>

      {/* Newsfeed grid */}
      <section aria-labelledby="newsfeed-heading" className="bg-offwhite">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <p className="eyebrow text-steel">Fil d&rsquo;actualités</p>
          <h2
            id="newsfeed-heading"
            className="mt-3 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl"
          >
            Dernières mentions et articles
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
                  &laquo; Notre passé, notre présent, et tout ce qui reste de notre avenir,
                  dépendent absolument de ce que nous faisons maintenant. &raquo;
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
