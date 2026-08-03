import Link from "next/link";

import { CAREERS, ROLES } from "@/lib/careers";

export function CareersHero() {
  return (
    <section
      id="top"
      aria-labelledby="careers-heading"
      className="relative bg-ink text-dark-fg"
    >
      {/* Dot grid, faded out toward the edges. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgb(255_255_255/0.06)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_75%_70%_at_50%_30%,#000_30%,transparent_72%)]"
      />

      <div className="relative mx-auto max-w-(--spacing-shell) px-6 pt-[clamp(48px,7vh,72px)] pb-[clamp(64px,10vh,110px)] sm:px-7">
        <nav
          aria-label="Breadcrumb"
          data-reveal
          className="mb-8.5 font-mono text-[0.62rem] tracking-[0.14em] uppercase"
        >
          <ol className="flex flex-wrap items-center justify-center gap-2.25">
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
              Careers
            </li>
          </ol>
        </nav>

        <div className="mx-auto flex max-w-[820px] flex-col items-center text-center">
          <p
            data-reveal
            className="mb-7.5 inline-flex items-center gap-2.25 rounded-full border border-white/[0.16] px-3.75 py-1.75 font-mono text-[0.66rem] tracking-[0.2em] text-dark-fg-2 uppercase"
          >
            <span
              aria-hidden="true"
              className="inline-block size-1.5 animate-(--animate-soft-pulse) rounded-full bg-brand"
            />
            {ROLES.length} open roles · hiring now
          </p>

          <h1
            id="careers-heading"
            data-reveal
            className="text-[clamp(2.4rem,5.4vw,4.2rem)] leading-[1.02] font-semibold tracking-[-0.03em] text-pretty"
          >
            {CAREERS.hero.title}{" "}
            <span className="text-brand">{CAREERS.hero.titleAccent}</span>.
          </h1>

          <p
            data-reveal
            className="mt-6 max-w-[52ch] text-[1.125rem] leading-[1.65] text-[#a8a8a8] text-pretty"
          >
            {CAREERS.hero.lede}
          </p>

          <div data-reveal className="mt-9">
            <Link
              href={CAREERS.hero.cta.href}
              className="group inline-flex items-center gap-2.5 rounded-full bg-brand px-6.5 py-3.5 text-[0.9rem] font-semibold text-white transition-[transform,box-shadow] duration-300 ease-(--ease-out-soft) hover:-translate-y-0.5 hover:shadow-[0_16px_34px_-14px_rgb(255_51_51/0.75)]"
            >
              {CAREERS.hero.cta.label}
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
