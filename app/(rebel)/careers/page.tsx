import type { Metadata } from "next";

import { CandidateFaq } from "@/components/careers/candidate-faq";
import { CareersHero } from "@/components/careers/careers-hero";
import { PipelineSection } from "@/components/careers/pipeline-section";
import { RoleBoard } from "@/components/careers/role-board";
import { WhyBuildHere } from "@/components/careers/why-build-here";
import { faqPageJsonLd, jsonLd } from "@/lib/json-ld";
import { OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/seo";
import { CANDIDATE_FAQS, CAREERS } from "@/lib/careers";
import { getRolesPage, getDisciplines } from "@/lib/careers-api";

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

type Props = {
  searchParams: Promise<{ discipline?: string; page?: string }>;
};

export default async function CareersPage({ searchParams }: Props) {
  // The filter and page live in the URL, and are resolved HERE rather than in
  // the client component. That keeps a deep link like
  // /careers?discipline=Research&page=2 server-rendered — good for SEO and for
  // first paint — and avoids useSearchParams, which on a prerendered route
  // needs a Suspense boundary whose fallback cannot itself read the params.
  const { discipline = "", page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const [{ roles, total }, disciplines] = await Promise.all([
    getRolesPage({ page, discipline }),
    getDisciplines(),
  ]);
  const filters = disciplines.length ? ["All Roles", ...disciplines] : undefined;

  return (
    <>
      <script
        type="application/ld+json"
        // Content is authored in lib/careers.ts, not user input.
        dangerouslySetInnerHTML={{ __html: jsonLd(faqJsonLd) }}
      />

      <CareersHero />
      <RoleBoard
        roles={roles}
        total={total}
        page={page}
        discipline={discipline}
        filters={filters}
      />
      <WhyBuildHere />
      <CandidateFaq />
      <PipelineSection />
    </>
  );
}
