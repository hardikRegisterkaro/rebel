import type { MetadataRoute } from "next";

import { SITE_URL, SITEMAP_ROUTES } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // Build time, not request time — these pages are statically prerendered, so
  // "last modified" is the moment the deploy was built.
  const lastModified = new Date();

  return SITEMAP_ROUTES.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: "monthly",
    priority,
  }));
}
