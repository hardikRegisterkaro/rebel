import { ABOUT, ABOUT_FAQS } from "@/lib/about";

/** Native <details>/<summary>, as elsewhere on the site — see contact-faq. */
export function AboutFaq() {
  return (
    <section
      id="faq"
      aria-labelledby="about-faq-heading"
      className="scroll-mt-24 border-t border-white/10 bg-ink text-dark-fg"
    >
      <div className="mx-auto max-w-(--spacing-shell) px-6 py-[clamp(64px,10vh,110px)] sm:px-7">
        <p
          data-reveal
          className="mb-4 inline-flex items-center gap-2.25 font-mono text-[0.68rem] tracking-[0.22em] text-brand uppercase"
        >
          <span aria-hidden="true" className="inline-block size-[7px] bg-brand" />
          {ABOUT.faq.eyebrow}
        </p>
        <h2
          id="about-faq-heading"
          className="mb-[clamp(30px,4vh,44px)] text-[clamp(1.9rem,4vw,3rem)] leading-[1.05] font-semibold tracking-[-0.02em]"
        >
          {ABOUT.faq.heading}
          <span className="text-brand">.</span>
        </h2>

        <div
          data-reveal
          className="flex max-w-[900px] flex-col border-t border-white/[0.14]"
        >
          {ABOUT_FAQS.map((faq) => (
            <details
              key={faq.question}
              // `name` groups them into an exclusive accordion natively;
              // browsers without support simply allow several open at once.
              name="about-faq"
              className="group border-b border-white/[0.14]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4.5 px-1 py-5 text-base font-medium transition-colors duration-250 hover:text-brand [&::-webkit-details-marker]:hidden">
                {faq.question}
                <span
                  aria-hidden="true"
                  className="flex-none font-mono text-[0.9rem] text-brand"
                >
                  <span className="group-open:hidden">+</span>
                  <span className="hidden group-open:inline">−</span>
                </span>
              </summary>
              <p className="max-w-[60ch] px-1 pb-5.5 text-[0.9rem] leading-[1.6] text-[#a8a8a8]">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
