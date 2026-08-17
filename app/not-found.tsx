import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";

import { NotFoundView } from "@/components/not-found-view";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteHeader } from "@/lib/header-menu-api";

// The mono face lives in the route-group layout, which does not wrap this file
// — an unmatched URL never enters the group. Loaded here so the terminal line
// and the eyebrows render in the right face rather than falling back to the
// system monospace.
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Page not found · Rebel Labz",
  robots: { index: false, follow: true },
};

/**
 * The 404 for URLs that match no route at all — /asd, an old link, a typo.
 *
 * Next renders this inside the ROOT layout, which is only <html>/<body>: the
 * header and footer belong to app/(rebel)/layout, and an unmatched URL never
 * reaches it. Without bringing them in here, a visitor who mistypes a URL
 * lands on a page with no way to navigate anywhere.
 */
export default async function NotFound() {
  // Same CMS-driven nav as every other page, with the same shipped fallback if
  // the CMS is unreachable.
  const header = await getSiteHeader();

  return (
    <div className={`${jetbrainsMono.variable} flex min-h-full flex-col`}>
      <SiteHeader nav={header.nav} cta={header.cta} />
      <main id="main" className="flex-1">
        <NotFoundView />
      </main>
      <SiteFooter />
    </div>
  );
}
