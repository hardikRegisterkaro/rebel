"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";

import { HEADER_CTA, PRIMARY_NAV, type NavItem } from "@/lib/content";

/** Same-page anchors the header highlights while their section is on screen. */
const SPY_SECTIONS = ["offerings", "openlab"] as const;

export function SiteHeader() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const mobileMenuId = useId();
  const pathname = usePathname();

  // The header lives in the root layout, so it is never remounted by a
  // navigation — close the sheet ourselves when the route changes. Adjusting
  // state during render (rather than in an effect) avoids committing a frame
  // with the sheet still open over the new page.
  const [sheetRoute, setSheetRoute] = useState(pathname);
  if (sheetRoute !== pathname) {
    setSheetRoute(pathname);
    setMobileOpen(false);
    setOpenMenu(null);
    // Clear the spy here rather than in the effect below: the incoming route
    // may have no spied sections at all, in which case the effect bails early
    // and would leave the previous page's highlight stuck on.
    setActiveSection(null);
  }

  // Scroll spy — a section counts as active while it straddles the viewport's
  // middle band. Ties resolve in SPY_SECTIONS order. Re-runs per route: the
  // spied sections only exist on some pages, and this component survives
  // navigation, so a mount-only effect would never re-attach on the way back.
  useEffect(() => {
    const sections = SPY_SECTIONS.map((id) =>
      document.getElementById(id),
    ).filter((element): element is HTMLElement => element !== null);
    if (sections.length === 0) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        setActiveSection(SPY_SECTIONS.find((id) => visible.has(id)) ?? null);
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  // Close the mobile sheet on Escape, and lock the page behind it.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isCurrent = (item: NavItem) =>
    item.spy
      ? activeSection === item.spy
      : item.href !== "/" && pathname.startsWith(item.href);

  return (
    <header className="sticky top-0 z-50 px-4">
      <div className="mx-auto mt-3.5 flex h-16 w-full max-w-(--spacing-shell-nav) items-center gap-4 rounded-[18px] border border-white/10 bg-[#0c0c0c]/75 py-2 pr-2.5 pl-5 shadow-[0_14px_44px_-22px_rgb(0_0_0/0.95),inset_0_1px_0_rgb(255_255_255/0.05)] backdrop-blur-lg backdrop-saturate-150 lg:h-17 lg:pl-[22px]">
        <Link
          href="/"
          className="flex flex-none items-center"
          aria-label="Rebel Labz — home"
        >
          <Image
            src="/brand/logo.svg"
            alt="Rebel Labz"
            width={748}
            height={173}
            priority
            className="h-7 w-auto lg:h-[31px]"
          />
        </Link>

        {/* ── Desktop navigation ─────────────────────────────────────── */}
        <nav
          aria-label="Primary"
          className="hidden flex-1 items-center justify-center gap-1 text-[0.8rem] font-medium lg:flex"
        >
          {PRIMARY_NAV.map((item) =>
            item.links ? (
              <div
                key={item.label}
                className="group relative"
                onMouseEnter={() => setOpenMenu(item.label)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <NavLink
                  href={item.href}
                  active={isCurrent(item)}
                  prefetch={false}
                  aria-expanded={openMenu === item.label}
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className="ml-1.5 inline-block text-[0.55rem] text-white/40 transition-[transform,color] duration-300 group-hover:rotate-180 group-hover:text-brand"
                  >
                    ▼
                  </span>
                </NavLink>

                <div className="invisible absolute top-full left-1/2 z-10 -translate-x-1/2 translate-y-2.5 pt-4 opacity-0 transition-[opacity,transform,visibility] duration-300 ease-(--ease-out-soft) group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  <div className="flex w-[300px] flex-col gap-0.5 rounded-2xl border border-white/10 bg-[#0e0e0e]/[0.97] p-2.5 shadow-[0_30px_70px_-20px_rgb(0_0_0/0.9)] backdrop-blur-xl">
                    {item.links.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        prefetch={false}
                        className="group/link flex items-center justify-between gap-3 rounded-[10px] px-3 py-2.5 transition-colors duration-200 hover:bg-white/5"
                      >
                        <span className="flex flex-col gap-0.5">
                          <span className="text-[0.82rem] text-white/70 transition-colors duration-200 group-hover/link:text-white">
                            {link.label}
                          </span>
                          {link.detail && (
                            <span className="text-[0.7rem] text-white/35">
                              {link.detail}
                            </span>
                          )}
                        </span>
                        <span
                          aria-hidden="true"
                          className="-translate-x-1 text-[0.7rem] text-brand opacity-0 transition-[opacity,transform] duration-200 group-hover/link:translate-x-0 group-hover/link:opacity-100"
                        >
                          →
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <NavLink
                key={item.label}
                href={item.href}
                prefetch={false}
                active={isCurrent(item)}
              >
                {item.label}
              </NavLink>
            ),
          )}
        </nav>

        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          <p className="hidden flex-none items-center gap-[7px] border-r border-white/10 pr-4 font-mono text-[0.58rem] tracking-[0.16em] text-[#7a7a7a] uppercase xl:flex">
            <span
              aria-hidden="true"
              className="inline-block size-1.5 animate-(--animate-soft-pulse) rounded-full bg-brand"
            />
            Systems Online
          </p>

          <Link
            href={HEADER_CTA.href}
            className="hidden flex-none rounded-xl bg-brand px-5 py-2.5 text-[0.8rem] font-semibold text-white transition-[transform,background-color,box-shadow] duration-300 ease-(--ease-out-soft) hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-[0_0_26px_-4px_rgb(255_51_51/0.75)] sm:block"
          >
            {HEADER_CTA.label}
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls={mobileMenuId}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="flex size-10 flex-none items-center justify-center rounded-xl border border-white/15 text-white transition-colors duration-200 hover:bg-white/5 lg:hidden"
          >
            <span aria-hidden="true" className="relative block h-3 w-4">
              <span
                className={`absolute inset-x-0 top-0 h-px bg-current transition-transform duration-300 ${mobileOpen ? "translate-y-1.5 rotate-45" : ""}`}
              />
              <span
                className={`absolute inset-x-0 top-1.5 h-px bg-current transition-opacity duration-200 ${mobileOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`absolute inset-x-0 top-3 h-px bg-current transition-transform duration-300 ${mobileOpen ? "-translate-y-1.5 -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* ── Mobile sheet ─────────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          id={mobileMenuId}
          className="mx-auto mt-2 max-h-[calc(100dvh-7rem)] w-full max-w-(--spacing-shell-nav) overflow-y-auto rounded-[18px] border border-white/10 bg-[#0e0e0e]/[0.98] p-5 shadow-[0_30px_70px_-20px_rgb(0_0_0/0.9)] backdrop-blur-xl lg:hidden"
        >
          <nav aria-label="Mobile" className="flex flex-col gap-6">
            {PRIMARY_NAV.map((item) => (
              <div key={item.label} className="flex flex-col gap-1">
                {item.links ? (
                  <>
                    <p className="pb-1 font-mono text-[0.58rem] tracking-[0.18em] text-brand uppercase">
                      {item.label}
                    </p>
                    {item.links.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        prefetch={false}
                        onClick={() => setMobileOpen(false)}
                        className="rounded-lg py-2 text-sm text-white/70 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    prefetch={false}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg py-2 text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}

            <Link
              href={HEADER_CTA.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-xl bg-brand px-5 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
            >
              {HEADER_CTA.label}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

function NavLink({
  href,
  active,
  prefetch,
  children,
  ...rest
}: {
  href: string;
  active?: boolean;
  prefetch?: false;
  children: React.ReactNode;
} & React.ComponentProps<"a">) {
  return (
    <Link
      href={href}
      prefetch={prefetch}
      aria-current={active ? "page" : undefined}
      className={`inline-flex items-center rounded-[11px] px-[15px] py-2 transition-[background-color,color] duration-250 hover:bg-white/[0.06] hover:text-white ${
        active ? "bg-white/[0.07] text-white" : "text-white/60"
      }`}
      {...rest}
    >
      <span
        aria-hidden="true"
        className={`mr-[7px] inline-block size-1 rounded-full bg-brand transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          active ? "scale-100 opacity-100" : "scale-0 opacity-0"
        }`}
      />
      {children}
    </Link>
  );
}
