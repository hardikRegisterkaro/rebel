/**
 * Division (section-builder) pages, fetched from the CMS.
 *
 * Unlike a solution pillar — which has a fixed set of named sections — a
 * division page is an ordered list an editor composes freely. That makes the
 * dark/light rhythm a rendering concern rather than a layout one: the tone of
 * each section is derived from its position, so any order an editor builds
 * alternates correctly and two sections of the same tone can never touch.
 */

const CMS_URL = (process.env.CMS_API_URL ?? "http://localhost:3000").replace(/\/$/, "");
const REVALIDATE_SECONDS = 3600;
const REQUEST_TIMEOUT_MS = 8000;

export type Breadcrumb = { label: string; href?: string };

type SectionBase = {
  id: string;
  label: string;
  heading: string;
  /** Optional supporting image from the Media Library. */
  image?: string;
  alt?: string;
};

export type DivisionSection =
  | (SectionBase & {
      kind: "intro";
      paragraphs: string[];
      stats?: { value: string; label: string }[];
    })
  | (SectionBase & {
      kind: "cards";
      intro?: string;
      cards: { title: string; points: string[]; image?: string; alt?: string }[];
    })
  | (SectionBase & { kind: "chips"; intro?: string; chips: string[]; note?: string })
  | (SectionBase & {
      kind: "steps";
      intro?: string;
      steps: { title: string; text: string; day?: string; details?: string[]; note?: string }[];
    })
  | (SectionBase & { kind: "checklist"; intro?: string; items: string[] })
  | (SectionBase & { kind: "faq"; intro?: string; faqs: { q: string; a: string }[] })
  | (SectionBase & { kind: "table"; intro?: string; columns: string[]; rows: string[][] })
  | (SectionBase & { kind: "notes"; intro?: string; notes: { title: string; body: string }[] });

export type DivisionPage = {
  slug: string;
  breadcrumb: Breadcrumb[];
  badge: string;
  titleLead: string;
  titleAccent: string;
  subtitle: string;
  /** Optional hero image; without one the hero stays full-width text. */
  heroImage?: string;
  heroAlt?: string;
  heroCaption?: string;
  sections: DivisionSection[];
};

async function getJson<T>(path: string, tag: string): Promise<T | null> {
  try {
    const res = await fetch(`${CMS_URL}${path}`, {
      cache: "force-cache",
      next: { revalidate: REVALIDATE_SECONDS, tags: [tag] },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch (error) {
    console.error(
      `[services] CMS request failed for ${path} at ${CMS_URL}:`,
      error instanceof Error ? error.message : error
    );
    return null;
  }
}

/**
 * A stored document is only usable if it carries the hero fields and a section
 * list — a solution page served at this route would otherwise render blank.
 */
function isDivisionContent(value: unknown): value is Omit<DivisionPage, "slug"> {
  const c = value as Omit<DivisionPage, "slug"> | undefined;
  return Boolean(c && typeof c.titleLead === "string" && Array.isArray(c.sections));
}

/** Published division slugs, for generateStaticParams and the sitemap. */
export async function getDivisionSlugs(): Promise<string[]> {
  const data = await getJson<{ services?: { slug: string; template?: string }[] }>(
    "/api/services/client/sitemap",
    "service-list"
  );
  return (data?.services ?? [])
    .filter((s) => (s.template ?? "division") === "division")
    .map((s) => s.slug)
    .filter(Boolean);
}

/** One published division page, or null when missing, unpublished or a pillar. */
export async function getDivisionPage(slug: string): Promise<DivisionPage | null> {
  const data = await getJson<{ servicePages?: { template?: string; content?: unknown } }>(
    `/api/services/client/${encodeURIComponent(slug)}`,
    `service-${slug}`
  );

  const record = data?.servicePages;
  // Both templates share the /solutions/[slug] route, so this only has to
  // reject a pillar — which the solution loader handles instead.
  if (!record || (record.template ?? "division") !== "division") return null;

  if (isDivisionContent(record.content)) {
    return { slug, ...record.content };
  }
  return null;
}
