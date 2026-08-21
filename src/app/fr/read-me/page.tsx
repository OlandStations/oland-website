import type { Metadata } from "next";
import Image from "next/image";

// NOTE: AI-generated French translation — pending Rachel/Amelia review.
export const metadata: Metadata = {
  title:
    "Une lettre de notre fondatrice | Joignez le mouvement – Réduisez le plastique dès aujourd'hui — Stations d'eau O'land pour événements",
  description:
    "Découvrez la mission d'O'land Water Stations d'éliminer les plastiques à usage unique, avec le message de notre fondatrice et nos initiatives à impact pour un avenir durable.",
  alternates: {
    canonical: "/fr/read-me",
    languages: {
      "en-CA": "/read-me",
      "fr-CA": "/fr/read-me",
    },
  },
};

export default function ReadMePageFr() {
  return (
    <>
      {/* Hero */}
      <section className="relative">
        <div className="relative aspect-[16/7] w-full overflow-hidden">
          <Image
            src="/images/founders-letter/founders-letter-banner.jpg"
            alt="Image de bannière de la lettre de la fondatrice"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 lg:px-8">
          <p className="eyebrow text-steel">Notre cause est intemporelle</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-blue sm:text-5xl">
            Créer un monde sans plastique à usage unique
          </h1>
          <div className="relative mx-auto mt-8 aspect-square w-48 overflow-hidden rounded-full shadow-lg ring-4 ring-white sm:w-56 lg:w-64">
            <Image
              src="/images/founders-letter/rachel.jpeg"
              alt="Rachel, fondatrice d'O'land Stations"
              fill
              sizes="(min-width: 1024px) 256px, (min-width: 640px) 224px, 192px"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Letter */}
      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-xl font-bold text-steel">
            Une lettre de Rachel Labbe-Bellas, notre fondatrice -{" "}
            <em className="font-medium">créer un monde sans plastique à usage unique</em>.
          </h2>

          <blockquote className="mt-8 space-y-5 border-l-4 border-coral pl-6 text-lg leading-relaxed text-ink/85">
            <p className="font-bold">Chère communauté,</p>
            <p>
              Aujourd&rsquo;hui, je tiens à partager une réflexion sur le parcours que nous avons
              entrepris ensemble en tant que communauté unie autour d&rsquo;une vision commune – la
              création d&rsquo;un monde libéré des plastiques à usage unique.
            </p>
            <p>
              En tant que fondatrice d&rsquo;O&rsquo;land, je suis immensément fière des progrès que
              nous avons accomplis dans notre mission. Chaque réussite, qu&rsquo;il s&rsquo;agisse de
              réduire un million de bouteilles de plastique, d&rsquo;élargir nos services vers de
              nouveaux horizons, ou de voir grandir notre équipe dévouée, s&rsquo;apparente à
              dévoiler un nouveau morceau de l&rsquo;iceberg. Avec chaque succès, la vision de notre
              quête collective devient plus claire, non seulement pour moi, mais pour nous tous.
            </p>
            <p>
              Notre cause est plus qu&rsquo;un engagement; elle témoigne de notre endurance, de
              notre résilience et de notre dévouement intemporel. L&rsquo;objectif de créer un
              monde sans plastique à usage unique n&rsquo;est pas qu&rsquo;une ambition élevée;
              c&rsquo;est un appel à l&rsquo;action que nous embrassons chaque jour. Chaque pas que
              nous faisons est une avancée significative vers la réalisation de notre vision.
              Toutefois, gardons à l&rsquo;esprit que, malgré nos réussites, une grande partie du
              défi reste à explorer.
            </p>
            <p>
              Notre parcours vers une planète durable se poursuit. Nous comprenons que, bien que
              nous ayons atteint des jalons importants, le chemin vers un monde libéré du plastique
              à usage unique est loin d&rsquo;être achevé. Pourtant, c&rsquo;est précisément ce défi
              continu qui alimente notre détermination et approfondit notre engagement.
            </p>
            <p>
              Ensemble, en tant que communauté unie, nous poursuivons notre mission de préserver
              notre environnement pour le bien-être des générations actuelles et futures. Nous
              sommes à l&rsquo;avant-garde du changement, portés par la conviction que nos efforts
              collectifs laisseront un impact durable sur le monde, que ce soit avec nos stations
              d&rsquo;eau ou d&rsquo;autres produits à venir.
            </p>
            <p>
              De plus, je suis ravie d&rsquo;annoncer notre objectif ambitieux pour 2025 : atteindre
              le jalon de 5 millions de bouteilles de plastique évitées. Cet objectif témoigne de
              notre engagement indéfectible envers notre cause et reflète notre détermination à
              faire une réelle différence dans la lutte contre le plastique à usage unique. Un
              grand merci à{" "}
              <a
                href="https://www.greensportsalliance.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-coral underline"
              >
                Green Sports Alliance
              </a>{" "}
              de s&rsquo;être joint à nous dans ce parcours porteur d&rsquo;impact.
            </p>
            <p>
              Merci de faire partie intégrante de ce parcours. Votre dévouement, votre passion et
              votre soutien nous font avancer. Je suis convaincue qu&rsquo;avec notre collaboration
              continue, nous saurons non seulement naviguer ces eaux inexplorées, mais aussi
              inspirer d&rsquo;autres à se joindre à nous pour créer un monde sans plastique à usage
              unique.
            </p>
            <p>Avec gratitude et détermination,</p>
            <p className="font-bold italic">Rachel Labbe-Bellas,</p>
            <p className="font-bold italic">Fondatrice d&rsquo;O&rsquo;land Stations</p>
            <p className="font-bold italic">Janvier 2024</p>
          </blockquote>
        </div>
      </section>

      {/* Logo */}
      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
        <Image
          src="/images/shared/brand/oland-site-icon-blue.png"
          alt="Logo d'O'land Stations"
          width={200}
          height={200}
          className="mx-auto h-auto w-40 sm:w-48"
        />
      </section>

      {/* Closing */}
      <section className="bg-offwhite">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Cela nous touche aux larmes,
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-ink/75">
            Et nous espérons que ce témoignage résonne en vous aussi profondément qu&rsquo;en nous.
            Ressentir la vérité sincère derrière notre existence à travers les mots de notre
            fondatrice nous aide à comprendre pourquoi le remplissage est une nécessité pour le
            monde, et par conséquent, pour votre événement.
          </p>
        </div>
      </section>
    </>
  );
}
