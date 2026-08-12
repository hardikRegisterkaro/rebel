import type { MetadataRoute } from "next";

import { getRoles } from "@/lib/careers-api";
import {
  ROLE_SITEMAP_PRIORITY,
  SOLUTION_SITEMAP_PRIORITY,
  SITE_URL,
  SITEMAP_ROUTES,
} from "@/lib/site";
import { getSolutionSlugs } from "@/lib/solutions-api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // The static routes are prerendered, so "last modified" is the build moment.
  const lastModified = new Date();

  // Role pages come from the CMS rather than a hardcoded list, so a newly
  // published opening appears here without a redeploy. A CMS outage yields an
  // empty list, which drops the role URLs from this build rather than failing
  // the whole sitemap.
  const [roles, solutionSlugs] = await Promise.all([getRoles(), getSolutionSlugs()]);

  return [
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
    // Solution pages are CMS-managed too, so a newly published pillar is listed
    // without a redeploy.
    ...solutionSlugs.map((slug) => ({
      url: `${SITE_URL}/solutions/${slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: SOLUTION_SITEMAP_PRIORITY,
    })),
  ];
}
