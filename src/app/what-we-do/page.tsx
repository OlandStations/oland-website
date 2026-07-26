import type { Metadata } from "next";
import Image from "next/image";
import Placeholder from "@/components/Placeholder";
import CtaButton from "@/components/CtaButton";
import PartnersCarousel from "@/components/PartnersCarousel";

export const metadata: Metadata = {
  title: "About Us — O'land water stations for events",
  description:
    "Join our mission as passionate environmental advocates and plastic pollution warriors. Since 2019, we've led initiatives to protect oceans and reduce plastic waste. Serving major festivals in Canada and the USA, we provide fresh water and cut carbon footprints with our refill stations. Our goal: a world without single-use plastic.",
};

type TeamMember = { name: string; role: string; alt: string; img?: string };

const team: TeamMember[] = [
  {
    name: "Rachel Labbe-Bellas",
    role: "FOUNDER & CEO",
    alt: "Rachel Labbe-Bellas, O'land team member",
    img: "/images/about/who-we-are/team/rachel.jpg",
  },
  {
    name: "Francis De Courval",
    role: "CHIEF OPERATIONS OFFICER",
    alt: "Francis De Courval, O'land team member",
    img: "/images/about/who-we-are/team/Francis.jpg",
  },
  {
    name: "Maria Munarini",
    role: "MARKETING DIRECTOR",
    alt: "Maria Munarini, O'land team member",
    img: "/images/about/who-we-are/team/Maria.jpg",
  },
  {
    name: "Amélia Morgan",
    role: "Production & Operations Manager",
    alt: "Amélia Morgan, O'land team member",
    img: "/images/about/who-we-are/team/Amelia.jpg",
  },
  {
    name: "Marc Decelles",
    role: "PRODUCT DESIGN",
    alt: "Marc Decelles, O'land team member",
    img: "/images/about/who-we-are/team/MarcDecelles.jpg",
  },
  {
    name: "Daniel",
    role: "OPERATIONS ASSISTANCE",
    alt: "Daniel, O'land team member",
    img: "/images/about/who-we-are/team/Daniel.jpg",
  },
];

export default function WhatWeDoPage() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="max-w-4xl text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl">
          We are a Benefit Corporation of passionate plastic pollution warriors.
        </h1>
        <div className="mt-10 grid items-center gap-10 lg:grid-cols-2">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl">
            <Image
              src="/images/about/who-we-are/story/WhoWeAre1.jpeg"
              alt="Person drinking from an O'land refill station"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <p className="text-lg leading-relaxed text-ink/80">
            Who have been leading initiatives to preserve the oceans and protect ourselves from
            plastic pollution since 2019. We have been at the forefront of almost all major festivals
            in Canada and in the USA, <strong>providing fresh water</strong> to the crowds and
            reducing our carbon footprint through our refill stations. Being a Benefit Corporation
            isn&rsquo;t just about profits; it&rsquo;s about <strong>purpose</strong> – that leads us:
          </p>
        </div>
      </section>

      {/* Blue band */}
      <section className="relative bg-blue text-white">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <p className="eyebrow text-white/80">Our cause is timeless</p>
          <h2 className="mt-3 text-3xl font-extrabold uppercase tracking-tight sm:text-5xl">
            Create a world without single-use plastic
          </h2>
        </div>
      </section>

      {/* Green shift */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            We are helping your company make the green shift easy, beautiful, and fun.
          </h2>
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
            <Image
              src="/images/about/who-we-are/story/WhoWeAre2.png"
              alt="Branded O'land refill station at an outdoor event"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Owned and operated */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl">
            <Image
              src="/images/about/who-we-are/story/WhoWeAre3.gif"
              alt="Person rock climbing outdoors"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Owned and operated by nature lovers
            </h2>
            <p className="mt-5 text-lg text-ink/80">
              We are an independent water station company, created to reduce single-use plastic at
              the source. In a market saturated with brands owned by big corporate chasing maximum
              profit over the planet, O&rsquo;land is dedicated to making the best possible to stop
              plastic bottles at source and we believe that when we live the nature we protect it.
            </p>
            <div className="mt-7">
              <CtaButton href="/read-me" variant="coral">
                Read a message from our founder
              </CtaButton>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="bg-offwhite">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Meet the Team
          </h2>
          <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-3">
            {team.map((m) =>
              m.img ? (
                <div key={m.name} className="text-center">
                  <div className="relative mx-auto aspect-square w-full max-w-[220px] overflow-hidden rounded-2xl">
                    <Image
                      src={m.img}
                      alt={m.alt}
                      fill
                      sizes="220px"
                      className="object-cover"
                    />
                  </div>
                  <h3 className="mt-4 text-lg font-extrabold text-ink">{m.name}</h3>
                  <p className="mt-1 text-xs font-bold uppercase tracking-widest text-steel">
                    {m.role}
                  </p>
                </div>
              ) : (
                <div key={m.name} className="text-center">
                  <Placeholder
                    alt={m.alt}
                    data-img={`team-${m.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.jpg`}
                    className="mx-auto aspect-square w-full max-w-[220px]"
                  />
                  <h3 className="mt-4 text-lg font-extrabold text-ink">{m.name}</h3>
                  <p className="mt-1 text-xs font-bold uppercase tracking-widest text-steel">
                    {m.role}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Our partners */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="eyebrow text-center text-steel">Our Partners</p>
        <div className="mt-10">
          <PartnersCarousel />
        </div>
      </section>
    </>
  );
}
