import Link from "next/link";

import { MazeCanvas } from "@/components/maze-canvas";
import { HERO } from "@/lib/content";

export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      // The sticky header already occupies ~78px of flow above this, so the
      // mobile top padding only needs to add breathing room, not clearance.
      className="mx-auto grid min-h-svh max-w-(--spacing-shell) items-center gap-8 px-6 pt-10 pb-16 sm:px-7 sm:pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-[clamp(32px,5vw,72px)] lg:pt-0 lg:pb-8"
    >
      <div className="min-w-0">
        <p
          data-reveal
          className="mb-8 flex flex-wrap items-center gap-x-3.5 gap-y-2.5 text-[0.72rem] tracking-[0.24em] text-dark-muted uppercase"
        >
          <span className="inline-flex items-center gap-2.5 rounded-full border border-white/15 px-3.5 py-[7px]">
            <span aria-hidden="true" className="inline-block size-[7px] bg-brand" />
            {HERO.eyebrow}
          </span>
        </p>

        <h1
          id="hero-heading"
          data-reveal
          className="text-[clamp(2.7rem,5.6vw,5.4rem)] leading-none font-bold tracking-[-0.03em] text-balance"
        >
          Architecting&nbsp;the{" "}
          <em className="font-semibold italic">evolution</em> of intelligence
          <span className="text-brand">.</span>
        </h1>

        <p
          data-reveal
          className="mt-8 max-w-[46ch] text-[1.125rem] leading-relaxed text-pretty text-dark-fg-3"
        >
          <span className="hl-sweep">{HERO.lede}</span>
        </p>

        <p
          data-reveal
          className="mt-3 max-w-[46ch] text-[1.125rem] leading-relaxed text-pretty text-dark-muted-2 italic"
        >
          {HERO.sub}
        </p>

        <div
          data-reveal
          className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3.5 text-[0.78rem] text-dark-muted"
        >
          <Link
            href={HERO.cta.href}
            className="group inline-flex items-center gap-2.5 rounded-full border border-brand bg-brand px-[22px] py-3.5 tracking-[0.02em] text-white shadow-[0_8px_24px_-10px_rgb(255_51_51/0.5)] transition-[transform,background-color,box-shadow] duration-300 ease-(--ease-out-soft) hover:-translate-y-0.5 hover:scale-[1.035] hover:bg-brand-hover hover:shadow-[0_16px_38px_-8px_rgb(255_51_51/0.65)]"
          >
            {HERO.cta.label}
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>

          <span className="inline-flex items-center gap-2">
            <span
              aria-hidden="true"
              className="inline-block size-1.5 animate-(--animate-soft-pulse) rounded-full bg-brand"
            />
            {HERO.note}
          </span>
        </div>
      </div>

      <div
        data-reveal
        className="relative h-[clamp(300px,64vh,660px)] min-w-0 self-center overflow-hidden rounded-3xl border border-white/[0.12] bg-ink-700"
      >
        <MazeCanvas />

        <p className="pointer-events-none absolute top-[18px] left-5 flex items-center gap-2 text-[0.66rem] tracking-[0.18em] text-[#7e7e7e] uppercase">
          <span
            aria-hidden="true"
            className="inline-block size-1.5 animate-(--animate-soft-pulse) rounded-full bg-brand"
          />
          maze · solving
        </p>

        <p className="pointer-events-none absolute right-5 bottom-[18px] hidden text-[0.66rem] tracking-[0.06em] text-dark-faint sm:block">
          move cursor · click to re-maze
        </p>
      </div>
    </section>
  );
}
