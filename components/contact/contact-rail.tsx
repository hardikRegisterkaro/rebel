import Link from "next/link";

import type { ContactContent } from "@/lib/careers-api";

const RAIL_CARD =
  "rounded-[18px] border border-black/[0.14] bg-paper px-5 py-5.5 transition-[transform,border-color] duration-300 ease-(--ease-out-soft) hover:-translate-y-0.75 hover:border-brand/45";

/** The column beside the form: direct routes in, proof, and where we are. */
export function ContactRail({
  rail,
  roleCount,
}: {
  rail: ContactContent["rail"];
  /** Published role count for the "Join the lab" card. Counted, never authored. */
  roleCount: number;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div
        data-reveal="fade-left"
        data-reveal-delay="1"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        {/* Every direct line in one card — email, phone, profile — so a
            visitor never has to hunt the footer for them. */}
        <div className={`flex flex-col gap-2 ${RAIL_CARD}`}>
          <span className="font-mono text-[0.58rem] tracking-[0.16em] text-brand uppercase">
            Fastest
          </span>
          <span className="text-[0.98rem] font-semibold">{rail.reach.heading}</span>
          <address className="flex flex-col items-start gap-1.5 not-italic">
            <a
              href={`mailto:${rail.reach.email}`}
              className="font-mono text-[0.74rem] break-words text-light-muted transition-colors hover:text-brand"
            >
              {rail.reach.email}
            </a>
            <a
              href={rail.reach.phoneHref}
              className="font-mono text-[0.74rem] text-light-muted transition-colors hover:text-brand"
            >
              {rail.reach.phone}
            </a>
            <a
              href={rail.reach.linkedinHref}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[0.74rem] break-words text-light-muted transition-colors hover:text-brand"
            >
              {rail.reach.linkedin}
            </a>
          </address>
        </div>

        <Link href={rail.join.href} className={`flex flex-col gap-2 ${RAIL_CARD}`}>
          <span className="font-mono text-[0.58rem] tracking-[0.16em] text-brand uppercase">
            Hiring
          </span>
          <span className="text-[0.98rem] font-semibold">{rail.join.heading}</span>
          <span className="font-mono text-[0.74rem] text-light-muted">
            {roleCount} open roles →
          </span>
        </Link>
      </div>

      <div
        data-reveal="fade-left"
        data-reveal-delay="2"
        className="rounded-[20px] bg-ink-800 px-6 py-6.5 text-dark-fg"
      >
        <p className="mb-5 font-mono text-[0.6rem] tracking-[0.2em] text-brand uppercase">
          {rail.eyebrow}
        </p>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {rail.stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1.5">
              <dd className="text-[1.3rem] leading-none font-bold tracking-[-0.03em]">
                {stat.value}
              </dd>
              <dt className="font-mono text-[0.54rem] tracking-[0.14em] text-dark-muted-2 uppercase">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>

      <div
        data-reveal="fade-left"
        data-reveal-delay="3"
        className="overflow-hidden rounded-[20px] border border-black/[0.14] bg-paper"
      >
        {/* Abstract "remote-first" panel — a grid with a single pulsing node
            rather than a map, since the lab has no head office to pin. */}
        <div className="relative h-[170px] bg-ink-800">
          <div
            aria-hidden="true"
            className="absolute inset-0 [background-image:linear-gradient(rgb(255_255_255/0.07)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.07)_1px,transparent_1px)] [background-size:24px_24px]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 [background:radial-gradient(circle_at_50%_52%,rgb(255_51_51/0.22),transparent_62%)]"
          />
          <span
            aria-hidden="true"
            className="absolute top-[52%] left-1/2 size-2.75 -translate-x-1/2 -translate-y-1/2 animate-(--animate-soft-pulse) rounded-full bg-brand shadow-[0_0_0_8px_rgb(255_51_51/0.18)]"
          />
          <span className="absolute bottom-3.5 left-4 font-mono text-[0.56rem] tracking-[0.16em] text-dark-muted-2 uppercase">
            {rail.location.caption}
          </span>
        </div>

        <div className="flex flex-col gap-3.5 px-5.5 pt-5.5 pb-6">
          <div className="flex flex-col gap-1.25">
            <p className="text-[0.98rem] font-semibold">
              {rail.location.title}
            </p>
            <p className="text-[0.86rem] leading-[1.55] text-light-muted">
              {rail.location.body}
            </p>
          </div>

          <dl className="flex flex-col gap-2 border-t border-black/10 pt-3.5">
            {rail.location.rows.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between gap-3"
              >
                <dt className="font-mono text-[0.62rem] tracking-[0.1em] text-light-faint uppercase">
                  {row.label}
                </dt>
                <dd
                  className={`font-mono text-[0.72rem] ${
                    "accent" in row && row.accent
                      ? "text-brand"
                      : "text-light-fg"
                  }`}
                >
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
