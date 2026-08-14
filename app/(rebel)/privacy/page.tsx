import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";
import { getLegalPages } from "@/lib/legal-api";
import { OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/seo";

/**
 * Title and description come from the CMS's privacy fields, which are stored
 * separately from the terms ones — the two pages share a document, not a
 * heading.
 */
export async function generateMetadata(): Promise<Metadata> {
  const { privacy } = await getLegalPages();
  const description =
    privacy.metaDescription ??
    "What happens to information you send us through this site, why we hold it, and for how long.";

  const authored = privacy.metaTitle;

  return {
    title: authored ? { absolute: authored } : privacy.title,
    description,
    alternates: { canonical: "/privacy" },
    twitter: TWITTER_DEFAULTS,
    openGraph: {
      ...OG_DEFAULTS,
      url: "/privacy",
      title: authored ?? `${privacy.title} · Rebel Labz`,
      description,
    },
  };
}

export default async function PrivacyPage() {
  const { privacy } = await getLegalPages();

  return (
    <LegalPage
      title={privacy.title}
      intro={privacy.intro}
      sections={privacy.sections}
      html={privacy.html}
      updated={privacy.updated}
    />
  );
}
