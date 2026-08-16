import { getServiceSitemapEntries, urlsetXml, xmlResponse } from "@/lib/sitemap";

/**
 * Every published solution page, from the CMS's own sitemap endpoint.
 *
 * That endpoint returns published pages only, so an unpublished or hidden
 * pillar can never be advertised to a crawler.
 */
export const revalidate = 3600;

export async function GET() {
  return xmlResponse(urlsetXml(await getServiceSitemapEntries()));
}
