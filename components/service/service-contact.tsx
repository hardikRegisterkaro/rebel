import { CollaborationForm } from "@/components/service/collaboration-form";
import { SITE } from "@/lib/content";
import type { Solution } from "@/lib/solutions";

export function ServiceContact({ solution }: { solution: Solution }) {
  return (
    <section
      id="openlab"
      aria-labelledby="contact-heading"
      className="scroll-mt-24 border-t border-black/[0.08] bg-paper text-light-fg"
    >
      <div className="mx-auto grid grid-cols-1 max-w-(--spacing-shell) items-start gap-[clamp(36px,5vw,80px)] px-6 pt-[clamp(72px,11vh,124px)] pb-[clamp(64px,9vh,100px)] sm:px-7 lg:grid-cols-[1.05fr_0.95fr]">
        <div data-reveal="fade-right">
          <p className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-black/[0.14] px-4 py-2 text-[0.74rem] tracking-[0.12em] text-light-muted-2">
            <span
              aria-hidden="true"
              className="inline-block size-[7px] animate-(--animate-soft-pulse) rounded-full bg-brand"
            />
            Lab Status: Open
          </p>

          <h2
            id="contact-heading"
            className="max-w-[18ch] text-[clamp(2.1rem,4.6vw,3.6rem)] leading-[1.02] font-semibold tracking-[-0.024em] text-balance"
          >
            The most important <em className="italic">conversations</em>{" "}
            shouldn&apos;t require a login.
          </h2>

          <p className="mt-7 max-w-[46ch] text-[clamp(1rem,1.5vw,1.22rem)] leading-relaxed text-light-fg-2">
            Bring us the decision you&apos;re stuck on. We scope fast, ship a
            working pilot in weeks, and measure success against your outcome —
            not our hours.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-6.5 gap-y-3 font-mono text-[0.68rem] text-light-muted-2">
            <span className="inline-flex items-center gap-2">
              <span
                aria-hidden="true"
                className="inline-block size-[7px] animate-(--animate-soft-pulse) rounded-full bg-brand"
              />
              [ Lab Node: Online / Open to Collaboration ]
            </span>
            <span>
              or write to{" "}
              <a
                href={`mailto:${SITE.email}`}
                className="underline underline-offset-2 hover:text-brand"
              >
                {SITE.email}
              </a>
            </span>
          </div>
        </div>

        <CollaborationForm
          interests={solution.interests}
          subjectPrefix={solution.title}
        />
      </div>
    </section>
  );
}
