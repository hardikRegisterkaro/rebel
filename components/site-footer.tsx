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
            width={383}
            height={62}
            loading="lazy"
            className="h-[30px] w-auto self-start"
          />
          <p className="max-w-[30ch] text-[0.85rem] leading-relaxed text-[#7a7a7a]">
            {SITE.tagline}
          </p>
        </div>

        {FOOTER_GROUPS.map((group) => (
          <nav key={group.label} aria-label={group.label} className="flex flex-col gap-3">
            <h2 className="mb-1 font-mono text-[0.6rem] tracking-[0.2em] text-dark-faint-2 uppercase">
              {group.label}
            </h2>
            {group.links.map((link) => (
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
        <div className="mx-auto flex max-w-(--spacing-shell) items-center justify-between gap-4 px-6 py-4.5 font-mono text-[0.6rem] tracking-[0.15em] text-dark-faint-2 uppercase sm:px-7">
          <span>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </span>
          <span className="inline-flex items-center gap-2">
            <span aria-hidden="true" className="inline-block size-[5px] bg-brand" />
            Built in the open
          </span>
        </div>
      </div>
    </footer>
  );
}
