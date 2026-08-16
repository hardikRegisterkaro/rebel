import { getBlogSitemapEntries, urlsetXml, xmlResponse } from "@/lib/sitemap";
import { SITE_URL } from "@/lib/site";

/**
 * The blog listing and every published post.
 *
 * Drafts are excluded by the CMS endpoint itself, which is the same rule the
 * public listing and the detail page follow — a draft 404s, so it must not be
 * listed here.
 */
export const revalidate = 3600;

export async function GET() {
  const posts = await getBlogSitemapEntries();

  return xmlResponse(
    urlsetXml([
      // The listing leads the section, and is as fresh as its newest post.
      {
        url: `${SITE_URL}/blog`,
        lastModified: posts[0]?.lastModified ?? new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      },
      ...posts,
    ])
  );
}
