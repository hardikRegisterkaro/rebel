import { CAREERS, PERKS } from "@/lib/careers";

export function WhyBuildHere() {
  return (
    <section aria-labelledby="perks-heading" className="bg-paper text-light-fg">
      <div className="mx-auto max-w-(--spacing-shell) px-6 pb-[clamp(64px,10vh,110px)] sm:px-7">
        <div
          data-reveal="fade-right"
          className="mb-[clamp(36px,5vh,56px)] flex flex-wrap items-end justify-between gap-5"
        >
          <div>
            <p className="mb-4 inline-flex items-center gap-2.25 font-mono text-[0.68rem] tracking-[0.22em] text-brand uppercase">
              <span
                aria-hidden="true"
                className="inline-block size-[7px] bg-brand"
              />
              {CAREERS.perks.eyebrow}
            </p>
            <h2
              id="perks-heading"
              className="max-w-[18ch] text-[clamp(1.9rem,4vw,3rem)] leading-[1.05] font-semibold tracking-[-0.02em]"
            >
              {CAREERS.perks.heading}
              <span className="text-brand">.</span>
            </h2>
          </div>
          <p className="m-0 max-w-[36ch] text-[0.94rem] leading-relaxed text-light-muted">
            {CAREERS.perks.aside}
          </p>
        </div>

        <ul
          data-reveal="fade-up"
          data-reveal-delay="1"
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {PERKS.map((perk) => (
            <li
              key={perk.title}
              className="flex flex-col gap-3 rounded-[18px] border border-black/[0.12] bg-paper px-6 py-6.5 transition-[transform,border-color] duration-350 ease-(--ease-out-soft) hover:-translate-y-1 hover:border-black/[0.22]"
            >
              <span
                aria-hidden="true"
                className="inline-block size-2.25 rotate-45 bg-brand"
              />
              <h3 className="mt-1 text-[1.05rem] font-semibold tracking-[-0.01em]">
                {perk.title}
              </h3>
              <p className="text-[0.86rem] leading-[1.55] text-[#666666]">
                {perk.desc}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
