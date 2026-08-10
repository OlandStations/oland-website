"use client";

import { useRef } from "react";
import Image from "next/image";

// Current & previous client logos. Filenames match the assets in /public/images/homepage/clients.
const logos = [
  { src: "/images/homepage/clients/evenko-logo.png", alt: "Evenko" },
  { src: "/images/homepage/clients/tribu-logo.png", alt: "Tribu" },
  { src: "/images/homepage/clients/rbc-canadian-open-logo.png", alt: "RBC Canadian Open" },
  { src: "/images/homepage/clients/parc-olympique-logo.png", alt: "Parc Olympique" },
  {
    src: "/images/homepage/clients/quartier-de-spectacles.png",
    alt: "Quartier des spectacles Montréal",
  },
  { src: "/images/homepage/clients/mosaic-logo.png", alt: "Mosaic" },
  { src: "/images/homepage/clients/whitecap-entertainment-logo.png", alt: "Whitecap" },
  { src: "/images/homepage/clients/mural-logo.png", alt: "Mural" },
  { src: "/images/homepage/clients/jackalope-logo.png", alt: "Jackalope" },
  { src: "/images/homepage/clients/miller-group-logo.png", alt: "The Miller Group" },
  {
    src: "/images/homepage/clients/festival-international-jazz-logo.png",
    alt: "Festival International de Jazz de Montréal",
  },
  { src: "/images/homepage/clients/palais-des-congres-logo.png", alt: "Palais des congrès" },
  { src: "/images/homepage/clients/cpkc-logo.png", alt: "CPKC" },
  { src: "/images/homepage/clients/osheaga-logo.png", alt: "Osheaga" },
];

export default function LogoCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(direction: 1 | -1) {
    scrollRef.current?.scrollBy({ left: direction * 320, behavior: "smooth" });
  }

  return (
    <section className="bg-offwhite">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-2xl font-extrabold tracking-widest text-blue">
          CURRENT &amp; PREVIOUS CLIENTS
        </h2>

        <div className="relative">
          {/* Left arrow */}
          <button
            type="button"
            aria-label="Scroll to previous logos"
            onClick={() => scroll(-1)}
            className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-blue shadow-md transition-transform hover:scale-105"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Scroll container */}
          <div ref={scrollRef} className="flex items-center gap-16 overflow-x-hidden px-4 py-8">
            {logos.map((logo) => (
              <Image
                key={logo.src}
                src={logo.src}
                alt={logo.alt}
                height={56}
                width={160}
                className="shrink-0 object-contain grayscale opacity-60 transition duration-300 hover:grayscale-0 hover:opacity-100"
              />
            ))}
          </div>

          {/* Right arrow */}
          <button
            type="button"
            aria-label="Scroll to next logos"
            onClick={() => scroll(1)}
            className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-blue shadow-md transition-transform hover:scale-105"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
