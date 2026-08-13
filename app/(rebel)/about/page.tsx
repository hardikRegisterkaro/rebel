import type { Metadata } from "next";

import { AboutFaq } from "@/components/about/about-faq";
import { AboutHero } from "@/components/about/about-hero";
import { CoreValues } from "@/components/about/core-values";
import { DesignPartners } from "@/components/about/design-partners";
import { DualCta } from "@/components/about/dual-cta";
import { FoundingTeam } from "@/components/about/founding-team";
import { ImpactStats } from "@/components/about/impact-stats";
import { OperationalStandards } from "@/components/about/operational-standards";
import { WhereWeAre } from "@/components/about/where-we-are";
import { OpenLab } from "@/components/open-lab";
import { faqPageJsonLd, jsonLd } from "@/lib/json-ld";
import { OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/seo";
import { getAboutContent, getAboutPage } from "@/lib/about-api";

/**
 * Title and description come from the CMS's SEO fields, falling back to the
 * hero copy — the editor sets both in one place, and an unset field still
 * yields a sensible description rather than none.
 */
export async function generateMetadata(): Promise<Metadata> {
  const { content, meta } = await getAboutPage();
  const description = meta.metaDescription || content.hero.lede;

  // The layout appends "· Rebel Labz" to every title. An editor's meta title
  // usually already carries the brand, so it is set as `absolute` to opt out of
  // that template — otherwise it renders "About Us · Rebellabz · Rebel Labz".
  // Without one, the short title flows through the template as normal.
  const authored = meta.metaTitle?.trim();
  const socialTitle = authored || "About Us · Rebel Labz";

  return {
    title: authored ? { absolute: authored } : "About Us",
    description,
    alternates: { canonical: "/about" },
    twitter: TWITTER_DEFAULTS,
    openGraph: {
      ...OG_DEFAULTS,
      url: "/about",
      title: socialTitle,
      description,
    },
  };
}

export default async function AboutPage() {
  const content = await getAboutContent();
  // Built here rather than at module scope: it describes the fetched copy, so
  // the structured data always matches the questions actually rendered.
  const faqJsonLd = faqPageJsonLd(content.faq.items);

  return (
    <>
      <script
        type="application/ld+json"
        // Content is authored in lib/about.ts, not user input.
        dangerouslySetInnerHTML={{ __html: jsonLd(faqJsonLd) }}
      />

      <AboutHero hero={content.hero} />
      <WhereWeAre story={content.story} />
      <CoreValues values={content.values} />
      <ImpactStats stats={content.stats} />
      <FoundingTeam team={content.team} />
      <OperationalStandards standards={content.standards} />
      <DesignPartners partners={content.partners} />
      <AboutFaq faq={content.faq} />
      <DualCta dualCta={content.dualCta} />
      {/* Dark here: DualCta above it is light, and this closes the page. */}
      <OpenLab tone="dark" />
    </>
  );
}
