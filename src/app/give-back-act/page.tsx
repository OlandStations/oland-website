import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Give Back Act — O'land water stations for events",
  description: "Learn about the O'land Stations Give Back Act.",
  // Not ready for V1: keep the route but don't index or promote it.
  robots: { index: false, follow: false },
};

export default function GiveBackActPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold tracking-tight text-blue sm:text-5xl">Give Back Act</h1>
      <p className="mx-auto mt-8 max-w-xl rounded-2xl bg-offwhite px-6 py-8 text-base text-ink/60">
        Details about our Give Back Act will be published here. (Content to be migrated.)
      </p>
    </div>
  );
}
