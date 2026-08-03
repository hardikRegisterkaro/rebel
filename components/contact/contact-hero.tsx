import Link from "next/link";

import { CONTACT } from "@/lib/contact";

export function ContactHero() {
  return (
    <section
      id="top"
      aria-labelledby="contact-heading"
      className="relative bg-ink text-dark-fg"
    >
      {/* Dot grid, faded out toward the edges. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgb(255_255_255/0.06)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_75%_70%_at_50%_28%,#000_30%,transparent_72%)]"
      />

      <div className="relative mx-auto max-w-(--spacing-shell) px-6 pt-[clamp(48px,7vh,76px)] pb-[clamp(56px,8vh,88px)] sm:px-7">
        <nav
          aria-label="Breadcrumb"
          data-reveal
          className="mb-8.5 font-mono text-[0.62rem] tracking-[0.14em] uppercase"
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
              Collaborate
            </li>
          </ol>
        </nav>

        <div className="mx-auto flex max-w-[840px] flex-col items-center text-center">
          <p
            data-reveal
            className="mb-7.5 inline-flex items-center gap-2.25 rounded-full border border-white/[0.16] px-3.75 py-1.75 font-mono text-[0.66rem] tracking-[0.2em] text-dark-fg-2 uppercase"
          >
            <span
              aria-hidden="true"
              className="inline-block size-1.5 animate-(--animate-soft-pulse) rounded-full bg-brand"
            />
            {CONTACT.hero.badge}
          </p>

          <h1
            id="contact-heading"
            data-reveal
            className="text-[clamp(2.4rem,5.4vw,4.2rem)] leading-[1.02] font-semibold tracking-[-0.03em] text-balance"
          >
            {CONTACT.hero.title}{" "}
            <span className="text-brand">{CONTACT.hero.titleAccent}</span>.
          </h1>

          <p
            data-reveal
            className="mt-6 max-w-[52ch] text-[1.125rem] leading-[1.65] text-[#a8a8a8] text-pretty"
          >
            {CONTACT.hero.lede}
          </p>

          <dl
            data-reveal
            className="mt-13 grid w-full grid-cols-3 border-t border-white/10"
          >
            {CONTACT.hero.stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`flex flex-col items-center gap-1.75 px-1.5 pt-6.5 sm:px-3 ${
                  index > 0 ? "border-l border-white/10" : ""
                }`}
              >
                <dd className="text-[clamp(1.05rem,4.2vw,1.55rem)] leading-none font-bold tracking-[-0.03em]">
                  {stat.value}
                </dd>
                <dt className="text-center font-mono text-[0.56rem] tracking-[0.08em] text-[#7a7a7a] uppercase sm:tracking-[0.16em]">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
