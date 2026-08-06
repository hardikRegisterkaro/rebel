import { ROLES } from "@/lib/careers";

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
  { path: "/solutions/decision-intelligence", priority: 0.9 },
  { path: "/about", priority: 0.8 },
  { path: "/careers", priority: 0.8 },
  { path: "/contact", priority: 0.7 },
  { path: "/privacy", priority: 0.3 },
  { path: "/terms", priority: 0.3 },
  // Role pages are derived so a new opening is listed the moment it is added
  // to ROLES — there is no second place to remember to update.
  ...ROLES.map((role) => ({ path: `/careers/${role.slug}`, priority: 0.6 })),
];
