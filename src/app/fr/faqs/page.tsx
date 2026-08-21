import type { Metadata } from "next";
import Image from "next/image";
import Accordion from "@/components/Accordion";

// NOTE: AI-generated French translation — pending Rachel/Amelia review.
export const metadata: Metadata = {
  title:
    "FAQ | Améliorez l'expérience de votre événement – En savoir plus — Stations d'eau O'land pour événements",
  description:
    "Découvrez les stations de remplissage d'eau O'land pour événements, leurs caractéristiques, leur installation et leurs options de personnalisation. Des solutions d'hydratation durables pour les grandes foules.",
  alternates: {
    canonical: "/fr/faqs",
    languages: {
      "en-CA": "/faqs",
      "fr-CA": "/fr/faqs",
    },
  },
};

const aboutItems = [
  {
    title: "Matériaux",
    content: (
      <p>
        Tous nos modèles sont fabriqués en acier galvanisé et en acier inoxydable pour une longue
        durée de vie et moins de déchets.
      </p>
    ),
  },
  {
    title: "Personnalisation",
    content: (
      <p>
        Tout commence avec l&rsquo;idée de rendre l&rsquo;eau potable durable, facile et agréable.
        C&rsquo;est pourquoi tous nos modèles sont personnalisables, vous permettant d&rsquo;imprimer
        des designs créés par votre propre événement ou commandités par les commanditaires de
        votre événement - vous pouvez même obtenir votre station gratuitement.
      </p>
    ),
  },
  {
    title: "Installation",
    content: (
      <p>
        <strong>La première station est installée par nous</strong> - nous formons et
        accompagnons votre personnel sur place lors de l&rsquo;installation de votre première
        station O&rsquo;land pour une intégration harmonieuse.
      </p>
    ),
  },
  {
    title: "Ce qui est inclus",
    content: (
      <p>
        Nous travaillons dans l&rsquo;objectif de réduire les déchets plastiques et c&rsquo;est
        pourquoi nous offrons notre &laquo; Forfait de performance à impact écologique &raquo; avec
        nos stations, où vous recevez un rapport d&rsquo;impact détaillant votre contribution à la
        réduction des déchets plastiques et à la réduction de l&rsquo;empreinte carbone, pour
        souligner votre engagement envers la durabilité.
      </p>
    ),
  },
  {
    title: "Pourquoi O'land",
    content: (
      <p>
        Tous nos modèles sont conçus pour les grandes foules, garantissant une installation facile
        et livrés entièrement assemblés. Nous visons à faciliter encore plus la transition vers un
        monde sans plastique à usage unique.
      </p>
    ),
  },
];

const faqItems = [
  {
    title:
      "Il n'y a aucun endroit parfaitement plat et de niveau pour l'installation. Puis-je quand même installer ma station d'eau?",
    content: (
      <p>
        Oui. Nous recommandons d&rsquo;installer la station sur une surface aussi plate et de
        niveau que possible. Toutefois, si cela n&rsquo;est pas possible, vous pouvez utiliser nos
        pieds ajustables pour niveler et stabiliser la station.
      </p>
    ),
  },
  {
    title: "Il n'y a pas de drains à proximité. Puis-je quand même installer ma station d'eau?",
    content: (
      <p>
        Oui. Idéalement, nous voulons envoyer l&rsquo;eau vers un drain, mais nous comprenons que
        ce n&rsquo;est pas toujours possible. Vous devez installer le tuyau de drainage et
        acheminer l&rsquo;eau loin de la station. Nous ne voulons pas laisser la station sans
        tuyau d&rsquo;eaux grises, car l&rsquo;eau des éviers s&rsquo;accumulera autour de la
        station et donnera l&rsquo;impression qu&rsquo;elle fuit. Acheminez le tuyau loin de la
        station, vers un drain, un fossé ou un espace inutilisé à proximité, etc.
      </p>
    ),
  },
  {
    title: "Combien de robinets par station?",
    content: (
      <p>
        Station standard : 6 robinets de remplissage de bouteilles d&rsquo;eau. Mini : 2 robinets
        de remplissage &amp; 2 fontaines à boire.
      </p>
    ),
  },
  {
    title: "Est-il possible d'avoir un affichage personnalisé?",
    content: (
      <p>
        La station est livrée avec l&rsquo;affichage O&rsquo;land gratuit (sans coût
        supplémentaire). Vous avez aussi l&rsquo;option de personnaliser votre affichage (6 côtés,
        3 panneaux par côté) moyennant des frais additionnels. Notez qu&rsquo;un délai doit être
        respecté pour l&rsquo;envoi de vos designs à imprimer et installer sur votre station avant
        la livraison. Vous pouvez aussi décider d&rsquo;afficher la station vous-même. Notez
        qu&rsquo;il est important d&rsquo;utiliser un matériau spécifique. Pour plus
        d&rsquo;informations sur les spécifications et le matériau, veuillez nous contacter.
      </p>
    ),
  },
  {
    title: "Est-il possible de personnaliser les parasols?",
    content: (
      <p>
        Les parasols sont fabriqués en plexiglas, qu&rsquo;il est possible d&rsquo;afficher si vous
        le souhaitez. Vous pouvez aussi commander des couleurs spécifiques de plexiglas (achat
        seulement). Contactez-nous pour plus d&rsquo;informations.
      </p>
    ),
  },
  {
    title: "Combien de côtés a la station",
    content: (
      <p>
        Standard : chaque station a 6 côtés. Chaque côté a 3 panneaux. Mini : 4 côtés avec 4
        robinets.
      </p>
    ),
  },
  {
    title: "Que trouve-t-on à l'intérieur de la station d'eau",
    content: (
      <p>
        L&rsquo;intérieur de la station abrite toute la plomberie, ainsi que le filtre à charbon,
        le compteur d&rsquo;eau et l&rsquo;antenne. Sur les stations avec refroidisseurs d&rsquo;eau,
        vous trouverez aussi les 3 refroidisseurs (station standard) ou 2 refroidisseurs (mini
        O&rsquo;land).
      </p>
    ),
  },
  {
    title: "Quelle taille/type de tuyaux sont nécessaires et sont-ils fournis?",
    content: (
      <p>
        Arrivée d&rsquo;eau : 5/8 po DI <strong>de qualité alimentaire (NSF)</strong>. Drain
        d&rsquo;eaux grises : 2 po DI (tuyau de contre-lavage robuste ou PVC avec tapis-câbles
        suggéré). Disponible à l&rsquo;achat. Pour les locations : possibilité de fournir un tuyau
        d&rsquo;arrivée de qualité alimentaire à coût additionnel. Le tuyau d&rsquo;eaux grises est
        fourni gratuitement (X pi, si vous en avez besoin de plus, vous devez nous en informer).
      </p>
    ),
  },
  {
    title:
      "Comment fonctionnent les refroidisseurs? Requièrent-ils un entretien et un remplissage constant?",
    content: (
      <p>
        Les refroidisseurs ont un réservoir séparé dont le niveau d&rsquo;eau doit être rempli et
        vérifié une fois par année. Ce réservoir n&rsquo;a aucun lien avec l&rsquo;eau qui sort des
        robinets pour la consommation. Cela signifie que vous ne manquerez jamais d&rsquo;eau
        froide et n&rsquo;avez pas à les remplir constamment. Pour fonctionner, les refroidisseurs
        doivent être remplis d&rsquo;eau ayant une concentration minérale entre 150 et 350 ppm et
        nécessitent un branchement électrique 120 V à 3 broches. Contactez-nous pour plus
        d&rsquo;informations.
      </p>
    ),
  },
  {
    title:
      "Nous avons perdu quelques boulons qui retiennent les panneaux/parasols. Quels boulons utiliser pour les remplacer?",
    content: (
      <p>
        Pour tout ce qui peut être retiré (panneaux, parasols, filtre d&rsquo;évier, etc.),
        utilisez : BOUTON À TÊTE BOMBÉE ZINC M-6 X 20. Pour les pièces structurelles, utilisez
        (selon la taille) : BOULON ZINC MÉTR. M-6*1,00*20 OU BOULON ZINC MÉTR. M-8*1,25*20.
      </p>
    ),
  },
  {
    title: "Nos supports de chariot élévateur sont lâches ou pendent sous la station. Que faire?",
    content: (
      <p>
        Chaque support de chariot élévateur est fixé sous la base de la station à l&rsquo;aide de 6
        BOULONS ZINC MÉTR. M-6*1,00*20 avec rondelle, insérés dans les inserts filetés sous la base
        de la station.
      </p>
    ),
  },
];

export default function FaqsPageFr() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Intro + about accordion + image */}
      <div className="grid items-start gap-10 lg:grid-cols-2">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-blue sm:text-5xl">FAQ</h1>
          <p className="mt-5 text-lg text-ink/75">
            Prenez un moment pour en apprendre davantage sur nos stations. À votre droite, vous
            trouverez les réponses aux questions fréquemment posées, avec plus de détails sous
            chaque section.
          </p>
          <div className="mt-8">
            <h2 className="mb-4 text-2xl font-bold text-steel">À propos de nos stations</h2>
            <Accordion items={aboutItems} />
          </div>
        </div>
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl ring-1 ring-inset ring-ink/10 lg:sticky lg:top-24">
          <Image
            src="/images/faq/IMG_5985.jpeg"
            alt="Une femme avec un chapeau de paille remplissant un gobelet rose à une station de remplissage d'eau avec une affiche « Banque Nationale », à l'extérieur avec d'autres personnes en arrière-plan."
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      {/* Full FAQ accordion */}
      <div className="mt-20">
        <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">FAQ</h2>
        <div className="mt-8 max-w-4xl">
          <Accordion items={faqItems} />
        </div>
      </div>
    </div>
  );
}
