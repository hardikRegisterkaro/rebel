import Link from "next/link";

import { OrbitCanvas } from "@/components/about/orbit-canvas";
import { ABOUT } from "@/lib/about";

export function AboutHero() {
  return (
    <section
      id="top"
      aria-labelledby="about-heading"
      className="relative bg-ink text-dark-fg"
    >
      {/* Dot grid, faded out toward the edges. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgb(255_255_255/0.06)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_75%_70%_at_50%_30%,#000_30%,transparent_72%)]"
      />

      <div className="relative mx-auto grid grid-cols-1 max-w-(--spacing-shell) items-center gap-[clamp(32px,5vw,72px)] px-6 pt-[clamp(56px,9vh,96px)] pb-[clamp(64px,10vh,110px)] sm:px-7 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="min-w-0">
          <nav
            aria-label="Breadcrumb"
            data-reveal="fade-up"
            className="mb-6.5 font-mono text-[0.62rem] tracking-[0.14em] uppercase"
          >
            <ol className="flex flex-wrap items-center gap-2.25">
              <li>
                <Link
                  href="/"
                  className="text-dark-faint transition-colors duration-250 hover:text-white"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-[#3a3a3a]">
                /
              </li>
              <li className="text-dark-fg-2" aria-current="page">
                About Us
              </li>
            </ol>
          </nav>

          <p
            data-reveal="fade-up"
            data-reveal-delay="1"
            className="mb-5.5 inline-flex items-center gap-2.25 font-mono text-[0.68rem] tracking-[0.22em] text-brand uppercase"
          >
            <span
              aria-hidden="true"
              className="inline-block size-[7px] bg-brand"
            />
            {ABOUT.hero.badge}
          </p>

          <h1
            id="about-heading"
            data-reveal="fade-up"
            data-reveal-delay="2"
            className="max-w-[15ch] text-[clamp(2.4rem,5vw,4.2rem)] leading-[1.02] font-semibold tracking-[-0.025em]"
          >
            {ABOUT.hero.title}
            <span className="text-brand">.</span>
          </h1>

          <p
            data-reveal="fade-up"
            data-reveal-delay="3"
            className="mt-6.5 max-w-[48ch] text-[1.125rem] leading-[1.65] text-[#b0b0b0] text-pretty"
          >
            {ABOUT.hero.lede}
          </p>

          <div
            data-reveal="fade-up"
            data-reveal-delay="4"
            className="mt-9 flex flex-wrap items-center gap-3.5"
          >
            <Link
              href={ABOUT.hero.primaryCta.href}
              className="group inline-flex items-center gap-2.5 rounded-full bg-white px-6.5 py-3.5 text-[0.9rem] font-semibold text-ink transition-[transform,background-color] duration-300 ease-(--ease-out-soft) hover:-translate-y-0.5 hover:bg-[#e4e4e4]"
            >
              {ABOUT.hero.primaryCta.label}
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
            <Link
              href={ABOUT.hero.secondaryCta.href}
              className="inline-flex items-center gap-2.5 rounded-full border border-white/[0.28] px-6 py-3.5 text-[0.9rem] font-medium text-white transition-[border-color,background-color] duration-300 hover:border-brand hover:bg-brand/[0.08]"
            >
              {ABOUT.hero.secondaryCta.label}
            </Link>
          </div>
        </div>

        <div
          data-reveal="zoom-in"
          data-reveal-delay="2"
          className="relative aspect-[1/0.92] min-w-0 overflow-hidden rounded-3xl border border-white/[0.12] bg-[#050505]"
        >
          <OrbitCanvas />

          <p className="pointer-events-none absolute top-[18px] left-5 flex items-center gap-2 font-mono text-[0.62rem] tracking-[0.18em] text-[#7e7e7e] uppercase">
            <span
              aria-hidden="true"
              className="inline-block size-1.5 animate-(--animate-soft-pulse) rounded-full bg-brand"
            />
            {ABOUT.hero.canvas.badge}
          </p>
          <p className="pointer-events-none absolute top-[18px] right-5 font-mono text-[0.62rem] tracking-[0.06em] text-dark-faint">
            {ABOUT.hero.canvas.year}
          </p>
          <p className="pointer-events-none absolute bottom-[18px] left-5 font-mono text-[0.62rem] tracking-[0.06em] text-dark-faint">
            {ABOUT.hero.canvas.click}
          </p>
          <p className="pointer-events-none absolute right-5 bottom-[18px] font-mono text-[0.62rem] tracking-[0.06em] text-dark-faint">
            {ABOUT.hero.canvas.hint}
          </p>
        </div>
      </div>
    </section>
  );
}
