"use client";

import { useState } from "react";
import { contact } from "@/lib/site";

// Small static-export-friendly contact form: no backend, no HubSpot.
// Submitting opens the visitor's email client via a prefilled mailto link.
export default function ContactForm() {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [drafted, setDrafted] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !subject.trim() || !message.trim()) return;
    const body = `Name: ${name.trim()}\n\nMessage:\n${message.trim()}`;
    window.location.href = `mailto:${contact.info}?subject=${encodeURIComponent(
      subject.trim(),
    )}&body=${encodeURIComponent(body)}`;
    setDrafted(true);
  }

  const inputClasses =
    "w-full rounded-xl border-2 border-ink/15 bg-white px-4 py-3 text-base text-ink outline-none transition-colors placeholder:text-ink/40 focus:border-blue";

  return (
    <form onSubmit={onSubmit} className="mt-6 max-w-xl" noValidate={false}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink/80">Name</span>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            className={inputClasses}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink/80">Subject</span>
          <input
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className={inputClasses}
          />
        </label>
      </div>
      <label className="mt-4 block">
        <span className="mb-1.5 block text-sm font-semibold text-ink/80">Message</span>
        <textarea
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`${inputClasses} resize-y`}
        />
      </label>
      <div className="mt-6">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-blue px-8 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-blue/90"
        >
          Send message
        </button>
      </div>
      <p aria-live="polite" className="mt-4 text-sm font-medium text-steel">
        {drafted &&
          "Your email draft is ready. Please send it from your email client so our team receives your message."}
      </p>
    </form>
  );
}
