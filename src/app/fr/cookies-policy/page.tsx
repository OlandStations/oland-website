import type { Metadata } from "next";
import { contact } from "@/lib/site";

// NOTE: AI-generated French translation — pending Rachel/Amelia review.
export const metadata: Metadata = {
  title: "Politique de cookies | O'land Stations",
  description:
    "Découvrez comment O'land Stations peut utiliser des cookies et des technologies similaires pour améliorer le fonctionnement du site, comprendre le trafic et soutenir les services intégrés.",
  alternates: {
    canonical: "/fr/cookies-policy",
    languages: {
      "en-CA": "/cookies-policy",
      "fr-CA": "/fr/cookies-policy",
    },
  },
};

export default function CookiesPolicyPageFr() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <p className="eyebrow text-steel">Mentions légales</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-blue sm:text-5xl">
        Politique de cookies
      </h1>
      <p className="mt-3 text-sm font-medium text-ink/50">Dernière mise à jour : août 2026</p>

      <div className="mt-10 space-y-10">
        <section>
          <h2 className="text-xl font-bold text-steel">Que sont les cookies?</h2>
          <p className="mt-3 text-base leading-relaxed text-ink/75">
            Les cookies sont de petits fichiers texte enregistrés sur votre appareil lorsque vous
            visitez un site Web. Ils aident les sites à bien fonctionner, à mémoriser vos
            préférences et à comprendre comment les visiteurs utilisent le site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-steel">Comment nous utilisons les cookies</h2>
          <p className="mt-3 text-base leading-relaxed text-ink/75">
            O&rsquo;land Stations peut utiliser des cookies et des technologies similaires pour
            améliorer le fonctionnement du site, comprendre le trafic du site Web et soutenir des
            services intégrés ou tiers tels que des formulaires et des outils d&rsquo;analyse.
            Certains de ces services peuvent installer leurs propres cookies lorsque vous
            interagissez avec eux.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-steel">Gestion des cookies</h2>
          <p className="mt-3 text-base leading-relaxed text-ink/75">
            Vous pouvez gérer ou désactiver les cookies en tout temps dans les paramètres de votre
            navigateur. La plupart des navigateurs vous permettent de bloquer ou de supprimer les
            cookies, ou de vous avertir avant qu&rsquo;un cookie ne soit enregistré. Notez que la
            désactivation des cookies peut affecter le fonctionnement de certaines parties de ce
            site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-steel">Des questions?</h2>
          <p className="mt-3 text-base leading-relaxed text-ink/75">
            Si vous avez des questions au sujet de cette politique, contactez-nous à{" "}
            <a href={`mailto:${contact.info}`} className="font-semibold text-coral hover:underline">
              {contact.info}
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
