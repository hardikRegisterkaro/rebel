import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";
import { TERMS } from "@/lib/legal";
import { OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/seo";

const description =
  "The terms covering your use of this website. Engagements are governed separately by a signed agreement.";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description,
  alternates: { canonical: "/terms" },
  twitter: TWITTER_DEFAULTS,
  openGraph: {
    ...OG_DEFAULTS,
    url: "/terms",
    title: "Terms & Conditions · Rebel Labz",
    description,
  },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      intro={TERMS.intro}
      sections={TERMS.sections}
    />
  );
}
