/**
 * Sitemap plumbing: the CMS reads behind each child sitemap, and the XML.
 *
 * The site publishes a sitemap *index* rather than one file — /sitemap.xml
 * points at three children, so a crawler can refetch just the section that
 * changed, and none of them can grow past the 50,000-URL limit as the blog
 * fills up.
 */
import { SITE_URL } from "@/lib/site";

const CMS_URL = (process.env.CMS_API_URL ?? "http://localhost:3000").replace(/\/$/, "");
const REVALIDATE_SECONDS = 3600;
const REQUEST_TIMEOUT_MS = 8000;

/** One entry, already resolved to an absolute URL. */
export type SitemapEntry = {
  url: string;
  lastModified?: string | Date;
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
};

/**
 * A CMS read that never throws.
 *
 * A sitemap must not 500 because the CMS blinked: a crawler treats that as the
 * whole section disappearing. An empty list drops those URLs from this fetch
 * and they return on the next one.
 */
async function getJson<T>(path: string, tag: string): Promise<T | null> {
  try {
    const res = await fetch(`${CMS_URL}${path}`, {
      cache: "force-cache",
      next: { revalidate: REVALIDATE_SECONDS, tags: [tag] },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch (error) {
    console.error(
      `[sitemap] CMS request failed at ${CMS_URL}${path}:`,
      error instanceof Error ? error.message : error
    );
    return null;
  }
}

/** Published solution pages, with the date each was last edited. */
export async function getServiceSitemapEntries(): Promise<SitemapEntry[]> {
  const data = await getJson<{
    success?: boolean;
    services?: { slug?: string; updatedAt?: string }[];
  }>("/api/services/client/sitemap", "service-list");

  return (data?.services ?? [])
    .filter((service): service is { slug: string; updatedAt?: string } => Boolean(service?.slug))
    .map((service) => ({
      // Both templates are served by /solutions/[slug], so neither is filtered
      // out here — the same rule the route itself follows.
      url: `${SITE_URL}/solutions/${service.slug}`,
      lastModified: service.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
}

/** Published posts, newest edit first. */
export async function getBlogSitemapEntries(): Promise<SitemapEntry[]> {
  const data = await getJson<{
    success?: boolean;
    posts?: { slug?: string; updatedAt?: string }[];
  }>("/api/post/client/sitemap", "post-list");

  return (data?.posts ?? [])
    .filter((post): post is { slug: string; updatedAt?: string } => Boolean(post?.slug))
    .map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
}

/** ISO 8601, which is what both sitemap formats expect for <lastmod>. */
function lastmod(value: string | Date | undefined): string | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

/**
 * `&` in a query string is the one character that reliably breaks a sitemap,
 * and these URLs are built from CMS slugs, so they are escaped rather than
 * trusted.
 */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** A <urlset> document — one child sitemap. */
export function urlsetXml(entries: SitemapEntry[]): string {
  const urls = entries
    .map((entry) => {
      const parts = [`    <loc>${escapeXml(entry.url)}</loc>`];
      const modified = lastmod(entry.lastModified);
      if (modified) parts.push(`    <lastmod>${modified}</lastmod>`);
      if (entry.changeFrequency) {
        parts.push(`    <changefreq>${entry.changeFrequency}</changefreq>`);
      }
      if (entry.priority !== undefined) {
        parts.push(`    <priority>${entry.priority}</priority>`);
      }
      return `  <url>\n${parts.join("\n")}\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

/** A <sitemapindex> document — the one at /sitemap.xml. */
export function sitemapIndexXml(
  sitemaps: { url: string; lastModified?: string | Date }[]
): string {
  const entries = sitemaps
    .map((sitemap) => {
      const parts = [`    <loc>${escapeXml(sitemap.url)}</loc>`];
      const modified = lastmod(sitemap.lastModified);
      if (modified) parts.push(`    <lastmod>${modified}</lastmod>`);
      return `  <sitemap>\n${parts.join("\n")}\n  </sitemap>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>`;
}

/** Every child sitemap serves the same headers. */
export function xmlResponse(body: string): Response {
  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      // Crawlers and the CDN may hold it for an hour; the CMS's revalidation
      // webhook clears the underlying fetches sooner when content changes.
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
