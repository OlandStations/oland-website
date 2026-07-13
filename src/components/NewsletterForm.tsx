"use client";

import { useState } from "react";

// Newsletter signup. No provider is wired yet — see README TODO.
// On submit it just shows the same "Thank you!" confirmation the live site does.
export default function NewsletterForm({ dark = false }: { dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    // TODO: POST to a real newsletter provider (Mailchimp/HubSpot/etc.).
    setDone(true);
  }

  if (done) {
    return (
      <p className={dark ? "text-lg font-semibold text-white" : "text-lg font-semibold text-ink"}>
        Thank you!
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-8 flex max-w-md gap-3">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email address"
        className="flex-1 rounded-full border-0 bg-white px-6 py-3 text-ink outline-none placeholder:text-ink/40"
      />
      <button
        type="submit"
        className="rounded-full bg-teal px-8 py-3 font-bold text-white transition hover:bg-teal/90"
      >
        Register now
      </button>
    </form>
  );
}
