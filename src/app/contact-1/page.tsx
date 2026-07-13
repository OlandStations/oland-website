import type { Metadata } from "next";
import Placeholder from "@/components/Placeholder";
import { contact } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact | Connect Today — Request a Quote — O'land water stations for events",
  description:
    "Contact O'land Water Stations for event solutions and inquiries. Reach us via phone or email to get a quote or learn more about our services.",
};

export default function ContactPage() {
  return (
    <>
      <Placeholder
        alt=""
        data-img="contact-hero-ocean.jpeg"
        rounded={false}
        className="aspect-[16/6] w-full"
      />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">Get in touch</h1>

        <a
          href={contact.phoneHref}
          className="mt-6 inline-block text-2xl font-bold text-coral hover:underline"
        >
          {contact.phone}
        </a>

        <dl className="mt-10 space-y-8 border-t border-ink/10 pt-8">
          <div>
            <dt className="text-sm font-bold uppercase tracking-widest text-steel">
              General Inquiry
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
      </section>
    </>
  );
}
