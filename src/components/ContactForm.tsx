"use client";

import { useState } from "react";
import { inquiryRouting, type InquiryType } from "@/lib/site";

const INQUIRY_OPTIONS: { value: InquiryType; label: string }[] = [
  { value: "general", label: "General Inquiry" },
  { value: "marketing", label: "Marketing" },
  { value: "troubleshooting", label: "Troubleshooting" },
];

// Small static-export-friendly contact form: no backend, no HubSpot.
// Submitting opens the visitor's email client via a prefilled mailto link,
// routed to the right O'land inbox based on the chosen inquiry type.
export default function ContactForm() {
  const [name, setName] = useState("");
  const [inquiryType, setInquiryType] = useState<InquiryType | "">("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [drafted, setDrafted] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !inquiryType || !subject.trim() || !message.trim()) return;

    const selected = INQUIRY_OPTIONS.find((o) => o.value === inquiryType);
    const routing = inquiryRouting[inquiryType];
    const body = `Inquiry Type: ${selected?.label ?? ""}\nName: ${name.trim()}\n\nMessage:\n${message.trim()}`;

    const params = [
      `subject=${encodeURIComponent(subject.trim())}`,
      `body=${encodeURIComponent(body)}`,
    ];
    if (routing.cc) params.push(`cc=${encodeURIComponent(routing.cc)}`);

    window.location.href = `mailto:${routing.to}?${params.join("&")}`;
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
          <span className="mb-1.5 block text-sm font-semibold text-ink/80">Inquiry type</span>
          <select
            required
            value={inquiryType}
            onChange={(e) => setInquiryType(e.target.value as InquiryType)}
            className={inputClasses}
          >
            <option value="" disabled>
              Select an inquiry type
            </option>
            {INQUIRY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="mt-4 block">
        <span className="mb-1.5 block text-sm font-semibold text-ink/80">Subject</span>
        <input
          type="text"
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className={inputClasses}
        />
      </label>
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
