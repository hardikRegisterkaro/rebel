/**
 * Terms and privacy, fetched from the CMS.
 *
 * One CMS document backs both pages, but each has its own title, subtitle, SEO
 * pair and revision date — they are separate URLs, and a privacy page headed
 * "Terms & Conditions" (or redated because someone fixed a typo in the terms)
 * is wrong in a way that matters for a legal document.
 *
 * The shipped copy in lib/legal.ts stays as the fallback: an unreachable CMS
 * must leave both pages rendering rather than blanking a policy.
 */
import { LEGAL_UPDATED, PRIVACY, TERMS, type LegalSection } from "@/lib/legal";

const CMS_URL = (process.env.CMS_API_URL ?? "http://localhost:3000").replace(/\/$/, "");
const REVALIDATE_SECONDS = 3600;
const REQUEST_TIMEOUT_MS = 8000;

export type LegalDoc = {
  title: string;
  intro: string;
  metaTitle: string | null;
  metaDescription: string | null;
  /** CMS body as HTML. Empty when the editor has not written one yet. */
  html: string;
  /** "6 August 2026" — this policy's own revision date. */
  updated: string;
  /** Shipped copy, rendered only when `html` is empty. */
  sections: LegalSection[];
};

const FALLBACK: { terms: LegalDoc; privacy: LegalDoc } = {
  terms: {
    title: "Terms of Use",
    intro: TERMS.intro,
    metaTitle: null,
    metaDescription: null,
    html: "",
    updated: LEGAL_UPDATED,
    sections: [...TERMS.sections],
  },
  privacy: {
    title: "Privacy Policy",
    intro: PRIVACY.intro,
    metaTitle: null,
    metaDescription: null,
    html: "",
    updated: LEGAL_UPDATED,
    sections: [...PRIVACY.sections],
  },
};

type ApiBody = { body?: string } | null | undefined;

type ApiLegal = {
  metaTitle?: string | null;
  metaDescription?: string | null;
  title?: string | null;
  subTitle?: string | null;
  privacyMetaTitle?: string | null;
  privacyMetaDescription?: string | null;
  privacyTitle?: string | null;
  privacySubTitle?: string | null;
  content?: ApiBody;
  privacyPolicyContent?: ApiBody;
  termsUpdatedAt?: string | null;
  privacyUpdatedAt?: string | null;
  updatedAt?: string | null;
};

/** "6 August 2026" — the format the shipped copy already uses. */
function formatUpdated(raw: string | null | undefined, fallback: string): string {
  if (!raw) return fallback;
  const date = new Date(raw);
  return Number.isNaN(date.getTime())
    ? fallback
    : date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

const text = (value: string | null | undefined, fallback: string) =>
  value && value.trim() ? value.trim() : fallback;

const bodyOf = (value: ApiBody) => (value?.body ?? "").trim();

/**
 * Both pages in one call.
 *
 * They come from a single CMS row, so fetching them separately would be two
 * round trips for one document — and the two pages are never rendered at the
 * same time anyway, so each request only pays for its own.
 */
export async function getLegalPages(): Promise<{ terms: LegalDoc; privacy: LegalDoc }> {
  try {
    const res = await fetch(`${CMS_URL}/api/terms-policy`, {
      cache: "force-cache",
      next: { revalidate: REVALIDATE_SECONDS, tags: ["legal-page"] },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!res.ok) return FALLBACK;

    const payload = (await res.json()) as { success?: boolean; data?: ApiLegal | null };
    const data = payload?.data;
    if (!payload?.success || !data) return FALLBACK;

    return {
      terms: {
        title: text(data.title, FALLBACK.terms.title),
        intro: text(data.subTitle, FALLBACK.terms.intro),
        metaTitle: data.metaTitle?.trim() || null,
        metaDescription: data.metaDescription?.trim() || null,
        html: bodyOf(data.content),
        updated: formatUpdated(data.termsUpdatedAt ?? data.updatedAt, LEGAL_UPDATED),
        sections: FALLBACK.terms.sections,
      },
      privacy: {
        title: text(data.privacyTitle, FALLBACK.privacy.title),
        intro: text(data.privacySubTitle, FALLBACK.privacy.intro),
        metaTitle: data.privacyMetaTitle?.trim() || null,
        metaDescription: data.privacyMetaDescription?.trim() || null,
        html: bodyOf(data.privacyPolicyContent),
        updated: formatUpdated(data.privacyUpdatedAt ?? data.updatedAt, LEGAL_UPDATED),
        sections: FALLBACK.privacy.sections,
      },
    };
  } catch (error) {
    console.error(
      `[legal] CMS request failed at ${CMS_URL}:`,
      error instanceof Error ? error.message : error
    );
    return FALLBACK;
  }
}
