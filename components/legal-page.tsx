import Link from "next/link";

import { SITE } from "@/lib/content";
import { LEGAL_UPDATED, type LegalSection } from "@/lib/legal";

/**
 * Shared shell for the privacy and terms pages: dark header, light prose body,
 * keeping the site's section alternation. Both pages are pure prose, so they
 * share one layout rather than duplicating it.
 *
 * The body comes from the CMS as HTML when an editor has written one, and falls
 * back to the structured sections shipped in lib/legal.ts otherwise — a policy
 * page must never render empty.
 */
export function LegalPage({
  title,
  intro,
  sections,
  html = "",
  updated = LEGAL_UPDATED,
}: {
  title: string;
  intro: string;
  sections: LegalSection[];
  /** CMS body. When present it replaces `sections` entirely. */
  html?: string;
  /** This policy's own revision date, already formatted. */
  updated?: string;
}) {
  return (
    <>
      <section
        id="top"
        aria-labelledby="legal-heading"
        className="relative bg-ink text-dark-fg"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgb(255_255_255/0.06)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_75%_70%_at_50%_30%,#000_30%,transparent_72%)]"
        />

        <div className="relative mx-auto max-w-(--spacing-shell) px-6 pt-[clamp(40px,6vh,64px)] pb-[clamp(44px,7vh,80px)] sm:px-7">
          <nav
            aria-label="Breadcrumb"
            data-reveal="fade-up"
            className="mb-8 font-mono text-[0.62rem] tracking-[0.14em] uppercase"
          >
            <ol className="flex flex-wrap items-center gap-2.25">
              <li>
                <Link
                  href="/"
                  className="text-dark-faint transition-colors duration-250 hover:text-white"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-[#3a3a3a]">
                /
              </li>
              <li className="text-dark-fg-2" aria-current="page">
                {title}
              </li>
            </ol>
          </nav>

          <h1
            id="legal-heading"
            data-reveal="fade-up"
            data-reveal-delay="1"
            className="max-w-[18ch] text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.05] font-semibold tracking-[-0.025em]"
          >
            {title}
            <span className="text-brand">.</span>
          </h1>

          <p
            data-reveal="fade-up"
            data-reveal-delay="2"
            className="mt-5 max-w-[58ch] text-[1.05rem] leading-[1.65] text-[#b0b0b0] text-pretty"
          >
            {intro}
          </p>

          <p
            data-reveal="fade-up"
            data-reveal-delay="3"
            className="mt-7 border-t border-white/10 pt-5 font-mono text-[0.62rem] tracking-[0.14em] text-dark-faint uppercase"
          >
            Last updated {updated}
          </p>
        </div>
      </section>

      <section
        aria-label={`${title} detail`}
        className="border-t border-black/[0.08] bg-paper text-light-fg"
      >
        <div className="mx-auto max-w-(--spacing-shell) px-6 py-[clamp(56px,9vh,100px)] sm:px-7">
          <div className="flex max-w-[70ch] flex-col gap-11">
            {html ? (
              <div
                data-reveal="fade-up"
                className="legal-body"
                // Authored in the CMS by trusted staff — the same trust
                // boundary as every other authored page on this site.
                dangerouslySetInnerHTML={{ __html: html }}
              />
            ) : (
              sections.map((section, index) => (
              <section
                key={section.heading}
                data-reveal="fade-up"
                data-reveal-delay={Math.min(index + 1, 3)}
              >
                <h2 className="mb-4 text-[1.15rem] font-semibold tracking-[-0.01em]">
                  {section.heading}
                </h2>

                {section.body?.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="mb-4 text-[0.96rem] leading-[1.7] text-light-fg-2 last:mb-0"
                  >
                    {paragraph}
                  </p>
                ))}

                {section.bullets && (
                  <ul className="mt-4 flex flex-col gap-2.5">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3">
                        <span
                          aria-hidden="true"
                          className="mt-2.5 inline-block size-1.5 flex-none bg-brand"
                        />
                        <span className="text-[0.96rem] leading-[1.7] text-light-fg-2">
                          {bullet}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
              ))
            )}

            <p
              data-reveal="fade-up"
              className="border-t border-black/10 pt-8 text-[0.92rem] leading-relaxed text-light-muted"
            >
              Questions about this page? Write to{" "}
              <a
                href={`mailto:${SITE.email}`}
                className="font-mono underline underline-offset-2 hover:text-brand"
              >
                {SITE.email}
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
