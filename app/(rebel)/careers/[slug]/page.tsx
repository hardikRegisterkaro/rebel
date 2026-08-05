import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ApplyForm } from "@/components/careers/apply-form";
import { JobDetail } from "@/components/careers/job-detail";
import { ROLES, roleBySlug } from "@/lib/careers";

type Params = { params: Promise<{ slug: string }> };

/** Every role is known at build time, so all eight prerender as static pages. */
export function generateStaticParams() {
  return ROLES.map((role) => ({ slug: role.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const role = roleBySlug(slug);
  if (!role) return {};

  const description = role.summary;
  return {
    title: role.title,
    description,
    alternates: { canonical: `/careers/${role.slug}` },
    openGraph: { title: `${role.title} · Rebel Labz`, description },
  };
}

export default async function RolePage({ params }: Params) {
  const { slug } = await params;
  const role = roleBySlug(slug);
  if (!role) notFound();

  return (
    <>
      {/* ── Header ───────────────────────────────────────────────────── */}
      <section
        id="top"
        aria-labelledby="role-heading"
        className="relative bg-ink text-dark-fg"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgb(255_255_255/0.06)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_75%_70%_at_50%_30%,#000_30%,transparent_72%)]"
        />

        <div className="relative mx-auto max-w-(--spacing-shell) px-6 pt-[clamp(40px,6vh,64px)] pb-[clamp(48px,8vh,88px)] sm:px-7">
          <nav
            aria-label="Breadcrumb"
            data-reveal="fade-up"
            className="mb-8 font-mono text-[0.62rem] tracking-[0.14em] uppercase"
          >
            <ol className="flex flex-wrap items-center gap-2.25">
              <li>
                <Link
                  href="/"
                  className="text-dark-faint transition-colors duration-250 hover:text-white"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-[#3a3a3a]">
                /
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-dark-faint transition-colors duration-250 hover:text-white"
                >
                  Careers
                </Link>
              </li>
              <li aria-hidden="true" className="text-[#3a3a3a]">
                /
              </li>
              <li className="text-dark-fg-2" aria-current="page">
                {role.discipline}
              </li>
            </ol>
          </nav>

          <p
            data-reveal="fade-up"
            data-reveal-delay="1"
            className="mb-5 flex flex-wrap items-center gap-2.5"
          >
            <span className="rounded-full border border-brand/40 px-3 py-1 font-mono text-[0.6rem] tracking-[0.14em] text-brand uppercase">
              {role.discipline}
            </span>
            {role.featured && (
              <span className="font-mono text-[0.58rem] tracking-[0.12em] text-dark-muted-2 uppercase">
                Featured
              </span>
            )}
          </p>

          <h1
            id="role-heading"
            data-reveal="fade-up"
            data-reveal-delay="2"
            className="max-w-[20ch] text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.05] font-semibold tracking-[-0.025em] text-balance"
          >
            {role.title}
            <span className="text-brand">.</span>
          </h1>

          <dl
            data-reveal="fade-up"
            data-reveal-delay="3"
            className="mt-8 flex flex-wrap gap-x-10 gap-y-5 border-t border-white/10 pt-6"
          >
            {[
              { label: "Details", value: role.meta },
              { label: "Compensation", value: role.comp },
              { label: "Posted", value: role.posted },
            ].map((item) => (
              <div key={item.label} className="flex flex-col gap-1.5">
                <dd className="text-[0.98rem] font-semibold">{item.value}</dd>
                <dt className="font-mono text-[0.56rem] tracking-[0.16em] text-[#7a7a7a] uppercase">
                  {item.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── JD left, application form right ──────────────────────────── */}
      <section
        id="apply"
        aria-label={`Apply for ${role.title}`}
        className="scroll-mt-24 border-t border-black/[0.08] bg-paper text-light-fg"
      >
        <div className="mx-auto grid grid-cols-1 max-w-(--spacing-shell) items-start gap-[clamp(32px,5vw,64px)] px-6 py-[clamp(56px,9vh,100px)] sm:px-7 lg:grid-cols-[1.15fr_0.85fr]">
          <JobDetail role={role} />

          {/* Sticky on desktop: the form stays reachable however long the JD
              runs. Below lg it simply follows the description. */}
          <div
            data-reveal="fade-left"
            data-reveal-delay="1"
            className="min-w-0 lg:sticky lg:top-24"
          >
            <ApplyForm role={role} />
          </div>
        </div>
      </section>
    </>
  );
}
