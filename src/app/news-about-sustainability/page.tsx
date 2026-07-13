import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News — O'land water stations for events",
  description:
    "Keep up to date on plastic pollution and what is going on to prevent it. News and stories from O'land Stations.",
};

export default function NewsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
      <p className="eyebrow text-steel">News</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">News</h1>
      <p className="mx-auto mt-5 max-w-xl text-lg text-ink/70">
        Keep up to date on plastic pollution and what is going on to prevent it.
      </p>
      <p className="mx-auto mt-8 max-w-xl rounded-2xl bg-offwhite px-6 py-8 text-base text-ink/60">
        Blog posts from the previous site will be migrated here soon. Check back shortly.
      </p>
    </div>
  );
}
