import { ABOUT, STORY_CARDS } from "@/lib/about";

/** 1px gaps over a dark backing paint the dividers between cells. */
const CELL_GRID =
  "grid grid-cols-1 gap-px overflow-hidden rounded-[22px] border border-black/[0.14] bg-black/[0.14]";

export function WhereWeAre() {
  return (
    <section
      id="story"
      aria-labelledby="story-heading"
      className="scroll-mt-24 border-t border-black/[0.08] bg-paper text-light-fg"
    >
      <div className="mx-auto max-w-(--spacing-shell) px-6 py-[clamp(64px,10vh,110px)] sm:px-7">
        <div data-reveal="fade-right" className="mb-[clamp(40px,6vh,64px)]">
          <p className="mb-4 inline-flex items-center gap-2.25 font-mono text-[0.68rem] tracking-[0.22em] text-brand uppercase">
            <span
              aria-hidden="true"
              className="inline-block size-[7px] bg-brand"
            />
            {ABOUT.story.eyebrow}
          </p>
          <h2
            id="story-heading"
            className="max-w-[18ch] text-[clamp(1.9rem,4vw,3rem)] leading-[1.05] font-semibold tracking-[-0.02em]"
          >
            {ABOUT.story.heading}
            <span className="text-brand">.</span>
          </h2>
          <p className="mt-5 max-w-[54ch] text-base leading-[1.65] text-light-muted text-pretty">
            {ABOUT.story.lede}
          </p>
        </div>

        <ul
          data-reveal="zoom-in"
          data-reveal-delay="1"
          className={`${CELL_GRID} sm:grid-cols-2 lg:grid-cols-3`}
        >
          {STORY_CARDS.map((card) => (
            <li
              key={card.title}
              className="flex min-h-[210px] flex-col gap-3 bg-paper p-[clamp(28px,3vw,38px)]"
            >
              <span className="font-mono text-[0.6rem] tracking-[0.16em] text-brand uppercase">
                {card.stage}
              </span>
              <h3 className="mt-1 text-[1.12rem] font-semibold tracking-[-0.01em]">
                {card.title}
              </h3>
              <p className="text-[0.9rem] leading-[1.6] text-light-muted">
                {card.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
