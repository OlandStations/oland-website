import type { Metadata } from "next";
import Image from "next/image";

// NOTE: AI-generated French translation — pending Rachel/Amelia review.
export const metadata: Metadata = {
  title: "Partenaires pour un monde sans plastique à usage unique — Stations d'eau O'land pour événements",
  description:
    "Partenaires dans notre mission : nous sommes fiers de collaborer avec plus de 70 événements au Canada et aux États-Unis. Ensemble, nous avons un impact significatif en réduisant les déchets plastiques et en promouvant la durabilité. Joignez-vous à nous pour créer un avenir plus propre et plus vert grâce à nos stations de remplissage d'eau innovantes.",
  alternates: {
    canonical: "/fr/partners",
    languages: {
      "en-CA": "/partners",
      "fr-CA": "/fr/partners",
    },
  },
};

const communityPartners = [
  {
    name: "Aqua Action",
    href: "https://aquaaction.org/",
    img: "/images/partners/aqua-action-logo.png",
  },
  {
    name: "Green Sports Alliance",
    href: "https://www.greensportsalliance.org/",
    img: "/images/partners/greensportsalliance.png",
  },
];

export default function PartnersPageFr() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="eyebrow text-steel">Mettre la durabilité en lumière</p>
        <h1 className="mt-3 text-4xl font-extrabold uppercase tracking-tight text-blue sm:text-6xl">
          Notre communauté
        </h1>
        <div className="mx-auto mt-12 grid max-w-2xl grid-cols-2 items-center gap-8">
          {communityPartners.map((p) => (
            <a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={p.name}
              className="block transition-transform hover:scale-[1.02]"
            >
              <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl bg-white ring-1 ring-ink/10">
                <Image
                  src={p.img}
                  alt={`Logo ${p.name}`}
                  fill
                  sizes="(min-width: 640px) 300px, 45vw"
                  className="object-contain p-6"
                />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Reuse playbook */}
      <section className="bg-offwhite">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">
                Nous faisons partie de ce guide de réutilisation
              </h2>
              <p className="mt-5 text-lg text-ink/80">
                Ce guide s&rsquo;adresse aux lieux d&rsquo;événements sportifs et de divertissement
                qui envisagent de passer du matériel à usage unique au matériel réutilisable.
              </p>
              <p className="mt-4 text-lg text-ink/80">
                Il guidera votre prise de décision en présentant les considérations de coûts, les
                avantages environnementaux, et fournira un cadre pour la transition vers cette
                pratique durable.
              </p>
              <a
                href="https://www.greensportsalliance.org/playbooks/reuse"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex items-center justify-center rounded-full bg-blue px-7 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-blue/90"
              >
                Télécharger maintenant
              </a>
            </div>
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-white ring-1 ring-inset ring-ink/10">
              <Image
                src="/images/partners/reusePlaybook.png"
                alt="Reuse Playbook"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Join forces + founder quote */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          Joignez vos forces aux nôtres pour créer un avenir meilleur, ensemble.
        </h2>
        <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
          <blockquote className="border-l-4 border-coral pl-6">
            <p className="text-2xl font-medium italic leading-relaxed text-ink">
              &laquo; Lorsque j&rsquo;ai lancé ce projet, je savais que je voulais trouver des
              partenaires sans compromis, prêts à s&rsquo;engager avec moi sur cette voie axée sur
              l&rsquo;impact. &raquo;
            </p>
            <footer className="mt-5 text-sm font-bold text-steel">
              Rachel Labbe-Bellas, fondatrice d&rsquo;O&rsquo;Land
            </footer>
          </blockquote>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl ring-1 ring-inset ring-ink/10">
            <Image
              src="/images/partners/LifeOnBoat.png"
              alt="Life on Boat"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>
    </>
  );
}
