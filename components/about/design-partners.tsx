import { CollaborateModal } from "@/components/about/collaborate-modal";

import { ABOUT, PARTNER_OFFERS } from "@/lib/about";

export function DesignPartners() {
  return (
    <section
      aria-labelledby="partners-heading"
      className="border-t border-black/[0.08] bg-paper text-light-fg"
    >
      <div className="mx-auto max-w-(--spacing-shell) px-6 py-[clamp(64px,10vh,110px)] sm:px-7">
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
              {ABOUT.partners.eyebrow}
            </p>
            <h2
              id="partners-heading"
              className="max-w-[20ch] text-[clamp(1.9rem,4vw,3rem)] leading-[1.05] font-semibold tracking-[-0.02em]"
            >
              {ABOUT.partners.heading}
              <span className="text-brand">.</span>
            </h2>
          </div>
          <p className="m-0 max-w-[38ch] text-base leading-[1.65] text-light-muted text-pretty">
            {ABOUT.partners.aside}
          </p>
        </div>

        <ul
          data-reveal="zoom-in"
          data-reveal-delay="1"
          className="grid grid-cols-1 gap-px overflow-hidden rounded-[22px] border border-black/[0.14] bg-black/[0.14] sm:grid-cols-2 lg:grid-cols-3"
        >
          {PARTNER_OFFERS.map((offer) => (
            <li
              key={offer.code}
              className="flex min-h-[230px] flex-col gap-3.5 bg-paper p-[clamp(28px,3vw,38px)]"
            >
              <span className="font-mono text-[0.6rem] tracking-[0.16em] text-brand uppercase">
                {offer.code}
              </span>
              <h3 className="mt-1 text-[1.12rem] font-semibold tracking-[-0.01em]">
                {offer.title}
              </h3>
              <p className="text-[0.9rem] leading-[1.6] text-light-muted">
                {offer.body}
              </p>
              <p className="mt-auto border-t border-black/10 pt-4 font-mono text-[0.68rem] text-light-fg">
                {offer.note}
              </p>
            </li>
          ))}
        </ul>

        <div
          data-reveal="fade-up"
          data-reveal-delay="2"
          className="mt-5 flex flex-wrap items-center justify-between gap-6 rounded-[22px] bg-ink p-[clamp(28px,3.4vw,40px)] text-dark-fg"
        >
          <div className="max-w-[52ch]">
            <p className="mb-3 font-mono text-[0.6rem] tracking-[0.18em] text-brand uppercase">
              {ABOUT.partners.cohort.eyebrow}
            </p>
            <p className="text-[clamp(1.05rem,1.8vw,1.35rem)] leading-[1.45] tracking-[-0.01em]">
              {ABOUT.partners.cohort.body}
            </p>
          </div>
          <CollaborateModal
            label={ABOUT.partners.cohort.cta.label}
            context="Design partner application"
            className="group inline-flex flex-none cursor-pointer items-center gap-2.5 rounded-full bg-brand px-6.5 py-3.5 text-[0.9rem] font-semibold text-white transition-[transform,box-shadow] duration-300 ease-(--ease-out-soft) hover:-translate-y-0.5 hover:shadow-[0_16px_34px_-14px_rgb(255_51_51/0.75)]"
          />
        </div>
      </div>
    </section>
  );
}
