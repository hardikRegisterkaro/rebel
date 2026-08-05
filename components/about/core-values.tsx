import { ABOUT, VALUES } from "@/lib/about";

export function CoreValues() {
  return (
    <section
      aria-labelledby="values-heading"
      className="border-t border-white/10 bg-ink text-dark-fg"
    >
      <div className="mx-auto max-w-(--spacing-shell) px-6 py-[clamp(64px,10vh,110px)] sm:px-7">
        <div data-reveal="fade-right" className="mb-[clamp(36px,5vh,56px)]">
          <p className="mb-4 inline-flex items-center gap-2.25 font-mono text-[0.68rem] tracking-[0.22em] text-brand uppercase">
            <span
              aria-hidden="true"
              className="inline-block size-[7px] bg-brand"
            />
            {ABOUT.values.eyebrow}
          </p>
          <h2
            id="values-heading"
            className="max-w-[16ch] text-[clamp(1.9rem,4vw,3rem)] leading-[1.05] font-semibold tracking-[-0.02em]"
          >
            {ABOUT.values.heading}
            <span className="text-brand">.</span>
          </h2>
        </div>

        <ul
          data-reveal="zoom-in"
          data-reveal-delay="1"
          className="grid grid-cols-1 gap-px overflow-hidden rounded-[22px] border border-white/[0.14] bg-white/[0.14] sm:grid-cols-2 lg:grid-cols-4"
        >
          {VALUES.map((value) => (
            <li
              key={value.code}
              className="flex min-h-[250px] flex-col gap-3.5 bg-ink-800 px-6.5 py-7.5"
            >
              <span className="font-mono text-[0.6rem] tracking-[0.16em] text-brand">
                {value.code}
              </span>
              <h3 className="mt-1.5 text-[1.2rem] font-semibold tracking-[-0.01em]">
                {value.title}
              </h3>
              <p className="text-[0.88rem] leading-[1.55] text-[#a8a8a8]">
                {value.desc}
              </p>
              <p className="mt-auto border-t border-white/10 pt-4 font-mono text-[0.7rem] font-semibold text-dark-fg">
                {value.metric}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
