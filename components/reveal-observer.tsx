"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Arms the scroll-reveal transitions for every `[data-reveal]` element on the
 * page, then unobserves each one as it lands.
 *
 * The hidden state is gated behind `data-reveal-armed` on <html>, which only
 * this component sets — so with JS unavailable the content renders plainly
 * visible instead of stuck at `opacity: 0`.
 *
 * Mounted once in the root layout, so it re-scans on every navigation rather
 * than only at first mount.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    // Already-revealed elements are skipped: on a client-side navigation the
    // incoming page's elements are the only ones still pending.
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(
        "[data-reveal]:not([data-revealed])",
      ),
    );
    if (targets.length === 0) return;

    const reveal = (element: Element) =>
      element.setAttribute("data-revealed", "");

    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      targets.forEach(reveal);
      return;
    }

    document.documentElement.setAttribute("data-reveal-armed", "");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
