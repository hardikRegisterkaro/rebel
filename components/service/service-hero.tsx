import Image from "next/image";
import Link from "next/link";

import type { Solution } from "@/lib/solutions";

export function ServiceHero({ solution }: { solution: Solution }) {
  return (
    <section
      id="top"
      aria-labelledby="service-heading"
      className="relative bg-ink text-dark-fg"
    >
      {/* Dot grid, faded out toward the edges. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgb(255_255_255/0.06)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_80%_75%_at_40%_35%,#000_25%,transparent_72%)]"
      />

      <div className="relative mx-auto grid grid-cols-1 max-w-(--spacing-shell) items-center gap-[clamp(32px,5vw,72px)] px-6 pt-[clamp(48px,7vh,76px)] pb-[clamp(72px,11vh,124px)] sm:px-7 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="min-w-0">
          <nav
            aria-label="Breadcrumb"
            data-reveal="fade-up"
            className="mb-7.5 font-mono text-[0.62rem] tracking-[0.14em] uppercase"
          >
            <ol className="flex flex-wrap items-center gap-2.5">
              <li>
                <Link
                  href="/#frameworks"
                  className="text-dark-faint transition-colors duration-250 hover:text-white"
                >
                  Solutions
                </Link>
              </li>
              <li aria-hidden="true" className="text-[#3a3a3a]">
                /
              </li>
              <li className="text-dark-fg-2" aria-current="page">
                {solution.title}
              </li>
            </ol>
          </nav>

          <p
            data-reveal="fade-up"
            data-reveal-delay="1"
            className="mb-6.5 inline-flex items-center gap-2.5 rounded-full border border-brand/40 px-3.5 py-1.5 font-mono text-[0.64rem] tracking-[0.2em] text-brand uppercase"
          >
            <span
              aria-hidden="true"
              className="inline-block size-1.5 bg-brand"
            />
            {solution.pillar}
          </p>

          <h1
            id="service-heading"
            data-reveal="fade-up"
            data-reveal-delay="2"
            className="max-w-[14ch] text-[clamp(2.6rem,5.6vw,4.6rem)] leading-[1.01] font-semibold tracking-[-0.028em]"
          >
            {solution.title}
            <span className="text-brand">.</span>
          </h1>

          <p
            data-reveal="fade-up"
            data-reveal-delay="3"
            className="mt-6.5 max-w-[44ch] text-[clamp(1.05rem,1.5vw,1.32rem)] leading-relaxed text-[#b0b0b0]"
          >
            {solution.tagline}
          </p>

          <div
            data-reveal="fade-up"
            data-reveal-delay="4"
            className="mt-10 flex flex-wrap items-center gap-3.5"
          >
            <Link
              href="#offerings"
              className="inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-4 text-[0.92rem] font-semibold text-ink transition-[transform,background-color] duration-300 ease-(--ease-out-soft) hover:-translate-y-0.5 hover:bg-[#e7e7e4]"
            >
              Explore Offerings
            </Link>
            <Link
              href="#openlab"
              className="group inline-flex items-center gap-2.5 rounded-full border border-white/30 px-6.5 py-4 text-[0.92rem] font-medium text-white transition-[border-color,background-color] duration-300 hover:border-brand hover:bg-brand/[0.08]"
            >
              Schedule a Consultation
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>

          <dl
            data-reveal="fade-up"
            data-reveal-delay="5"
            className="mt-11 flex flex-wrap gap-x-[46px] gap-y-6 border-t border-white/10 pt-6.5"
          >
            {solution.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1.5">
                <dd className="text-2xl leading-none font-bold tracking-[-0.03em]">
                  {stat.value}
                </dd>
                <dt className="font-mono text-[0.56rem] tracking-[0.16em] text-[#7a7a7a] uppercase">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>

        <div
          data-reveal="zoom-in"
          data-reveal-delay="2"
          className="relative aspect-[1/0.9] min-w-0 overflow-hidden rounded-3xl border border-white/[0.12] bg-[#050505]"
        >
          <Image
            src={solution.hero.image}
            alt={solution.hero.alt}
            fill
            priority
            sizes="(max-width: 1024px) 92vw, 46vw"
            className="object-cover"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/35"
          />

          <p className="pointer-events-none absolute top-[18px] left-5 flex items-center gap-2 font-mono text-[0.62rem] tracking-[0.18em] text-[#e4e4e4] uppercase">
            <span
              aria-hidden="true"
              className="inline-block size-1.5 animate-(--animate-soft-pulse) rounded-full bg-brand"
            />
            {solution.hero.badge}
          </p>

          <div className="pointer-events-none absolute right-5 bottom-[18px] left-5 flex items-end justify-between gap-4 font-mono text-[0.62rem] uppercase">
            <span className="tracking-[0.14em] text-dark-fg-2">
              {solution.title}
            </span>
            <span className="tracking-[0.06em] text-dark-muted">
              {solution.pillar}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
