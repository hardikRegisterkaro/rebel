import Link from "next/link";

/**
 * Renders a plain `<a>` for same-page fragments and `next/link` for real routes.
 *
 * The App Router treats a fragment-only href as a navigation and takes over the
 * scroll itself, which does not reliably land on the target. A bare anchor lets
 * the browser do its native hash jump instead — and because <html> carries
 * `scroll-behavior: smooth` (plus `data-scroll-behavior`, which Next 16 needs to
 * leave that alone), it still animates.
 *
 * Anything that is an actual route keeps Link's prefetching and client-side
 * transition, so a CTA whose href later changes from "#section" to "/page"
 * upgrades automatically without touching the call site.
 */
export function SmartLink({
  href,
  children,
  ...rest
}: React.ComponentProps<"a"> & { href: string }) {
  if (href.startsWith("#")) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}
