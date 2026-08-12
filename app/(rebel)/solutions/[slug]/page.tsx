import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ComparisonTable } from "@/components/service/comparison-table";
import { DivisionSectionBlock, type Tone } from "@/components/service/division-section";
import { FaqSection } from "@/components/service/faq-section";
import { ServiceContact } from "@/components/service/service-contact";
import { ServiceHero } from "@/components/service/service-hero";
import { ServiceOfferings } from "@/components/service/service-offerings";
import { faqPageJsonLd, jsonLd } from "@/lib/json-ld";
import { OG_DEFAULTS, TWITTER_DEFAULTS } from "@/lib/seo";
import { getDivisionPage } from "@/lib/services-api";
import { getSolutionPage, getSolutionSlugs } from "@/lib/solutions-api";
import { layoutFor, type SectionId } from "@/lib/solution-layouts";

type Params = { params: Promise<{ slug: string }> };

/**
 * Both templates live under /solutions, so one route serves them.
 *
 * The two loaders hit the same CMS URL with the same cache tag, so this is one
 * network request regardless of which template answers — the second call is
 * served from Next's fetch cache.
 */
async function loadPage(slug: string) {
  const solution = await getSolutionPage(slug);
  if (solution) return { kind: "solution" as const, ...solution };

  const division = await getDivisionPage(slug);
  if (division) return { kind: "division" as const, page: division };

  return null;
}

/** Every published service page, whichever template it uses. */
export async function generateStaticParams() {
  const slugs = await getSolutionSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const loaded = await loadPage(slug);
  if (!loaded) return {};

  const title =
    loaded.kind === "solution"
      ? loaded.solution.title
      : [loaded.page.titleLead, loaded.page.titleAccent].filter(Boolean).join(" ");
  const description =
    loaded.kind === "solution" ? loaded.solution.tagline : loaded.page.subtitle;

  return {
    title,
    description,
    alternates: { canonical: `/solutions/${slug}` },
    twitter: TWITTER_DEFAULTS,
    openGraph: {
      ...OG_DEFAULTS,
      url: `/solutions/${slug}`,
      title: `${title} · Rebel Labz`,
      description,
      ...(loaded.kind === "solution" ? { images: [{ url: loaded.solution.hero.image }] } : {}),
    },
  };
}

export default async function SolutionPage({ params }: Params) {
  const { slug } = await params;
  const loaded = await loadPage(slug);
  if (!loaded) notFound();

  /* ── Division: an ordered list the editor composed ─────────────────────── */
  if (loaded.kind === "division") {
    const page = loaded.page;
    return (
      <>
        {/* Hero is always first and always dark, which is what makes the
            sections below start on light. */}
        <section
          id="top"
          aria-labelledby="service-heading"
          className="scroll-mt-24 bg-ink text-dark-fg"
        >
          <div className="mx-auto max-w-(--spacing-shell) px-6 py-[clamp(72px,12vh,132px)] sm:px-7">
            {page.breadcrumb.length > 0 && (
              <nav aria-label="Breadcrumb" className="mb-8">
                <ol className="flex flex-wrap items-center gap-2 font-mono text-[0.66rem] tracking-[0.16em] text-dark-muted uppercase">
                  {page.breadcrumb.map((crumb, i) => (
                    <li key={i} className="flex items-center gap-2">
                      {i > 0 && <span aria-hidden="true">/</span>}
                      {crumb.href ? (
                        <Link href={crumb.href} className="transition-colors hover:text-white">
                          {crumb.label}
                        </Link>
                      ) : (
                        <span>{crumb.label}</span>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            {/* Two columns once there is an image, stacked on mobile with the
                copy first — a visitor should meet the heading before a photo. */}
            <div
              className={
                page.heroImage
                  ? "grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14"
                  : undefined
              }
            >
              <div className="min-w-0">
                {page.badge && (
                  <p className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-brand/40 px-4 py-1.5 font-mono text-[0.66rem] tracking-[0.16em] text-brand uppercase">
                    <span aria-hidden="true" className="inline-block size-[7px] bg-brand" />
                    {page.badge}
                  </p>
                )}

                <h1
                  id="service-heading"
                  className="max-w-[16ch] text-[clamp(2.4rem,5.4vw,4.2rem)] leading-[1.02] font-semibold tracking-[-0.03em] text-white"
                >
                  {page.titleLead} <span className="text-brand">{page.titleAccent}</span>
                  <span className="text-brand">.</span>
                </h1>

                {page.subtitle && (
                  <p className="mt-6 max-w-[58ch] text-[1.05rem] leading-[1.65] text-dark-fg-2">
                    {page.subtitle}
                  </p>
                )}
              </div>

              {page.heroImage && (
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[22px] border border-white/10">
                  <Image
                    src={page.heroImage}
                    alt={page.heroAlt ?? ""}
                    fill
                    priority
                    sizes="(max-width: 1024px) 92vw, 46vw"
                    className="object-cover"
                  />
                  {page.heroCaption && (
                    <span className="absolute top-4 left-5 font-mono text-[0.62rem] tracking-[0.16em] text-white/90 uppercase">
                      {page.heroCaption}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Tone comes from position, not from the section itself: an editor can
            add, remove or reorder freely and the page still alternates. */}
        {page.sections.map((section, index) => (
          <DivisionSectionBlock
            key={section.id || index}
            section={section}
            tone={(index % 2 === 0 ? "light" : "dark") as Tone}
          />
        ))}
      </>
    );
  }

  /* ── Solution pillar: a fixed set of sections, chosen by layout ────────── */
  const { solution, content } = loaded;
  const layout = layoutFor(content.layout);

  return (
    <>
      <script
        type="application/ld+json"
        // Authored by CMS editors, who are trusted staff.
        dangerouslySetInnerHTML={{ __html: jsonLd(faqPageJsonLd(solution.faqs)) }}
      />

      {/* Sections come from the page's layout rather than a fixed sequence. The
          layouts are validated to alternate dark/light — see
          lib/solution-layouts.ts — so no template can put two of the same tone
          side by side. */}
      {layout.sections.map((id: SectionId) => {
        switch (id) {
          case "hero":
            return <ServiceHero key={id} solution={solution} hero={content.hero} />;
          case "offerings":
            return (
              <ServiceOfferings key={id} offerings={solution.offerings} header={content.offerings} />
            );
          case "comparison":
            return (
              <ComparisonTable key={id} rows={solution.comparison} header={content.comparison} />
            );
          case "faq":
            return <FaqSection key={id} faqs={solution.faqs} header={content.faq} />;
          case "contact":
            return <ServiceContact key={id} solution={solution} panel={content.contact} />;
        }
      })}
    </>
  );
}
