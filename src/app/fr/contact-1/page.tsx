import type { Metadata } from "next";
import ContactFormFr from "@/components/ContactFormFr";
import { contact } from "@/lib/site";

// NOTE: AI-generated French translation — pending Rachel/Amelia review.
export const metadata: Metadata = {
  title:
    "Nous contacter | Restons en contact — Demander une soumission — Stations d'eau O'land pour événements",
  description:
    "Contactez O'land Water Stations pour des solutions événementielles et vos questions. Joignez-nous par téléphone ou courriel pour demander une soumission ou en savoir plus sur nos services.",
  alternates: {
    canonical: "/fr/contact-1",
    languages: {
      "en-CA": "/contact-1",
      "fr-CA": "/fr/contact-1",
    },
  },
};

export default function ContactPageFr() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-offwhite via-nearwhite to-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[22rem] w-[40rem] -translate-x-1/2 rounded-full bg-blue/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 right-[12%] -z-10 h-56 w-56 rounded-full bg-teal/15 blur-3xl"
        />
        <div className="mx-auto max-w-3xl px-4 pb-14 pt-20 sm:px-6 sm:pb-16 sm:pt-24 lg:px-8">
          <p className="eyebrow text-steel">Contact</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-blue sm:text-5xl">
            Restons en contact
          </h1>
          <a
            href={contact.phoneHref}
            className="mt-6 inline-block text-2xl font-bold text-coral hover:underline"
          >
            {contact.phone}
          </a>
        </div>
      </section>

      {/* Contact details */}
      <section className="mx-auto max-w-3xl px-4 pb-20 sm:px-6 lg:px-8">
        <dl className="space-y-8 border-t border-ink/10 pt-8">
          <div>
            <dt className="text-sm font-bold uppercase tracking-widest text-steel">
              Demande générale
            </dt>
            <dd className="mt-1">
              <a href={`mailto:${contact.info}`} className="text-lg text-ink hover:text-coral">
                {contact.info}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-bold uppercase tracking-widest text-steel">Marketing</dt>
            <dd className="mt-1">
              <a
                href={`mailto:${contact.marketing}`}
                className="text-lg text-ink hover:text-coral"
              >
                {contact.marketing}
              </a>
            </dd>
          </div>
        </dl>

        {/* Message form (mailto-based, no backend) */}
        <div className="mt-12 border-t border-ink/10 pt-8">
          <h2 className="text-sm font-bold uppercase tracking-widest text-steel">
            Envoyez-nous un message
          </h2>
          <ContactFormFr />
        </div>
      </section>
    </>
  );
}
