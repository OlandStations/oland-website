"use client";

import { useEffect, useRef } from "react";

// Returns a ref to attach to any element.
// When the element enters the viewport, it adds the class 'revealed'.
// Use with the CSS classes (.reveal / .reveal-left / .reveal-right) for fade-up animations.

type UseScrollRevealOptions = {
  /** How much of the element must be visible before revealing (0–1). */
  threshold?: number;
  /** Reveal only once, then stop observing. */
  triggerOnce?: boolean;
  /** Optional IntersectionObserver rootMargin. */
  rootMargin?: string;
};

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.15,
  triggerOnce = true,
  rootMargin = "0px",
}: UseScrollRevealOptions = {}) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Graceful fallback (SSR / very old browsers): reveal immediately.
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("revealed");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            if (triggerOnce) observer.unobserve(entry.target);
          } else if (!triggerOnce) {
            entry.target.classList.remove("revealed");
          }
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, triggerOnce, rootMargin]);

  return ref;
}

export default useScrollReveal;
