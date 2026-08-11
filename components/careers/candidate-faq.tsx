import type { CareersContent } from "@/lib/careers-api";

/**
 * Same native <details>/<summary> approach as components/service/faq-section —
 * keyboard and screen-reader behaviour for free, opens without JavaScript, and
 * in-page search still finds collapsed answers. Kept separate rather than
 * shared because the layout differs — a two-column split rather than the
 * solution page's stacked block.
 */
export function CandidateFaq({ faq }: { faq: CareersContent["faq"] }) {
  if (faq.items.length === 0) return null;

  return (
    <section
      id="faq"
      aria-labelledby="candidate-faq-heading"
      className="scroll-mt-24 border-t border-black/[0.08] bg-paper text-light-fg"
    >
      <div className="mx-auto grid grid-cols-1 max-w-(--spacing-shell) items-start gap-[clamp(32px,5vw,72px)] px-6 py-[clamp(64px,10vh,110px)] sm:px-7 lg:grid-cols-[0.8fr_1.2fr]">
        <div data-reveal="fade-right">
          <p className="mb-4 inline-flex items-center gap-2.25 font-mono text-[0.68rem] tracking-[0.22em] text-brand uppercase">
            <span
              aria-hidden="true"
              className="inline-block size-[7px] bg-brand"
            />
            {faq.eyebrow}
          </p>
          <h2
            id="candidate-faq-heading"
            className="max-w-[14ch] text-[clamp(1.9rem,4vw,3rem)] leading-[1.05] font-semibold tracking-[-0.02em]"
          >
            {faq.heading}
            <span className="text-brand">.</span>
          </h2>
          <p className="mt-5.5 max-w-[32ch] text-[0.94rem] leading-relaxed text-light-muted">
            {faq.aside}
          </p>
        </div>

        <div
          data-reveal="fade-left"
          data-reveal-delay="1"
          className="flex flex-col overflow-hidden rounded-[22px] border border-black/[0.12] bg-paper"
        >
          {faq.items.map((item, index) => (
            <details
              key={item.question}
              // `name` groups them into an exclusive accordion natively;
              // browsers without support simply allow several open at once.
              name="candidate-faq"
              open={index === 0}
              className="group border-b border-black/[0.09] last:border-b-0"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 px-[clamp(22px,2.6vw,32px)] py-6 text-[1.02rem] font-semibold transition-colors duration-200 hover:text-brand [&::-webkit-details-marker]:hidden">
                {item.question}
                <span
                  aria-hidden="true"
                  className="flex-none font-mono text-base text-brand"
                >
                  <span className="group-open:hidden">+</span>
                  <span className="hidden group-open:inline">−</span>
                </span>
              </summary>
              <p className="max-w-[64ch] px-[clamp(22px,2.6vw,32px)] pb-6.5 text-[0.92rem] leading-relaxed text-light-muted">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
