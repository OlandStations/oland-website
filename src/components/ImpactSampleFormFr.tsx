"use client";

import { useState } from "react";

// French copy of ImpactSampleForm — same static lead-capture + Canva
// redirect logic. Kept as a separate component so the English version stays
// untouched.
// NOTE: AI-generated French translation — pending Rachel/Amelia review.
const CANVA_SAMPLE_URL =
  "https://www.canva.com/design/DAGHdZx6Wdc/A6xgYuaudRIv9pddmxj4OQ/view?utm_content=DAGHdZx6Wdc&utm_campaign=designshare&utm_medium=link&utm_source=viewer";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
};

const EMPTY: FormData = { firstName: "", lastName: "", email: "" };

export default function ImpactSampleFormFr() {
  const [data, setData] = useState<FormData>(EMPTY);
  const [done, setDone] = useState(false);

  const set = (patch: Partial<FormData>) => setData((d) => ({ ...d, ...patch }));

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    window.open(CANVA_SAMPLE_URL, "_blank", "noopener,noreferrer");
    setDone(true);
  }

  if (done) {
    return (
      <div className="mt-8" aria-live="polite">
        <p className="text-lg font-semibold text-white">
          Merci! Votre échantillon d&rsquo;impact s&rsquo;est ouvert dans un nouvel onglet.
        </p>
        <a
          href={CANVA_SAMPLE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center justify-center rounded-full bg-coral px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-coral/90"
        >
          Ouvrir l&rsquo;échantillon d&rsquo;impact
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-8 max-w-xl text-left">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-white/80">Prénom</span>
          <input
            type="text"
            required
            value={data.firstName}
            onChange={(e) => set({ firstName: e.target.value })}
            autoComplete="given-name"
            className="w-full rounded-xl border-2 border-white/30 bg-white/10 px-4 py-3 text-lg text-white outline-none placeholder:text-white/50 [color-scheme:dark] focus:border-white"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-white/80">Nom de famille</span>
          <input
            type="text"
            required
            value={data.lastName}
            onChange={(e) => set({ lastName: e.target.value })}
            autoComplete="family-name"
            className="w-full rounded-xl border-2 border-white/30 bg-white/10 px-4 py-3 text-lg text-white outline-none placeholder:text-white/50 [color-scheme:dark] focus:border-white"
          />
        </label>
      </div>
      <label className="mt-4 block">
        <span className="mb-1.5 block text-sm font-semibold text-white/80">Courriel</span>
        <input
          type="email"
          required
          value={data.email}
          onChange={(e) => set({ email: e.target.value })}
          autoComplete="email"
          className="w-full rounded-xl border-2 border-white/30 bg-white/10 px-4 py-3 text-lg text-white outline-none placeholder:text-white/50 [color-scheme:dark] focus:border-white"
        />
      </label>
      <div className="mt-6 text-center sm:text-left">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-coral px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-coral/90"
        >
          Obtenir mon échantillon
        </button>
      </div>
    </form>
  );
}
