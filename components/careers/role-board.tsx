"use client";

import Link from "next/link";
import { useState } from "react";

import {
  CAREERS,
  ROLES,
  ROLES_PER_PAGE,
  ROLE_FILTERS,
  type RoleFilter,
} from "@/lib/careers";

/**
 * The open-roles board. Filtering and paging are the only stateful things on
 * the page, so this is the sole client component in the careers route — the
 * surrounding sections stay server-rendered.
 */
export function RoleBoard() {
  const [filter, setFilter] = useState<RoleFilter>("All Roles");
  const [shown, setShown] = useState(ROLES_PER_PAGE);

  const matching =
    filter === "All Roles"
      ? ROLES
      : ROLES.filter((role) => role.discipline === filter);
  const visible = matching.slice(0, shown);
  const canLoadMore = visible.length < matching.length;

  return (
    <section
      id="roles"
      aria-labelledby="roles-heading"
      className="scroll-mt-24 border-t border-black/[0.08] bg-paper text-light-fg"
    >
      <div className="mx-auto max-w-(--spacing-shell) px-6 py-[clamp(64px,10vh,110px)] sm:px-7">
        <div
          data-reveal="fade-right"
          className="mb-[clamp(32px,4.5vh,48px)] flex flex-wrap items-end justify-between gap-5"
        >
          <div>
            <p className="mb-4 inline-flex items-center gap-2.25 font-mono text-[0.68rem] tracking-[0.22em] text-brand uppercase">
              <span
                aria-hidden="true"
                className="inline-block size-[7px] bg-brand"
              />
              {CAREERS.roles.eyebrow}
            </p>
            <h2
              id="roles-heading"
              className="max-w-[16ch] text-[clamp(1.9rem,4vw,3rem)] leading-[1.05] font-semibold tracking-[-0.02em]"
            >
              {CAREERS.roles.heading}
              <span className="text-brand">.</span>
            </h2>
          </div>
          <p className="m-0 max-w-[34ch] text-[0.94rem] leading-relaxed text-light-muted">
            {CAREERS.roles.aside}
          </p>
        </div>

        <div
          data-reveal="fade-up"
          data-reveal-delay="1"
          className="mb-7 flex flex-wrap gap-2"
          role="group"
          aria-label="Filter roles by discipline"
        >
          {ROLE_FILTERS.map((option) => {
            const active = option === filter;
            return (
              <button
                key={option}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setFilter(option);
                  setShown(ROLES_PER_PAGE);
                }}
                className={`cursor-pointer rounded-full border px-4 py-2.25 font-mono text-[0.68rem] tracking-[0.08em] uppercase transition-[background-color,color,border-color] duration-250 ${
                  active
                    ? "border-light-fg bg-light-fg text-white"
                    : "border-black/[0.22] bg-transparent text-light-muted hover:border-light-fg hover:text-light-fg"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>

        <ul
          data-reveal="fade-up"
          data-reveal-delay="2"
          className="flex flex-col"
        >
          {visible.map((role) => (
            <li
              key={role.title}
              // -1px margin collapses the shared border between adjacent rows.
              className="group -mb-px grid grid-cols-1 items-center gap-x-6 gap-y-3.5 border border-black/[0.08] border-l-[3px] border-l-brand bg-paper px-6 py-5 transition-colors duration-300 hover:border-black/[0.14] hover:border-l-brand sm:grid-cols-[1fr_auto_auto]"
            >
              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-2.25">
                  <span className="rounded-full border border-brand/35 px-2.5 py-0.75 font-mono text-[0.58rem] tracking-[0.12em] text-brand uppercase">
                    {role.discipline}
                  </span>
                  {role.featured && (
                    <span className="font-mono text-[0.56rem] tracking-[0.12em] text-light-faint uppercase">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-[1.02rem] font-semibold tracking-[-0.01em]">
                  {role.title}
                </p>
                <p className="mt-1.25 font-mono text-[0.68rem] text-[#7a7a7a]">
                  {role.meta} · {role.posted}
                </p>
              </div>

              <p className="text-[0.92rem] font-semibold whitespace-nowrap">
                {role.comp}
              </p>

              <Link
                href={`/careers/${role.slug}`}
                className="justify-self-start rounded-full border border-black/[0.14] bg-paper px-4.5 py-2.25 text-[0.82rem] font-semibold whitespace-nowrap text-light-fg transition-colors duration-250 group-hover:bg-light-fg group-hover:text-white sm:justify-self-auto"
              >
                Apply <span aria-hidden="true">→</span>
                <span className="sr-only"> for {role.title}</span>
              </Link>
            </li>
          ))}
        </ul>

        {canLoadMore && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setShown((count) => count + ROLES_PER_PAGE)}
              className="cursor-pointer rounded-full border border-black/20 px-6.5 py-3 font-mono text-[0.68rem] tracking-[0.12em] text-light-fg uppercase transition-colors duration-300 hover:bg-light-fg hover:text-white"
            >
              [ Load More Roles ]
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
