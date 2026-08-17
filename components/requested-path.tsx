"use client";

import { usePathname } from "next/navigation";

/**
 * The path the visitor actually asked for, echoed into the 404's terminal line.
 *
 * A client component because the URL is the one thing a statically rendered
 * 404 cannot know: the page is prerendered once and served for every unmatched
 * route. Before hydration it shows the prompt's placeholder, which is why the
 * surrounding copy never depends on this text.
 */
export function RequestedPath() {
  const pathname = usePathname();

  return (
    <span className="min-w-0 break-all text-[#f5f5f5]">
      cd {pathname || "/"}
    </span>
  );
}
