"use client";

import type { ReactNode } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

// Wrapper that fades/slides its children in when scrolled into view.
// Uses Intersection Observer (threshold 0.15, triggerOnce) via useScrollReveal.
//
//   <Reveal>…</Reveal>                      → fade up (default "reveal")
//   <Reveal className="reveal-left">…       → slide in from the left
//   <Reveal className="reveal-right">…      → slide in from the right
//   <Reveal delay="delay-200">…             → stagger with a Tailwind delay utility

type RevealProps = {
  children: ReactNode;
  /** Reveal variant (+ any extra utility classes), e.g. "reveal", "reveal-left h-full". */
  className?: string;
  /** Optional Tailwind transition-delay utility for staggering, e.g. "delay-100". */
  delay?: string;
};

export default function Reveal({ children, className = "reveal", delay = "" }: RevealProps) {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <div ref={ref} className={[className, delay].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}
