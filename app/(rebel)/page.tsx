import type { Metadata } from "next";

import { OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/seo";

import { Frameworks } from "@/components/frameworks";
import { Hero } from "@/components/hero";
import { OpenLab } from "@/components/open-lab";
import { Philosophy } from "@/components/philosophy";
import { Principles } from "@/components/principles";
import { WhyUs } from "@/components/why-us";

export const metadata: Metadata = {
  // Every other route sets one; without it the homepage can be indexed under
  // query-string or trailing-slash variants as separate URLs.
  alternates: { canonical: "/" },
  twitter: TWITTER_DEFAULTS,
  openGraph: { ...OG_DEFAULTS, url: "/" },
};

export default function HomePage() {
  return (
    <>
      {/* Surfaces alternate dark/light down the page: Hero and Principles take
          the layout's ink background, Frameworks sets its own. WhyUs sits
          between Frameworks and Principles so the two dark sections aren't
          adjacent. */}
      <Hero />
      <Philosophy />
      <Frameworks />
      <WhyUs />
      <Principles />
      <OpenLab />
    </>
  );
}
