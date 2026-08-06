import type { Metadata } from "next";

import { CollaborationPanel } from "@/components/contact/collaboration-panel";
import { ContactFaq } from "@/components/contact/contact-faq";
import { ContactHero } from "@/components/contact/contact-hero";
import { WhatHappensNext } from "@/components/contact/what-happens-next";
import { faqPageJsonLd, jsonLd } from "@/lib/json-ld";
import { OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/seo";
import { CONTACT, CONTACT_FAQS } from "@/lib/contact";

const description = CONTACT.hero.lede;

export const metadata: Metadata = {
  title: "Contact",
  description,
  alternates: { canonical: "/contact" },
  twitter: TWITTER_DEFAULTS,
  openGraph: {
    ...OG_DEFAULTS,
    url: "/contact",
    title: "Contact · Rebel Labz",
    description,
  },
};

const faqJsonLd = faqPageJsonLd(CONTACT_FAQS);

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // Content is authored in lib/contact.ts, not user input.
        dangerouslySetInnerHTML={{ __html: jsonLd(faqJsonLd) }}
      />

      <ContactHero />
      <CollaborationPanel />
      <WhatHappensNext />
      <ContactFaq />
    </>
  );
}
