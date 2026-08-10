import type { Metadata } from "next";
import { contact } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cookies Policy | O'land Stations",
  description:
    "Learn how O'land Stations may use cookies and similar technologies to improve website functionality, understand traffic, and support embedded services.",
};

export default function CookiesPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <p className="eyebrow text-steel">Legal</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-blue sm:text-5xl">
        Cookies Policy
      </h1>
      <p className="mt-3 text-sm font-medium text-ink/50">Last updated: August 2026</p>

      <div className="mt-10 space-y-10">
        <section>
          <h2 className="text-xl font-bold text-steel">What are cookies?</h2>
          <p className="mt-3 text-base leading-relaxed text-ink/75">
            Cookies are small text files stored on your device when you visit a website. They help
            websites work properly, remember your preferences, and understand how visitors use the
            site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-steel">How we use cookies</h2>
          <p className="mt-3 text-base leading-relaxed text-ink/75">
            O&rsquo;land Stations may use cookies and similar technologies to improve website
            functionality, understand website traffic, and support embedded or third-party services
            such as forms and analytics. Some of these services may set their own cookies when you
            interact with them.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-steel">Managing cookies</h2>
          <p className="mt-3 text-base leading-relaxed text-ink/75">
            You can manage or disable cookies at any time through your browser settings. Most
            browsers let you block or delete cookies, or notify you before a cookie is stored.
            Please note that disabling cookies may affect how some parts of this website work.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-steel">Questions?</h2>
          <p className="mt-3 text-base leading-relaxed text-ink/75">
            If you have any questions about this policy, contact us at{" "}
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
