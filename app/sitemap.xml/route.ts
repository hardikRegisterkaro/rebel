import {
  getBlogSitemapEntries,
  getServiceSitemapEntries,
  sitemapIndexXml,
  xmlResponse,
} from "@/lib/sitemap";
import { SITE_URL } from "@/lib/site";

/**
 * The sitemap index — what /sitemap.xml serves, and what robots.txt points at.
 *
 * It lists the three child sitemaps rather than URLs of its own; that is what
 * a <sitemapindex> is for, and it lets a crawler refetch only the section that
 * moved. Each child's <lastmod> is the newest date inside it, so a crawler can
 * skip a section that has not changed.
 */
export const revalidate = 3600;

export async function GET() {
  // Fetched together — they are independent reads, and against a remote CMS
  // awaiting them in sequence would double this route's latency.
  const [services, posts] = await Promise.all([
    getServiceSitemapEntries(),
    getBlogSitemapEntries(),
  ]);

  /** The newest lastModified in a section, or undefined when it is empty. */
  const newest = (entries: { lastModified?: string | Date }[]) => {
    const times = entries
      .map((entry) => (entry.lastModified ? new Date(entry.lastModified).getTime() : NaN))
      .filter((time) => !Number.isNaN(time));
    return times.length ? new Date(Math.max(...times)) : undefined;
  };

  return xmlResponse(
    sitemapIndexXml([
      // Static pages and career roles. Built at request time, so its date is
      // "now" rather than a content date.
      { url: `${SITE_URL}/pages-sitemap.xml`, lastModified: new Date() },
      { url: `${SITE_URL}/service-sitemap.xml`, lastModified: newest(services) },
      { url: `${SITE_URL}/blog-sitemap.xml`, lastModified: newest(posts) },
    ])
  );
}
