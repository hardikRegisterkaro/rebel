import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";
import { PRIVACY } from "@/lib/legal";
import { OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/seo";

const description =
  "What happens to information you send us through this site. No cookies, no analytics, no tracking — and forms that never post to a server.";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description,
  alternates: { canonical: "/privacy" },
  twitter: TWITTER_DEFAULTS,
  openGraph: {
    ...OG_DEFAULTS,
    url: "/privacy",
    title: "Privacy Policy · Rebel Labz",
    description,
  },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro={PRIVACY.intro}
      sections={PRIVACY.sections}
    />
  );
}
