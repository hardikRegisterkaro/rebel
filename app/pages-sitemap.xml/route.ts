import { getRoles } from "@/lib/careers-api";
import { urlsetXml, xmlResponse, type SitemapEntry } from "@/lib/sitemap";
import { ROLE_SITEMAP_PRIORITY, SITE_URL, SITEMAP_ROUTES } from "@/lib/site";

/**
 * The pages that are neither a solution nor a post: the static routes, and the
 * open roles.
 *
 * A <sitemapindex> can only list sitemaps, never URLs, so these need a file of
 * their own — without it, adding the index would have quietly dropped the home
 * page, /about, /contact and every job posting from search.
 */
export const revalidate = 3600;

export async function GET() {
  // Roles come from the CMS, so a newly published opening is listed without a
  // redeploy. Hidden and draft roles are already excluded by that endpoint.
  const roles = await getRoles();
  const lastModified = new Date();

  const entries: SitemapEntry[] = [
    ...SITEMAP_ROUTES.map(({ path, priority }) => ({
      url: `${SITE_URL}${path}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority,
    })),
    ...roles.map((role) => ({
      url: `${SITE_URL}/careers/${role.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: ROLE_SITEMAP_PRIORITY,
    })),
  ];

  return xmlResponse(urlsetXml(entries));
}
