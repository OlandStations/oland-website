"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";

type Partner = { name: string; alt: string; img: string };

// Filenames match the assets in /public/images/about/who-we-are/partners.
const partners: Partner[] = [
  {
    name: "Aqua Action",
    alt: "Aqua Action logo",
    img: "/images/about/who-we-are/partners/AquaAction.png",
  },
  {
    name: "Bye Bye Plastic",
    alt: "Bye Bye Plastic logo",
    img: "/images/about/who-we-are/partners/byebyeplastic.png",
  },
  {
    name: "BYO Bottle",
    alt: "BYO Bottle logo",
    img: "/images/about/who-we-are/partners/BYOBottle.png",
  },
  {
    name: "Champions of Change",
    alt: "Champions of Change logo",
    img: "/images/about/who-we-are/partners/ChampionsOfChange.png",
  },
  {
    name: "Green Sports",
    alt: "Green Sports logo",
    img: "/images/about/who-we-are/partners/GreenSports.png",
  },
  {
    name: "Live Music",
    alt: "Live Music logo",
    img: "/images/about/who-we-are/partners/LiveMusic.png",
  },
  {
    name: "RBC Canada",
    alt: "RBC Canada logo",
    img: "/images/about/who-we-are/partners/rbeCanada.png",
  },
];

// Tripled so the strip can be nudged back into the middle copy after any
// scroll without a jump cut — 1 visible on mobile, 2 on tablet, 4 on desktop.
const track3x = [...partners, ...partners, ...partners];

const AUTOPLAY_INTERVAL_MS = 3200;
const RECENTER_DELAY_MS = 450;

export default function PartnersCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const isHovering = useRef(false);

  const recenter = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const setWidth = track.scrollWidth / 3;
    if (track.scrollLeft >= setWidth * 2) track.scrollLeft -= setWidth;
    else if (track.scrollLeft <= 0) track.scrollLeft += setWidth;
  }, []);

  const step = useCallback(
    (direction: 1 | -1) => {
      const track = trackRef.current;
      if (!track) return;
      const item = track.firstElementChild as HTMLElement | null;
      const amount = (item?.offsetWidth ?? 280) + 24;
      track.scrollBy({ left: direction * amount, behavior: "smooth" });
      window.setTimeout(recenter, RECENTER_DELAY_MS);
    },
    [recenter]
  );

  // Start centered in the middle copy so both directions can loop.
  useEffect(() => {
    const track = trackRef.current;
    if (track) track.scrollLeft = track.scrollWidth / 3;
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (!isHovering.current) step(1);
    }, AUTOPLAY_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [step]);

  return (
    <div
      className="relative"
      onMouseEnter={() => (isHovering.current = true)}
      onMouseLeave={() => (isHovering.current = false)}
    >
      <button
        type="button"
        aria-label="Previous partners"
        onClick={() => step(-1)}
        className="absolute left-0 top-1/2 z-10 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-blue shadow-md ring-1 ring-ink/10 transition-transform hover:scale-105"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div ref={trackRef} className="flex gap-6 overflow-x-hidden px-1 py-2">
        {track3x.map((p, i) => (
          <div
            key={`${p.name}-${i}`}
            className="relative aspect-[3/2] w-full shrink-0 overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
          >
            <Image
              src={p.img}
              alt={p.alt}
              fill
              sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
              className="object-contain p-8"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-label="Next partners"
        onClick={() => step(1)}
        className="absolute right-0 top-1/2 z-10 flex h-11 w-11 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-blue shadow-md ring-1 ring-ink/10 transition-transform hover:scale-105"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
