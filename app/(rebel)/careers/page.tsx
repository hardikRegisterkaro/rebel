import type { Metadata } from "next";

import { CandidateFaq } from "@/components/careers/candidate-faq";
import { CareersHero } from "@/components/careers/careers-hero";
import { PipelineSection } from "@/components/careers/pipeline-section";
import { RoleBoard } from "@/components/careers/role-board";
import { WhyBuildHere } from "@/components/careers/why-build-here";
import { faqPageJsonLd, jsonLd } from "@/lib/json-ld";
import { OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/seo";
import { CANDIDATE_FAQS, CAREERS } from "@/lib/careers";

const description = CAREERS.hero.lede;

export const metadata: Metadata = {
  title: "Careers",
  description,
  alternates: { canonical: "/careers" },
  twitter: TWITTER_DEFAULTS,
  openGraph: {
    ...OG_DEFAULTS,
    url: "/careers",
    title: "Careers · Rebel Labz",
    description,
  },
};

const faqJsonLd = faqPageJsonLd(CANDIDATE_FAQS);

export default function CareersPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // Content is authored in lib/careers.ts, not user input.
        dangerouslySetInnerHTML={{ __html: jsonLd(faqJsonLd) }}
      />

      <CareersHero />
      <RoleBoard />
      <WhyBuildHere />
      <CandidateFaq />
      <PipelineSection />
    </>
  );
}
