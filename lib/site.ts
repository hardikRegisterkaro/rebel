/**
 * Canonical origin, shared by `metadataBase`, robots, and the sitemap so the
 * three can never disagree. Override per environment with NEXT_PUBLIC_SITE_URL
 * (preview deploys, staging) — it must be an absolute URL with a scheme.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://rebel-labz.com";

/**
 * Every route that should appear in the sitemap.
 *
 * Kept as an explicit list rather than derived from the filesystem: this is the
 * public-facing surface, and a new route should be a deliberate addition here.
 * `changeFrequency` and `priority` are hints only — search engines mostly
 * ignore them, but they cost nothing to state accurately.
 */
export const SITEMAP_ROUTES: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/about", priority: 0.8 },
  { path: "/careers", priority: 0.8 },
  { path: "/contact", priority: 0.7 },
  { path: "/privacy", priority: 0.3 },
  { path: "/terms", priority: 0.3 },
  // Not listed here, because each is owned by another sitemap in the index:
  // /blog and its posts live in blog-sitemap.xml, solution pages in
  // service-sitemap.xml, and role pages are appended to this one at request
  // time from the CMS. A URL belongs to exactly one sitemap.
];

/** Priority applied to each CMS-sourced role page in the sitemap. */
export const ROLE_SITEMAP_PRIORITY = 0.6;

/** Priority applied to each CMS-sourced solution page in the sitemap. */
export const SOLUTION_SITEMAP_PRIORITY = 0.9;
