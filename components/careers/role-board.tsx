"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { ROLES_PER_PAGE, ROLE_FILTERS, type Role } from "@/lib/careers";
import type { CareersContent } from "@/lib/careers-api";

/**
 * How many discipline chips to show before collapsing the rest behind a
 * "+N more" toggle. Disciplines are editor-managed, so the list can grow
 * without warning — past this the row wraps into several lines and stops
 * reading as a filter bar.
 */
const MAX_VISIBLE_FILTERS = 6;

/** CMS origin, read at build time so the browser can page through the API. */
const CMS_URL = (
  process.env.NEXT_PUBLIC_CMS_API_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

/**
 * Placeholder rows shown while the next page is being fetched.
 *
 * Mirrors the real row's grid so the list does not change height or shift the
 * pagination controls under the cursor mid-click.
 */
function RoleSkeleton({ count }: { count: number }) {
  return (
    <ul aria-hidden="true" className="flex flex-col">
      {Array.from({ length: count }, (_, i) => (
        <li
          key={i}
          className="-mb-px grid animate-pulse grid-cols-1 items-center gap-x-6 gap-y-3.5 border border-black/[0.08] border-l-[3px] border-l-brand/40 bg-paper px-6 py-5 sm:grid-cols-[1fr_auto_auto]"
        >
          <div className="min-w-0">
            <div className="mb-2 h-[1.15rem] w-24 rounded-full bg-black/[0.07]" />
            <div className="h-[1.15rem] w-2/3 max-w-sm rounded bg-black/[0.09]" />
            <div className="mt-2 h-[0.8rem] w-44 rounded bg-black/[0.05]" />
          </div>
          <div className="h-[0.95rem] w-24 rounded bg-black/[0.07]" />
          <div className="h-[2.4rem] w-24 rounded-full bg-black/[0.05]" />
        </li>
      ))}
    </ul>
  );
}

type Props = {
  /** The current page of published roles, already filtered and paged server-side. */
  roles: Role[];
  /** Total roles matching the active filter — drives the page count. */
  total?: number;
  /** Section copy from the CMS — heading only; the listing is unaffected. */
  header: CareersContent["roles"];
  /** Current 1-based page, from the URL. */
  page?: number;
  /** Active discipline, or "" for all — from the URL. */
  discipline?: string;
  /**
   * Filter chips, "All Roles" first. Defaults to the static discipline list so
   * the board still renders if the CMS returned no tabs.
   */
  filters?: readonly string[];
};

/**
 * The open-roles board. Filtering and paging are the only stateful things on
 * the page, so this is the sole client component in the careers route — the
 * surrounding sections stay server-rendered.
 *
 * Roles arrive as props rather than being imported: they come from the CMS,
 * which is fetched by the server component that renders this.
 */
export function RoleBoard({
  header,
  roles: initialRoles,
  total: initialTotal = initialRoles.length,
  page: initialPage = 1,
  discipline: initialDiscipline = "",
  filters = ROLE_FILTERS,
}: Props) {
  // The first page is server-rendered for SEO and first paint; every change
  // after that is fetched straight from the CMS. Going back through Next for a
  // full server re-render made each click wait on the whole page, and this list
  // is the only part of it that actually changes.
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(initialPage);
  const [discipline, setDiscipline] = useState(initialDiscipline);
  const [loading, setLoading] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState(false);

  // "All Roles" is the UI label for "no filter"; the URL simply omits the param.
  const filter = discipline || "All Roles";
  const totalPages = Math.max(1, Math.ceil(total / ROLES_PER_PAGE));

  /**
   * Discards responses that arrive out of order.
   *
   * Clicking 2 then 3 quickly can land 2's slower response last and leave the
   * board showing page 2 while the URL and controls say 3.
   */
  const requestId = useRef(0);

  const fetchRoles = useCallback(async (nextPage: number, nextDiscipline: string) => {
    const id = ++requestId.current;
    const params = new URLSearchParams({
      page: String(nextPage),
      limit: String(ROLES_PER_PAGE),
    });
    if (nextDiscipline) params.set("category", nextDiscipline);

    setLoading(true);
    try {
      // Same reasoning as the server fetch: a CMS that never answers must not
      // leave the board stuck on its skeleton forever.
      const res = await fetch(`${CMS_URL}/api/careers/client?${params}`, {
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok || id !== requestId.current) return;
      const data = await res.json();
      if (id !== requestId.current) return;
      setRoles(data.roles ?? []);
      setTotal(data.pagination?.totalCount ?? data.total ?? 0);
    } catch {
      // Leave the current page on screen rather than blanking the board.
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, []);

  /** Serialise the controls into a query string, omitting the defaults. */
  const toQuery = (nextPage: number, nextDiscipline: string) => {
    const params = new URLSearchParams();
    if (nextDiscipline) params.set("discipline", nextDiscipline);
    if (nextPage > 1) params.set("page", String(nextPage));
    const query = params.toString();
    return query ? `?${query}` : window.location.pathname;
  };

  const go = (nextPage: number, nextDiscipline: string) => {
    setPage(nextPage);
    setDiscipline(nextDiscipline);
    // pushState rather than router.push: the URL must stay shareable and the
    // back button must work, but nothing on the server needs to re-render.
    window.history.pushState(null, "", toQuery(nextPage, nextDiscipline));
    fetchRoles(nextPage, nextDiscipline);
  };

  const changeFilter = (next: string) => go(1, next === "All Roles" ? "" : next);
  const changePage = (next: number) => go(next, discipline);

  // Because the URL is driven with pushState, the back/forward buttons change
  // it without React knowing — this puts the board back in step.
  useEffect(() => {
    const onPopState = () => {
      const params = new URLSearchParams(window.location.search);
      const nextDiscipline = params.get("discipline") ?? "";
      const nextPage = Math.max(1, Number(params.get("page")) || 1);
      setPage(nextPage);
      setDiscipline(nextDiscipline);
      fetchRoles(nextPage, nextDiscipline);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [fetchRoles]);

  /**
   * Chips shown in the bar. The active one is always included even when it
   * falls in the collapsed tail, so the current filter is never invisible.
   */
  const visibleFilters = (() => {
    if (expandedFilters || filters.length <= MAX_VISIBLE_FILTERS) return filters;
    const head = filters.slice(0, MAX_VISIBLE_FILTERS);
    return head.includes(filter) ? head : [...head.slice(0, -1), filter];
  })();
  const hiddenCount = filters.length - visibleFilters.length;

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
              {header.eyebrow}
            </p>
            <h2
              id="roles-heading"
              className="max-w-[16ch] text-[clamp(1.9rem,4vw,3rem)] leading-[1.05] font-semibold tracking-[-0.02em]"
            >
              {header.heading}
              <span className="text-brand">.</span>
            </h2>
          </div>
          <p className="m-0 max-w-[34ch] text-[0.94rem] leading-relaxed text-light-muted">
            {header.aside}
          </p>
        </div>

        <div
          data-reveal="fade-up"
          data-reveal-delay="1"
          className="mb-7 flex flex-wrap gap-2"
          role="group"
          aria-label="Filter roles by discipline"
        >
          {visibleFilters.map((option) => {
            const active = option === filter;
            return (
              <button
                key={option}
                type="button"
                aria-pressed={active}
                onClick={() => changeFilter(option)}
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

          {/* Disciplines are editor-managed, so the row is capped rather than
              allowed to wrap into several lines as the taxonomy grows. */}
          {(hiddenCount > 0 || expandedFilters) && (
            <button
              type="button"
              onClick={() => setExpandedFilters((open) => !open)}
              aria-expanded={expandedFilters}
              className="cursor-pointer rounded-full border border-dashed border-black/[0.28] px-4 py-2.25 font-mono text-[0.68rem] tracking-[0.08em] text-light-muted uppercase transition-[background-color,color,border-color] duration-250 hover:border-light-fg hover:text-light-fg"
            >
              {expandedFilters ? "Show less" : `+${hiddenCount} more`}
            </button>
          )}
        </div>

        {/* The reveal attributes live on this wrapper, NOT on the list itself.
            <RevealObserver> scans for [data-reveal] once per pathname, and the
            board changes pages via pushState — which does not change the
            pathname. Putting them on the list meant every swap mounted a fresh
            element the observer never saw, leaving it stuck at opacity 0 until
            a full reload. This wrapper is never unmounted, so it is revealed
            once and stays revealed. */}
        <div data-reveal="fade-up" data-reveal-delay="2">
        {loading ? (
          <RoleSkeleton count={roles.length || ROLES_PER_PAGE} />
        ) : roles.length === 0 ? (
          /* Reached when the discipline has no openings, and also when the CMS
             is unreachable — better an honest message than a blank strip that
             reads as a broken page. */
          <div className="border border-black/[0.08] border-l-[3px] border-l-brand bg-paper px-6 py-12 text-center">
            <p className="text-[1.02rem] font-semibold tracking-[-0.01em]">
              No open roles here right now.
            </p>
            <p className="mt-2 text-[0.92rem] text-light-muted">
              {filter === "All Roles"
                ? "Nothing is posted at the moment — check back soon, or reach out anyway."
                : `Nothing open in ${filter} today. Try another discipline.`}
            </p>
          </div>
        ) : (
        <ul className="flex flex-col">
          {roles.map((role) => (
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
        )}
        </div>

        {/* Server-side pagination: each page is a fresh request to the CMS, so
            the board can walk every published role rather than only the ones
            sent on first render. */}
        {totalPages > 1 && (
          <nav
            aria-label="Roles pagination"
            className="mt-8 flex flex-wrap items-center justify-center gap-2"
          >
            <button
              type="button"
              disabled={page === 1 || loading}
              onClick={() => changePage(Math.max(1, page - 1))}
              className="cursor-pointer rounded-full border border-black/20 px-5 py-2.5 font-mono text-[0.68rem] tracking-[0.12em] text-light-fg uppercase transition-colors duration-300 hover:bg-light-fg hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-light-fg"
            >
              ← Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                aria-current={n === page ? "page" : undefined}
                disabled={loading}
                onClick={() => changePage(n)}
                className={`cursor-pointer rounded-full border px-4 py-2.5 font-mono text-[0.68rem] tracking-[0.08em] uppercase transition-colors duration-250 disabled:cursor-not-allowed ${
                  n === page
                    ? "border-light-fg bg-light-fg text-white"
                    : "border-black/[0.22] bg-transparent text-light-muted hover:border-light-fg hover:text-light-fg"
                }`}
              >
                {n}
              </button>
            ))}

            <button
              type="button"
              disabled={page === totalPages || loading}
              onClick={() => changePage(Math.min(totalPages, page + 1))}
              className="cursor-pointer rounded-full border border-black/20 px-5 py-2.5 font-mono text-[0.68rem] tracking-[0.12em] text-light-fg uppercase transition-colors duration-300 hover:bg-light-fg hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-light-fg"
            >
              Next →
            </button>
          </nav>
        )}

        <p className="mt-4 text-center font-mono text-[0.68rem] tracking-[0.12em] text-light-faint uppercase">
          {loading
            ? "Loading…"
            : `Showing ${roles.length} of ${total} ${total === 1 ? "role" : "roles"}`}
        </p>

      </div>
    </section>
  );
}
