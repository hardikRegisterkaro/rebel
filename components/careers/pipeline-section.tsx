import { PipelineForm } from "@/components/careers/pipeline-form";
import { CAREERS } from "@/lib/careers";

export function PipelineSection() {
  return (
    <section
      id="pipeline"
      aria-labelledby="pipeline-heading"
      className="scroll-mt-24 bg-paper text-light-fg"
    >
      <div className="mx-auto grid grid-cols-1 max-w-(--spacing-shell) items-start gap-[clamp(32px,5vw,64px)] px-6 py-[clamp(64px,10vh,110px)] sm:px-7 lg:grid-cols-[0.85fr_1.15fr]">
        <div data-reveal="fade-right">
          <p className="mb-4 inline-flex items-center gap-2.25 font-mono text-[0.68rem] tracking-[0.22em] text-brand uppercase">
            <span
              aria-hidden="true"
              className="inline-block size-[7px] bg-brand"
            />
            {CAREERS.pipeline.eyebrow}
          </p>
          <h2
            id="pipeline-heading"
            className="max-w-[14ch] text-[clamp(1.9rem,4vw,3rem)] leading-[1.05] font-semibold tracking-[-0.02em]"
          >
            {CAREERS.pipeline.heading}
            <span className="text-brand">?</span>
          </h2>

          <ul className="mt-6.5 flex flex-col gap-3.5">
            {CAREERS.pipeline.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="mt-1.75 inline-block size-1.5 flex-none bg-brand"
                />
                <span className="text-[0.9rem] leading-[1.55] text-[#333333]">
                  {bullet}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <PipelineForm />
      </div>
    </section>
  );
}
