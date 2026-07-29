import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Partners for a world without single-use plastic — O'land water stations for events",
  description:
    "Partners in our mission: We're proud to collaborate with over 70 events across Canada and the USA. Together, we're making a significant impact by reducing plastic waste and promoting sustainability. Join us in creating a cleaner, greener future through our innovative water refill stations.",
};

const communityPartners = [
  {
    name: "Aqua Action",
    href: "https://aquaaction.org/",
    img: "/images/partners/aqua-action-logo.png",
  },
  {
    name: "Green Sports Alliance",
    href: "https://www.greensportsalliance.org/",
    img: "/images/partners/greensportsalliance.png",
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
              <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl bg-white ring-1 ring-ink/10">
                <Image
                  src={p.img}
                  alt={`${p.name} logo`}
                  fill
                  sizes="(min-width: 640px) 300px, 45vw"
                  className="object-contain p-6"
                />
              </div>
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
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-white ring-1 ring-inset ring-ink/10">
              <Image
                src="/images/partners/reusePlaybook.png"
                alt="Reuse Playbook"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-contain"
              />
            </div>
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
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl ring-1 ring-inset ring-ink/10">
            <Image
              src="/images/partners/LifeOnBoat.png"
              alt="Life on Boat"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>
    </>
  );
}
