import type { Metadata } from "next";
import Placeholder from "@/components/Placeholder";

export const metadata: Metadata = {
  title: "Partners for a world without single-use plastic — O'land water stations for events",
  description:
    "Partners in our mission: We're proud to collaborate with over 70 events across Canada and the USA. Together, we're making a significant impact by reducing plastic waste and promoting sustainability. Join us in creating a cleaner, greener future through our innovative water refill stations.",
};

const communityPartners = [
  { name: "Aqua Action", href: "https://aquaaction.org/", img: "partner-aqua-action.png" },
  {
    name: "Green Sports Alliance",
    href: "https://www.greensportsalliance.org/",
    img: "partner-green-sports-alliance.png",
  },
];

export default function PartnersPage() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="eyebrow text-steel">Shining a light on sustainability</p>
        <h1 className="mt-3 text-4xl font-extrabold uppercase tracking-tight text-ink sm:text-6xl">
          Our Community
        </h1>
        <div className="mx-auto mt-12 grid max-w-2xl grid-cols-2 items-center gap-8">
          {communityPartners.map((p) => (
            <a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={p.name}
              className="block transition-transform hover:scale-[1.02]"
            >
              <Placeholder
                alt={`${p.name} logo`}
                data-img={p.img}
                className="flex aspect-[3/2] w-full items-center justify-center bg-white"
              />
            </a>
          ))}
        </div>
      </section>

      {/* Reuse playbook */}
      <section className="bg-offwhite">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">
                We are part of this reuse playbook
              </h2>
              <p className="mt-5 text-lg text-ink/80">
                This playbook is for sports and entertainment event venues considering transitioning
                from single-use to reusable service ware.
              </p>
              <p className="mt-4 text-lg text-ink/80">
                It will guide your decision-making by outlining cost considerations plus
                environmental benefits and provide a framework for transitioning to this sustainable
                practice.
              </p>
              <a
                href="https://www.greensportsalliance.org/playbooks/reuse"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex items-center justify-center rounded-full bg-coral px-7 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-coral/90"
              >
                Download now
              </a>
            </div>
            <Placeholder
              alt="Promotion for the reusable playbook by O'land, featuring a quote from Rachel Labbe-Bellas about transitioning to a circular economy, with a background of green reusable cups and a logo for o'land fill station."
              data-img="reuse-playbook-graphic.png"
              className="aspect-[4/3] w-full"
            />
          </div>
        </div>
      </section>

      {/* Join forces + founder quote */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          Join forces with us to create a brighter tomorrow together.
        </h2>
        <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
          <blockquote className="border-l-4 border-coral pl-6">
            <p className="text-2xl font-medium italic leading-relaxed text-ink">
              &ldquo;When I started this project, I knew I wanted to find uncompromising partners who
              would be dedicated to walk the walk with me, grow an impact-focused path.&rdquo;
            </p>
            <footer className="mt-5 text-sm font-bold text-steel">
              Rachel Labbe-Bellas, Founder of O&rsquo;Land
            </footer>
          </blockquote>
          <Placeholder
            alt="O'land founder aboard a research expedition"
            data-img="life-on-boat.png"
            className="aspect-[4/3] w-full"
          />
        </div>
      </section>
    </>
  );
}
