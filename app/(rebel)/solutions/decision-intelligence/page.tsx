import type { Metadata } from "next";

import { ComparisonTable } from "@/components/service/comparison-table";
import { FaqSection } from "@/components/service/faq-section";
import { ServiceContact } from "@/components/service/service-contact";
import { ServiceHero } from "@/components/service/service-hero";
import { ServiceOfferings } from "@/components/service/service-offerings";
import { faqPageJsonLd, jsonLd } from "@/lib/json-ld";
import { DECISION_INTELLIGENCE as solution } from "@/lib/solutions";

export const metadata: Metadata = {
  title: solution.title,
  description: solution.tagline,
  alternates: { canonical: `/solutions/${solution.slug}` },
  openGraph: {
    title: `${solution.title} · Rebel Labz`,
    description: solution.tagline,
    images: [{ url: solution.hero.image }],
  },
};

const faqJsonLd = faqPageJsonLd(solution.faqs);

export default function DecisionIntelligencePage() {
  return (
    <>
      <script
        type="application/ld+json"
        // Content is authored in lib/solutions.ts, not user input.
        dangerouslySetInnerHTML={{ __html: jsonLd(faqJsonLd) }}
      />

      <ServiceHero solution={solution} />
      <ServiceOfferings offerings={solution.offerings} />
      <ComparisonTable rows={solution.comparison} />
      <FaqSection faqs={solution.faqs} />
      <ServiceContact solution={solution} />
    </>
  );
}
