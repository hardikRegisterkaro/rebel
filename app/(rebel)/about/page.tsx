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
import { ABOUT, ABOUT_FAQS } from "@/lib/about";

const description = ABOUT.hero.lede;

export const metadata: Metadata = {
  title: "About Us",
  description,
  alternates: { canonical: "/about" },
  twitter: TWITTER_DEFAULTS,
  openGraph: {
    ...OG_DEFAULTS,
    url: "/about",
    title: "About Us · Rebel Labz",
    description,
  },
};

const faqJsonLd = faqPageJsonLd(ABOUT_FAQS);

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // Content is authored in lib/about.ts, not user input.
        dangerouslySetInnerHTML={{ __html: jsonLd(faqJsonLd) }}
      />

      <AboutHero />
      <WhereWeAre />
      <CoreValues />
      <ImpactStats />
      <FoundingTeam />
      <OperationalStandards />
      <DesignPartners />
      <AboutFaq />
      <DualCta />
      {/* Dark here: DualCta above it is light, and this closes the page. */}
      <OpenLab tone="dark" />
    </>
  );
}
