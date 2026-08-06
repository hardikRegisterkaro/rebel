import Link from "next/link";

import { CollaborateModal } from "@/components/about/collaborate-modal";

import { ABOUT } from "@/lib/about";
import { ROLES } from "@/lib/careers";

const PANEL = "flex flex-col gap-4.5 p-[clamp(36px,4.4vw,52px)]";
const PILL =
  "mt-auto inline-flex w-fit items-center gap-2.5 rounded-full px-5.5 py-3.25 text-[0.86rem] font-semibold transition-transform duration-300 ease-(--ease-out-soft) hover:-translate-y-0.5";

export function DualCta() {
  const { partners, careers } = ABOUT.dualCta;

  return (
    <section
      id="cta"
      aria-label="Work with us"
      className="scroll-mt-24 bg-paper"
    >
      <div className="mx-auto max-w-(--spacing-shell) px-6 py-[clamp(64px,10vh,110px)] sm:px-7">
        <div
          data-reveal="zoom-in"
          className="grid grid-cols-1 gap-px overflow-hidden rounded-[22px] border border-black/[0.14] bg-black/[0.14] lg:grid-cols-2"
        >
          <div className={`${PANEL} bg-ink text-dark-fg`}>
            <span className="font-mono text-[0.62rem] tracking-[0.16em] text-brand uppercase">
              {partners.eyebrow}
            </span>
            <h3 className="text-[clamp(1.4rem,2.4vw,2rem)] leading-[1.15] font-semibold tracking-[-0.015em]">
              {partners.heading}
              <span className="text-brand">.</span>
            </h3>
            <p className="text-[0.9rem] leading-[1.55] text-[#a8a8a8]">
              {partners.body}
            </p>
            <CollaborateModal
              label={partners.cta.label}
              context="Partner with the lab"
              className={`${PILL} group cursor-pointer bg-white text-ink hover:bg-[#e4e4e4]`}
            />
          </div>

          <div className={`${PANEL} bg-brand text-white`}>
            <span className="font-mono text-[0.62rem] tracking-[0.16em] text-white/80 uppercase">
              {careers.eyebrow}
            </span>
            <h3 className="text-[clamp(1.4rem,2.4vw,2rem)] leading-[1.15] font-semibold tracking-[-0.015em]">
              {careers.heading}
            </h3>
            <p className="text-[0.9rem] leading-[1.55] text-white/85">
              {careers.body.replace("{roles}", String(ROLES.length))}
            </p>
            <Link
              href={careers.cta.href}
              className={`${PILL} group bg-ink text-white hover:bg-ink-600`}
            >
              {careers.cta.label}
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
