import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";
import { getLegalPages } from "@/lib/legal-api";
import { OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/seo";

/**
 * Title and description come from the CMS's terms fields — the ones kept apart
 * from the privacy set, so this page's search result never describes the other.
 */
export async function generateMetadata(): Promise<Metadata> {
  const { terms } = await getLegalPages();
  const description =
    terms.metaDescription ??
    "The terms covering your use of this website. Engagements are governed separately by a signed agreement.";

  // The layout appends "· Rebel Labz" to every title. An authored meta title
  // usually carries the brand already, so it opts out of that template.
  const authored = terms.metaTitle;

  return {
    title: authored ? { absolute: authored } : terms.title,
    description,
    alternates: { canonical: "/terms" },
    twitter: TWITTER_DEFAULTS,
    openGraph: {
      ...OG_DEFAULTS,
      url: "/terms",
      title: authored ?? `${terms.title} · Rebel Labz`,
      description,
    },
  };
}

export default async function TermsPage() {
  const { terms } = await getLegalPages();

  return (
    <LegalPage
      title={terms.title}
      intro={terms.intro}
      sections={terms.sections}
      html={terms.html}
      updated={terms.updated}
    />
  );
}
