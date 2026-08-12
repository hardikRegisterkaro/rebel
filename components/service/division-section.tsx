import Image from "next/image";

import type { DivisionSection } from "@/lib/services-api";

/**
 * One section of a division page, rendered in the tone its position dictates.
 *
 * Every kind is styled for BOTH tones. That is what makes the section builder
 * safe: an editor reorders freely and the page still alternates, because tone
 * is decided by index at render time rather than baked into each component.
 */
export type Tone = "dark" | "light";

const T = (tone: Tone) => ({
  section: tone === "dark" ? "bg-ink text-dark-fg" : "bg-paper text-light-fg",
  heading: tone === "dark" ? "text-white" : "text-light-fg",
  body: tone === "dark" ? "text-dark-fg-2" : "text-light-muted",
  muted: tone === "dark" ? "text-dark-muted" : "text-light-muted",
  card:
    tone === "dark"
      ? "border-white/10 bg-white/[0.03]"
      : "border-black/[0.08] bg-white",
  border: tone === "dark" ? "border-white/10" : "border-black/[0.08]",
  rule: tone === "dark" ? "bg-white/[0.14]" : "bg-black/[0.10]",
});

/** Kicker + heading, shared by every section kind. */
function SectionHead({
  label,
  heading,
  intro,
  tone,
  id,
}: {
  label: string;
  heading: string;
  intro?: string;
  tone: Tone;
  id: string;
}) {
  const t = T(tone);
  return (
    <div className="mb-[clamp(28px,4vh,44px)]">
      <p className="mb-4 inline-flex items-center gap-2.5 font-mono text-[0.68rem] tracking-[0.22em] text-brand uppercase">
        <span aria-hidden="true" className="inline-block size-[7px] bg-brand" />
        {label}
      </p>
      <h2
        id={`${id}-heading`}
        className={`max-w-[20ch] text-[clamp(1.8rem,3.6vw,2.9rem)] leading-[1.06] font-semibold tracking-[-0.02em] ${t.heading}`}
      >
        {heading}
        <span className="text-brand">.</span>
      </h2>
      {intro && <p className={`mt-4 max-w-[62ch] text-[0.96rem] leading-relaxed ${t.body}`}>{intro}</p>}
    </div>
  );
}

/**
 * A section's supporting image.
 *
 * `fill` inside a fixed-aspect box rather than intrinsic sizing: the CMS
 * accepts any upload, and letting the natural dimensions through would make
 * each section a different height. `sizes` matches the two-column split so a
 * phone never downloads the desktop-width file.
 */
function SectionImage({ src, alt, tone }: { src: string; alt: string; tone: Tone }) {
  const t = T(tone);
  return (
    <div
      className={`relative aspect-[4/3] w-full overflow-hidden rounded-[18px] border lg:aspect-[3/4] ${t.border}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        loading="lazy"
        sizes="(max-width: 1024px) 92vw, 38vw"
        className="object-cover"
      />
    </div>
  );
}

/** The square brand marker used for every bullet on the site. */
function Marker() {
  return <span aria-hidden="true" className="mt-[0.45em] size-1.5 flex-none bg-brand" />;
}

export function DivisionSectionBlock({
  section,
  tone,
}: {
  section: DivisionSection;
  tone: Tone;
}) {
  const t = T(tone);

  return (
    <section
      id={section.id}
      aria-labelledby={`${section.id}-heading`}
      className={`scroll-mt-24 ${t.section}`}
    >
      <div className="mx-auto max-w-(--spacing-shell) px-6 py-[clamp(60px,9vh,104px)] sm:px-7">
        <div data-reveal="fade-right">
          <SectionHead
            id={section.id}
            label={section.label}
            heading={section.heading}
            intro={"intro" in section ? section.intro : undefined}
            tone={tone}
          />
        </div>

        {/* With an image the section becomes two columns on desktop and stacks
            on mobile, image first. Without one the content keeps the full
            width — a single narrow column beside empty space reads as broken. */}
        <div
          data-reveal="fade-up"
          data-reveal-delay="1"
          className={
            section.image
              ? "grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_minmax(280px,38%)] lg:gap-12"
              : undefined
          }
        >
          {section.image && (
            <div className="order-first lg:order-last">
              <SectionImage src={section.image} alt={section.alt ?? ""} tone={tone} />
            </div>
          )}
          <div className="min-w-0">
          {section.kind === "intro" && (
            <>
              <div className="flex max-w-[68ch] flex-col gap-4">
                {section.paragraphs.map((p, i) => (
                  <p key={i} className={`text-[1rem] leading-[1.7] ${t.body}`}>
                    {p}
                  </p>
                ))}
              </div>
              {section.stats && section.stats.length > 0 && (
                <dl className={`mt-10 grid grid-cols-2 gap-6 border-t pt-8 sm:grid-cols-4 ${t.border}`}>
                  {section.stats.map((s, i) => (
                    <div key={i}>
                      <dt className="sr-only">{s.label}</dt>
                      <dd>
                        <span className={`block text-[1.6rem] font-semibold ${t.heading}`}>
                          {s.value}
                        </span>
                        <span
                          className={`mt-1 block font-mono text-[0.66rem] tracking-[0.16em] uppercase ${t.muted}`}
                        >
                          {s.label}
                        </span>
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </>
          )}

          {section.kind === "cards" && (
            <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {section.cards.map((card, i) => (
                <li key={i} className={`overflow-hidden rounded-[18px] border ${t.card}`}>
                  {card.image && (
                    <div className="relative aspect-[16/9] w-full overflow-hidden">
                      <Image
                        src={card.image}
                        alt={card.alt ?? ""}
                        fill
                        loading="lazy"
                        sizes="(max-width: 768px) 92vw, (max-width: 1024px) 46vw, 31vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                  <h3 className={`mb-3 text-[1.1rem] font-semibold ${t.heading}`}>{card.title}</h3>
                  <ul className="flex flex-col gap-2.5">
                    {card.points.map((point, pi) => (
                      <li key={pi} className={`flex items-start gap-2.5 text-[0.9rem] leading-snug ${t.body}`}>
                        <Marker />
                        {point}
                      </li>
                    ))}
                  </ul>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {section.kind === "chips" && (
            <>
              <ul className="flex flex-wrap gap-2.5">
                {section.chips.map((chip, i) => (
                  <li
                    key={i}
                    className={`rounded-full border px-4 py-2 font-mono text-[0.7rem] tracking-[0.08em] uppercase ${t.border} ${t.body}`}
                  >
                    {chip}
                  </li>
                ))}
              </ul>
              {section.note && <p className={`mt-5 text-[0.88rem] ${t.muted}`}>{section.note}</p>}
            </>
          )}

          {section.kind === "steps" && (
            <ol className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
              {section.steps.map((step, i) => (
                <li key={i} className={`rounded-[18px] border p-6 ${t.card}`}>
                  <p className="mb-3 font-mono text-[0.64rem] tracking-[0.16em] text-brand uppercase">
                    {step.day ?? `Step ${String(i + 1).padStart(2, "0")}`}
                  </p>
                  <h3 className={`mb-2 text-[1.02rem] font-semibold ${t.heading}`}>{step.title}</h3>
                  <p className={`text-[0.9rem] leading-relaxed ${t.body}`}>{step.text}</p>
                  {step.details && step.details.length > 0 && (
                    <ul className="mt-3 flex flex-col gap-2">
                      {step.details.map((d, di) => (
                        <li key={di} className={`flex items-start gap-2.5 text-[0.85rem] ${t.body}`}>
                          <Marker />
                          {d}
                        </li>
                      ))}
                    </ul>
                  )}
                  {step.note && <p className={`mt-3 text-[0.82rem] ${t.muted}`}>{step.note}</p>}
                </li>
              ))}
            </ol>
          )}

          {section.kind === "checklist" && (
            <ul className="grid max-w-[70ch] grid-cols-1 gap-3.5 sm:grid-cols-2">
              {section.items.map((item, i) => (
                <li key={i} className={`flex items-start gap-3 text-[0.94rem] leading-snug ${t.body}`}>
                  <Marker />
                  {item}
                </li>
              ))}
            </ul>
          )}

          {section.kind === "notes" && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {section.notes.map((note, i) => (
                <div key={i} className={`rounded-[18px] border p-6 ${t.card}`}>
                  <h3 className={`mb-2 text-[1.02rem] font-semibold ${t.heading}`}>{note.title}</h3>
                  <p className={`text-[0.92rem] leading-relaxed ${t.body}`}>{note.body}</p>
                </div>
              ))}
            </div>
          )}

          {section.kind === "table" && (
            /* Scrolls inside its own container so a wide table never makes the
               page itself scroll sideways. */
            <div className={`overflow-x-auto rounded-[18px] border ${t.border}`}>
              <table className="w-full min-w-[520px] border-collapse text-left">
                <thead>
                  <tr>
                    {section.columns.map((col, i) => (
                      <th
                        key={i}
                        scope="col"
                        className={`border-b px-5 py-4 font-mono text-[0.66rem] tracking-[0.16em] uppercase ${t.border} ${t.muted}`}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {section.rows.map((row, ri) => (
                    <tr key={ri}>
                      {row.map((cell, ci) => (
                        <td
                          key={ci}
                          className={`border-b px-5 py-4 align-top text-[0.92rem] leading-snug ${t.border} ${
                            ci === 0 ? `font-semibold ${t.heading}` : t.body
                          }`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {section.kind === "faq" && (
            <ul className={`max-w-[76ch] divide-y rounded-[18px] border ${t.border}`}>
              {section.faqs.map((faq, i) => (
                <li key={i} className={t.border}>
                  <details className="group px-6 py-5" open={i === 0}>
                    <summary
                      className={`flex cursor-pointer items-start justify-between gap-6 text-[1rem] font-semibold ${t.heading}`}
                    >
                      {faq.q}
                      <span aria-hidden="true" className="text-brand transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className={`mt-3 text-[0.94rem] leading-relaxed ${t.body}`}>{faq.a}</p>
                  </details>
                </li>
              ))}
            </ul>
          )}
          </div>
        </div>
      </div>
    </section>
  );
}
