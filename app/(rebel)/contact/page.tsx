import type { Metadata } from "next";

import { CollaborationPanel } from "@/components/contact/collaboration-panel";
import { ContactFaq } from "@/components/contact/contact-faq";
import { ContactHero } from "@/components/contact/contact-hero";
import { WhatHappensNext } from "@/components/contact/what-happens-next";
import { faqPageJsonLd, jsonLd } from "@/lib/json-ld";
import { OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/seo";
import { CONTACT } from "@/lib/contact";
import { getContactContent, getRolesPage } from "@/lib/careers-api";

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

export default async function ContactPage() {
  // Copy from the CMS; the role count for the "Join the lab" card comes from
  // published roles, so the two pages can never disagree about it.
  const [content, { total: roleCount }] = await Promise.all([
    getContactContent(),
    getRolesPage({ limit: 1 }),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        // Content is authored in lib/contact.ts, not user input.
        dangerouslySetInnerHTML={{ __html: jsonLd(faqPageJsonLd(content.faq.items)) }}
      />

      <ContactHero hero={content.hero} />
      <CollaborationPanel rail={content.rail} roleCount={roleCount} />
      <WhatHappensNext steps={content.steps} />
      <ContactFaq faq={content.faq} />
    </>
  );
}
