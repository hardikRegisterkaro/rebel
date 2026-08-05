import { CONTACT, CONTACT_FAQS } from "@/lib/contact";

/**
 * Same native <details>/<summary> approach as the other FAQ sections — the
 * design toggles these with JS, but the native element gets keyboard and
 * screen-reader behaviour for free and still opens with JS disabled.
 */
export function ContactFaq() {
  return (
    <section
      id="faq"
      aria-labelledby="contact-faq-heading"
      className="scroll-mt-24 bg-paper text-light-fg"
    >
      <div className="mx-auto max-w-[900px] px-6 py-[clamp(64px,10vh,110px)] sm:px-7">
        <div
          data-reveal="fade-up"
          className="mb-[clamp(32px,4.5vh,48px)] flex flex-col items-center text-center"
        >
          <p className="mb-4 inline-flex items-center gap-2.25 font-mono text-[0.68rem] tracking-[0.22em] text-brand uppercase">
            <span
              aria-hidden="true"
              className="inline-block size-[7px] bg-brand"
            />
            {CONTACT.faq.eyebrow}
          </p>
          <h2
            id="contact-faq-heading"
            className="text-[clamp(1.8rem,3.4vw,2.6rem)] leading-[1.06] font-semibold tracking-[-0.02em]"
          >
            {CONTACT.faq.heading}
            <span className="text-brand">.</span>
          </h2>
          <p className="mt-4.5 max-w-[46ch] text-[0.94rem] leading-relaxed text-light-muted">
            {CONTACT.faq.aside}
          </p>
        </div>

        <div
          data-reveal="fade-up"
          data-reveal-delay="1"
          className="flex flex-col gap-3"
        >
          {CONTACT_FAQS.map((faq) => (
            <details
              key={faq.question}
              // `name` groups them into an exclusive accordion natively;
              // browsers without support simply allow several open at once.
              name="contact-faq"
              className="group overflow-hidden rounded-2xl border border-black/[0.12] bg-paper"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4.5 px-6 py-5.5 text-base font-medium transition-colors duration-250 hover:text-brand [&::-webkit-details-marker]:hidden">
                {faq.question}
                <span
                  aria-hidden="true"
                  className="flex-none font-mono text-[0.9rem] text-brand"
                >
                  <span className="group-open:hidden">+</span>
                  <span className="hidden group-open:inline">−</span>
                </span>
              </summary>
              <p className="max-w-[66ch] px-6 pb-6 text-[0.92rem] leading-[1.65] text-light-muted">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
