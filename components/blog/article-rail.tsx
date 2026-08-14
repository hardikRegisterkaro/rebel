"use client";

import { useEffect, useState } from "react";

/**
 * The sticky "On this page" rail: the article's headings, the one currently
 * being read, and how far through the reader is.
 *
 * The headings are passed in from the server — they are extracted alongside the
 * ids injected into the body, so the rail and the anchors can never disagree.
 * Only the two live bits (which heading is active, how far down the page) need
 * the browser.
 */
export function ArticleRail({
  headings,
}: {
  headings: { id: string; text: string; level: 2 | 3 }[];
}) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? "");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (headings.length === 0) return;

    const article = document.getElementById("article-body");

    /**
     * Both values come from one scroll handler rather than an
     * IntersectionObserver plus a second listener: they answer the same
     * question, and a single rAF-throttled read of the layout is cheaper than
     * two independent ones.
     */
    let frame = 0;
    const update = () => {
      frame = 0;

      // Progress through the article itself, not the whole document — the
      // header, the related posts and the footer are not part of the read.
      if (article) {
        const { top, height } = article.getBoundingClientRect();
        const scrolled = -top + window.innerHeight * 0.5;
        const ratio = height > 0 ? scrolled / height : 0;
        setProgress(Math.min(100, Math.max(0, Math.round(ratio * 100))));
      }

      // The active heading is the last one whose top has passed a third of the
      // viewport — the point where a reader's eye actually is, rather than the
      // very top of the screen.
      const threshold = window.innerHeight / 3;
      let current = headings[0]?.id ?? "";
      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (element && element.getBoundingClientRect().top <= threshold) {
          current = heading.id;
        }
      }
      setActiveId(current);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav
      aria-label="On this page"
      className="rounded-[18px] border border-white/[0.08] bg-ink-600 p-6"
    >
      <p className="mb-4 font-mono text-[0.62rem] tracking-[0.18em] text-dark-muted uppercase">
        On this page
      </p>

      <ul className="flex flex-col gap-0.5 border-l border-white/[0.1]">
        {headings.map((heading) => {
          const active = heading.id === activeId;
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                aria-current={active ? "location" : undefined}
                className={`-ml-px block border-l-2 py-2 text-[0.9rem] leading-snug transition-colors duration-200 ${
                  heading.level === 3 ? "pr-3 pl-7" : "pr-3 pl-4"
                } ${
                  active
                    ? "border-brand font-medium text-dark-fg"
                    : "border-transparent text-dark-fg-3 hover:text-dark-fg"
                }`}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>

      <div className="mt-5 flex items-center gap-3 border-t border-white/[0.08] pt-4">
        <div
          role="progressbar"
          aria-label="Reading progress"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/[0.12]"
        >
          <div
            className="h-full rounded-full bg-brand transition-[width] duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="font-mono text-[0.62rem] tracking-[0.06em] text-dark-muted tabular-nums">
          {progress}%
        </span>
      </div>
    </nav>
  );
}
