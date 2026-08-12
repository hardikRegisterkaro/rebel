import Link from "next/link";

import { SITE } from "@/lib/content";
import type { Faq } from "@/lib/solutions";

/**
 * Built on native <details>/<summary>: keyboard and screen-reader behaviour
 * comes for free, it opens without JavaScript, and in-page browser search can
 * still find answers inside collapsed panels.
 */
type Header = {
  eyebrow: string;
  heading: string;
  aside: string;
  cta: { label: string; href: string };
};

export function FaqSection({ faqs, header }: { faqs: Faq[]; header: Header }) {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="scroll-mt-24 bg-paper text-light-fg"
    >
      <div className="mx-auto grid grid-cols-1 max-w-(--spacing-shell) items-start gap-[clamp(32px,5vw,72px)] px-6 py-[clamp(68px,10vh,116px)] sm:px-7 lg:grid-cols-[0.8fr_1.2fr]">
        <div data-reveal="fade-right">
          <p className="mb-4 inline-flex items-center gap-2.5 font-mono text-[0.68rem] tracking-[0.22em] text-brand uppercase">
            <span
              aria-hidden="true"
              className="inline-block size-[7px] bg-brand"
            />
            Questions &amp; Answers
          </p>
          <h2
            id="faq-heading"
            className="max-w-[14ch] text-[clamp(1.9rem,4vw,3.1rem)] leading-[1.05] font-semibold tracking-[-0.022em]"
          >
            {header.heading}<span className="text-brand">.</span>
          </h2>
          <p className="mt-5.5 max-w-[32ch] text-[0.94rem] leading-relaxed text-light-muted">
            {header.aside}
          </p>
          <Link
            href={`mailto:${SITE.email}`}
            className="group mt-6.5 inline-flex items-center gap-2.5 rounded-full border border-black/20 px-5.5 py-3 font-mono text-[0.7rem] tracking-[0.1em] text-light-fg uppercase transition-colors duration-300 hover:border-brand hover:bg-brand hover:text-white"
          >
            {header.cta.label}
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>

        <div
          data-reveal="fade-left"
          data-reveal-delay="1"
          className="flex flex-col overflow-hidden rounded-[22px] border border-black/[0.12] bg-paper"
        >
          {faqs.map((faq, index) => (
            <details
              key={faq.question}
              // `name` groups them into an exclusive accordion natively;
              // browsers without support simply allow several open at once.
              name="faq"
              open={index === 0}
              className="group border-b border-black/[0.09] last:border-b-0"
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
              <p className="max-w-[64ch] px-[clamp(22px,2.6vw,32px)] pb-6.5 text-[0.92rem] leading-relaxed text-light-muted">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
