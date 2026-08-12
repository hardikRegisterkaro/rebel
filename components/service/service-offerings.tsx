import Image from "next/image";
import { SmartLink } from "@/components/smart-link";

import { Emphasis } from "@/components/emphasis";
import type { Offering } from "@/lib/solutions";

type Header = { eyebrow: string; heading: string; aside: string };

/**
 * Column count for the card grid.
 *
 * The design was drawn for four cards in two columns, but a pillar may carry
 * any number. One card must not stretch across the row, and beyond four the
 * two-column grid gets tall enough to bury the later cards — so it goes to
 * three across on large screens.
 */
function gridColumns(count: number): string {
  if (count <= 1) return "grid-cols-1 md:max-w-[560px]";
  if (count <= 4) return "grid-cols-1 md:grid-cols-2";
  return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
}

export function ServiceOfferings({
  offerings,
  header,
}: {
  offerings: Offering[];
  header: Header;
}) {
  // A pillar with no offerings hides the section rather than printing a
  // heading over an empty grid.
  if (offerings.length === 0) return null;

  return (
    <section
      id="offerings"
      aria-labelledby="offerings-heading"
      className="scroll-mt-24 bg-paper text-light-fg"
    >
      <div className="mx-auto max-w-(--spacing-shell) px-6 py-[clamp(68px,10vh,116px)] sm:px-7">
        <div
          data-reveal="fade-right"
          className="mb-[clamp(36px,5vh,56px)] flex flex-wrap items-end justify-between gap-5.5"
        >
          <div>
            <p className="mb-4 inline-flex items-center gap-2.5 font-mono text-[0.68rem] tracking-[0.22em] text-brand uppercase">
              <span
                aria-hidden="true"
                className="inline-block size-[7px] bg-brand"
              />
              What We Do
            </p>
            <h2
              id="offerings-heading"
              className="max-w-[18ch] text-[clamp(1.9rem,4vw,3.1rem)] leading-[1.05] font-semibold tracking-[-0.022em]"
            >
              {header.heading}
              <span className="text-brand">.</span>
            </h2>
          </div>
          <p className="max-w-[34ch] text-[0.94rem] leading-relaxed text-light-muted">
            {header.aside}
          </p>
        </div>

        <ul
          data-reveal="fade-up"
          data-reveal-delay="1"
          className={`grid gap-5 ${gridColumns(offerings.length)}`}
        >
          {offerings.map((offering, index) => (
            <li key={offering.title} className="min-w-0">
              <SmartLink
                href="#openlab"
                className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-white/10 bg-[#0b0b0c] text-white transition-[transform,border-color,box-shadow] duration-500 ease-(--ease-out-soft) hover:-translate-y-1.5 hover:border-brand/45 hover:shadow-[0_24px_50px_-30px_rgb(0_0_0/0.9)]"
              >
                {/* Same colour as the card body: on hover the image scales and
                    sub-pixel rounding exposed a hairline of this panel, which
                    read as a gap under the image. */}
                <div className="relative h-[clamp(140px,17vh,172px)] flex-none overflow-hidden bg-[#0b0b0c]">
                  <Image
                    src={offering.image}
                    alt={offering.alt}
                    fill
                    loading={index < 2 ? "eager" : "lazy"}
                    sizes={
                      offerings.length > 4
                        ? "(max-width: 768px) 92vw, (max-width: 1024px) 46vw, 31vw"
                        : "(max-width: 768px) 92vw, 46vw"
                    }
                    className="object-cover transition-transform duration-700 ease-(--ease-out-soft) group-hover:scale-[1.05]"
                  />
                  <span
                    aria-hidden="true"
                    // Fully opaque at the bottom so the fade meets the card body
                    // seamlessly; at 95% a sliver of image showed through and
                    // drew a visible line across every card.
                    className="absolute inset-0 bg-gradient-to-t from-[#0b0b0c] via-[#0b0b0c]/10 to-[#0b0b0c]/35"
                  />
                  <span className="absolute top-3.5 left-4 rounded-full border border-white/20 bg-[#0b0b0c]/80 px-2.75 py-[5px] font-mono text-[0.56rem] tracking-[0.16em] text-white uppercase backdrop-blur-[6px]">
                    {offering.badge}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-[clamp(24px,2.6vw,32px)]">
                  <h3 className="mb-3 text-[1.28rem] leading-tight font-semibold tracking-[-0.015em]">
                    {offering.title}
                  </h3>
                  <p className="mb-5.5 text-[0.94rem] leading-relaxed text-[#b0b0b0]">
                    <Emphasis text={offering.body} />
                  </p>

                  <ul className="flex flex-col gap-2.75">
                    {offering.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex items-start gap-2.75 text-[0.85rem] leading-snug text-[#d4d4d4]"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-1.5 size-1.5 flex-none bg-brand"
                        />
                        {bullet}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto flex items-center justify-between gap-3 pt-6">
                    <span
                      aria-hidden="true"
                      className="h-px flex-1 bg-white/[0.14]"
                    />
                    <span className="inline-flex items-center gap-2 font-mono text-[0.66rem] tracking-[0.14em] text-dark-muted-2 uppercase transition-colors duration-350 group-hover:text-brand">
                      Explore
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-350 group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </span>
                  </div>
                </div>
              </SmartLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
