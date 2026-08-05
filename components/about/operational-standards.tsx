import { ABOUT, BADGES } from "@/lib/about";

export function OperationalStandards() {
  return (
    <section
      aria-labelledby="standards-heading"
      className="bg-ink text-dark-fg"
    >
      <div className="mx-auto grid grid-cols-1 max-w-(--spacing-shell) items-start gap-[clamp(32px,5vw,64px)] px-6 py-[clamp(64px,10vh,110px)] sm:px-7 lg:grid-cols-[0.85fr_1.15fr]">
        <div data-reveal="fade-right">
          <p className="mb-4 inline-flex items-center gap-2.25 font-mono text-[0.68rem] tracking-[0.22em] text-brand uppercase">
            <span
              aria-hidden="true"
              className="inline-block size-[7px] bg-brand"
            />
            {ABOUT.standards.eyebrow}
          </p>
          <h2
            id="standards-heading"
            className="max-w-[16ch] text-[clamp(1.9rem,4vw,3rem)] leading-[1.05] font-semibold tracking-[-0.02em]"
          >
            {ABOUT.standards.heading}
            <span className="text-brand">.</span>
          </h2>
          <p className="mt-5.5 max-w-[40ch] text-[0.94rem] leading-relaxed text-[#a8a8a8]">
            {ABOUT.standards.body}
          </p>
        </div>

        <ul
          data-reveal="zoom-in"
          data-reveal-delay="1"
          className="grid grid-cols-1 gap-px overflow-hidden rounded-[22px] border border-white/[0.14] bg-white/[0.14] sm:grid-cols-2"
        >
          {BADGES.map((badge) => (
            <li
              key={badge.code}
              className="flex min-h-[150px] flex-col gap-2.5 bg-ink-800 px-6 py-6.5"
            >
              <span className="font-mono text-[0.6rem] tracking-[0.14em] text-brand">
                {badge.code}
              </span>
              <span className="text-base font-semibold">{badge.title}</span>
              <span className="text-[0.82rem] leading-[1.5] text-[#a8a8a8]">
                {badge.desc}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
