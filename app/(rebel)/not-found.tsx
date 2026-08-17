import type { Metadata } from "next";

import { NotFoundView } from "@/components/not-found-view";

export const metadata: Metadata = {
  title: "Page not found",
  // A 404 must never be indexed, whatever URL it was served for.
  robots: { index: false, follow: true },
};

/**
 * 404 for anything inside the site's route group — a `notFound()` thrown by a
 * blog post, a role or a solution page.
 *
 * The group layout already supplies the header, footer and fonts, so this is
 * only the body. Unmatched URLs are handled by app/not-found.tsx instead,
 * which has to bring its own chrome.
 */
export default function NotFound() {
  return <NotFoundView />;
}
