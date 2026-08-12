import Image from "next/image";
import Link from "next/link";

import { FOOTER_GROUPS, SITE } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-ink">
      <div className="mx-auto grid max-w-(--spacing-shell) gap-[clamp(28px,4vw,64px)] px-6 pt-14 pb-10 sm:px-7 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <Image
            src="/brand/logo.svg"
            alt={SITE.name}
            width={748}
            height={173}
            loading="lazy"
            className="h-[30px] w-auto self-start"
          />
          <p className="max-w-[30ch] text-[0.85rem] leading-relaxed text-[#7a7a7a]">
            {SITE.tagline}
          </p>

          <address className="mt-1 flex flex-col items-start gap-2 not-italic">
            <a
              href={`mailto:${SITE.email}`}
              className="text-[0.85rem] text-[#b0b0b0] transition-colors hover:text-brand"
            >
              {SITE.email}
            </a>
            <a
              href={SITE.phoneHref}
              className="font-mono text-[0.85rem] text-[#b0b0b0] transition-colors hover:text-brand"
            >
              {SITE.phone}
            </a>
            <a
              href={SITE.linkedinHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[0.85rem] text-[#b0b0b0] transition-colors hover:text-brand"
            >
              {SITE.linkedin}
            </a>
          </address>
        </div>

        {FOOTER_GROUPS.map((group) => (
          <nav
            key={group.label}
            aria-label={group.label}
            className="flex flex-col gap-3"
          >
            <h2 className="mb-1 font-mono text-[0.6rem] tracking-[0.2em] text-dark-faint-2 uppercase">
              {group.label}
            </h2>
            {/* `href` is optional on NavLink because a dropdown parent in the
                header ("Solutions") is a section heading with no page of its
                own. A footer column is a flat list of destinations, so an entry
                without one has nothing to point at and is dropped. The type
                predicate is what lets TypeScript see `href` as a string below —
                filtering on a truthy check alone would not narrow it. */}
            {group.links
              .filter((link): link is typeof link & { href: string } => Boolean(link.href))
              .map((link) => (
              <Link
                key={link.label}
                href={link.href}
                prefetch={false}
                className="text-[0.85rem] text-[#b0b0b0] transition-colors duration-200 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-(--spacing-shell) flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 py-4.5 font-mono text-[0.6rem] tracking-[0.15em] text-dark-faint-2 uppercase sm:px-7">
          <span>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </span>

          {/* Legal links live here rather than in a nav group: a privacy
              policy has to be reachable from every page to do its job. */}
          <nav aria-label="Legal" className="flex items-center gap-5">
            <Link
              href="/privacy"
              prefetch={false}
              className="transition-colors hover:text-brand"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              prefetch={false}
              className="transition-colors hover:text-brand"
            >
              Terms
            </Link>
          </nav>

          <span className="inline-flex items-center gap-2">
            <span
              aria-hidden="true"
              className="inline-block size-[5px] bg-brand"
            />
            Built in the open
          </span>
        </div>
      </div>
    </footer>
  );
}
