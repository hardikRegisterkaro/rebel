import { CANDIDATE_FAQS, CAREERS } from "@/lib/careers";

/**
 * Same native <details>/<summary> approach as components/service/faq-section —
 * keyboard and screen-reader behaviour for free, opens without JavaScript, and
 * in-page search still finds collapsed answers. Kept separate rather than
 * shared because this one sits on the dark surface.
 */
export function CandidateFaq() {
  return (
    <section
      id="faq"
      aria-labelledby="candidate-faq-heading"
      className="scroll-mt-24 border-t border-white/10 bg-ink text-dark-fg"
    >
      <div className="mx-auto grid grid-cols-1 max-w-(--spacing-shell) items-start gap-[clamp(32px,5vw,72px)] px-6 py-[clamp(64px,10vh,110px)] sm:px-7 lg:grid-cols-[0.8fr_1.2fr]">
        <div data-reveal>
          <p className="mb-4 inline-flex items-center gap-2.25 font-mono text-[0.68rem] tracking-[0.22em] text-brand uppercase">
            <span
              aria-hidden="true"
              className="inline-block size-[7px] bg-brand"
            />
            {CAREERS.faq.eyebrow}
          </p>
          <h2
            id="candidate-faq-heading"
            className="max-w-[14ch] text-[clamp(1.9rem,4vw,3rem)] leading-[1.05] font-semibold tracking-[-0.02em]"
          >
            {CAREERS.faq.heading}
            <span className="text-brand">.</span>
          </h2>
          <p className="mt-5.5 max-w-[32ch] text-[0.94rem] leading-relaxed text-dark-muted">
            {CAREERS.faq.aside}
          </p>
        </div>

        <div
          data-reveal
          className="flex flex-col overflow-hidden rounded-[22px] border border-white/[0.12] bg-ink-700"
        >
          {CANDIDATE_FAQS.map((faq, index) => (
            <details
              key={faq.question}
              // `name` groups them into an exclusive accordion natively;
              // browsers without support simply allow several open at once.
              name="candidate-faq"
              open={index === 0}
              className="group border-b border-white/[0.09] last:border-b-0"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 px-[clamp(22px,2.6vw,32px)] py-6 text-[1.02rem] font-semibold transition-colors duration-200 hover:text-brand [&::-webkit-details-marker]:hidden">
                {faq.question}
                <span
                  aria-hidden="true"
                  className="flex-none font-mono text-base text-brand"
                >
                  <span className="group-open:hidden">+</span>
                  <span className="hidden group-open:inline">−</span>
                </span>
              </summary>
              <p className="max-w-[64ch] px-[clamp(22px,2.6vw,32px)] pb-6.5 text-[0.92rem] leading-relaxed text-dark-muted">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
