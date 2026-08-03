import { CONTACT, STEPS } from "@/lib/contact";

export function WhatHappensNext() {
  return (
    <section
      aria-labelledby="steps-heading"
      className="border-t border-white/10 bg-ink text-dark-fg"
    >
      <div className="mx-auto max-w-(--spacing-shell) px-6 py-[clamp(64px,10vh,110px)] sm:px-7">
        <div
          data-reveal
          className="mb-[clamp(34px,5vh,52px)] flex flex-wrap items-end justify-between gap-5"
        >
          <div>
            <p className="mb-4 inline-flex items-center gap-2.25 font-mono text-[0.68rem] tracking-[0.22em] text-brand uppercase">
              <span
                aria-hidden="true"
                className="inline-block size-[7px] bg-brand"
              />
              {CONTACT.steps.eyebrow}
            </p>
            <h2
              id="steps-heading"
              className="max-w-[18ch] text-[clamp(1.8rem,3.4vw,2.6rem)] leading-[1.06] font-semibold tracking-[-0.02em]"
            >
              {CONTACT.steps.heading}
              <span className="text-brand">.</span>
            </h2>
          </div>
          <p className="m-0 max-w-[34ch] text-[0.94rem] leading-relaxed text-[#a8a8a8]">
            {CONTACT.steps.aside}
          </p>
        </div>

        {/* 1px gap over a light background paints the dividers between cells. */}
        <ol className="grid grid-cols-1 gap-px overflow-hidden rounded-[20px] border border-white/[0.14] bg-white/[0.14] sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <li
              key={step.ident}
              data-reveal
              className="flex min-h-[190px] flex-col gap-3 bg-ink-800 px-6 py-7"
            >
              <span className="font-mono text-[0.6rem] tracking-[0.16em] text-brand uppercase">
                {step.ident}
              </span>
              <span className="text-[1.02rem] font-semibold">{step.title}</span>
              <span className="text-[0.85rem] leading-[1.55] text-[#a8a8a8]">
                {step.body}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
