/**
 * The blog, fetched from the CMS.
 *
 * Listing and filtering both go through one endpoint so the response shape is
 * the same with or without a category — the page paginates identically either
 * way. Nothing here throws: an unreachable CMS renders an empty board with a
 * message, not a 500.
 */

const CMS_URL = (process.env.CMS_API_URL ?? "http://localhost:3000").replace(/\/$/, "");
const REVALIDATE_SECONDS = 3600;
const REQUEST_TIMEOUT_MS = 8000;

/** Cards per page. Three columns, two rows — the grid stays full. */
export const POSTS_PER_PAGE = 6;

export type BlogCategory = {
  id: string;
  name: string;
  slug: string;
  color: string;
  count: number;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featuredImage: string | null;
  publishedAt: string | null;
  createdAt: string;
  readTimeMinutes: number;
  author: { id: string; username: string } | null;
  /** A post can carry several; the cards show the first. */
  categories: BlogCategory[];
};

export type BlogPage = {
  posts: BlogPost[];
  total: number;
  totalPages: number;
  /** True when the CMS could not be reached — the page says so rather than lying. */
  failed: boolean;
};

/** The API returns `category` as an array; everything else maps across as-is. */
type ApiPost = Omit<BlogPost, "categories"> & {
  category?: Array<{ id: string; name: string; slug: string; color?: string }>;
};

function toPost(post: ApiPost): BlogPost {
  return {
    ...post,
    categories: (post.category ?? []).map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      color: category.color ?? "",
      count: 0,
    })),
  };
}

/**
 * One page of published posts, newest first.
 *
 * `category` is a slug. An unknown one comes back empty rather than as "all
 * posts", so a mistyped URL cannot quietly show the wrong list.
 */
export async function getPostsPage({
  page = 1,
  category = "",
  limit = POSTS_PER_PAGE,
}: {
  page?: number;
  category?: string;
  limit?: number;
} = {}): Promise<BlogPage> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (category) params.set("category", category);

  try {
    const res = await fetch(`${CMS_URL}/api/post/client/all-blog?${params}`, {
      cache: "force-cache",
      // `post-list` is the tag the CMS revalidates on every post write.
      next: { revalidate: REVALIDATE_SECONDS, tags: ["post-list"] },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!res.ok) return { posts: [], total: 0, totalPages: 0, failed: true };

    const data = (await res.json()) as {
      success?: boolean;
      posts?: ApiPost[];
      pagination?: { totalCount?: number; totalPages?: number };
    };
    if (!data?.success || !Array.isArray(data.posts)) {
      return { posts: [], total: 0, totalPages: 0, failed: true };
    }

    return {
      posts: data.posts.map(toPost),
      total: data.pagination?.totalCount ?? data.posts.length,
      totalPages: data.pagination?.totalPages ?? 1,
      failed: false,
    };
  } catch (error) {
    console.error(
      `[blog] CMS request failed at ${CMS_URL}:`,
      error instanceof Error ? error.message : error
    );
    return { posts: [], total: 0, totalPages: 0, failed: true };
  }
}

/**
 * Categories for the filter tabs.
 *
 * Only ones with a published post — the CMS filters that, so a tab never leads
 * to an empty list.
 */
export async function getBlogCategories(): Promise<BlogCategory[]> {
  try {
    const res = await fetch(`${CMS_URL}/api/post/client/categories`, {
      cache: "force-cache",
      next: { revalidate: REVALIDATE_SECONDS, tags: ["post-list"] },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!res.ok) return [];

    const data = (await res.json()) as { success?: boolean; categories?: BlogCategory[] };
    return data?.success && Array.isArray(data.categories) ? data.categories : [];
  } catch (error) {
    console.error(
      `[blog] CMS categories request failed at ${CMS_URL}:`,
      error instanceof Error ? error.message : error
    );
    return [];
  }
}

/** A single post with its body and everything authored alongside it. */
export type BlogPostDetail = BlogPost & {
  content: string;
  updatedAt: string;
  /** {question, answer} pairs — rendered as an FAQ block and as JSON-LD. */
  faqItems: { question: string; answer: string }[];
  /** ACF-style extras. `tags` is read from here; anything else is ignored. */
  additionalFields: Record<string, unknown>;
  /** Editor-authored JSON-LD, emitted verbatim. */
  schema: unknown;
};

type ApiPostDetail = ApiPost & {
  content?: string | null;
  updatedAt?: string;
  faq_items?: unknown;
  additionalFields?: unknown;
  schema?: unknown;
};

/** Words per minute used for the read-time estimate, matching the CMS's. */
const WPM = 200;

export function readTime(html: string): number {
  const words = html.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WPM));
}

/**
 * One post by slug, or null when it is missing or unpublished.
 *
 * A draft and a deleted post are the same thing from out here — the CMS
 * returns 404 for both, and the page renders notFound() either way.
 */
export async function getPostBySlug(slug: string): Promise<BlogPostDetail | null> {
  try {
    const res = await fetch(
      `${CMS_URL}/api/post/client/detail-blog?slug=${encodeURIComponent(slug)}`,
      {
        cache: "force-cache",
        // Tagged per slug as well as with the list: editing one post must not
        // wait an hour, and must not force every other page to re-render.
        next: { revalidate: REVALIDATE_SECONDS, tags: ["post-list", `post-${slug}`] },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      }
    );
    if (!res.ok) return null;

    const data = (await res.json()) as { success?: boolean; post?: ApiPostDetail };
    const post = data?.post;
    if (!data?.success || !post) return null;

    const content = post.content ?? "";
    const faq = Array.isArray(post.faq_items) ? post.faq_items : [];

    return {
      ...toPost(post),
      content,
      updatedAt: post.updatedAt ?? post.createdAt,
      // The API returns readTimeMinutes only on the listing, so it is derived
      // here from the body actually being rendered.
      readTimeMinutes: readTime(content),
      faqItems: faq.filter(
        (item): item is { question: string; answer: string } =>
          Boolean(item) &&
          typeof (item as { question?: unknown }).question === "string" &&
          typeof (item as { answer?: unknown }).answer === "string"
      ),
      additionalFields:
        post.additionalFields && typeof post.additionalFields === "object"
          ? (post.additionalFields as Record<string, unknown>)
          : {},
      schema: post.schema ?? null,
    };
  } catch (error) {
    console.error(
      `[blog] CMS detail request failed at ${CMS_URL}:`,
      error instanceof Error ? error.message : error
    );
    return null;
  }
}

/**
 * Up to three more posts from the same category.
 *
 * One extra is requested so the current post can be dropped without leaving a
 * gap, and an uncategorised post falls back to the newest posts overall rather
 * than showing nothing.
 */
export async function getRelatedPosts(
  categorySlug: string | undefined,
  excludeSlug: string,
  limit = 3
): Promise<BlogPost[]> {
  const { posts } = await getPostsPage({
    page: 1,
    category: categorySlug ?? "",
    limit: limit + 1,
  });
  const related = posts.filter((post) => post.slug !== excludeSlug).slice(0, limit);

  if (related.length > 0 || !categorySlug) return related;

  const { posts: newest } = await getPostsPage({ page: 1, limit: limit + 1 });
  return newest.filter((post) => post.slug !== excludeSlug).slice(0, limit);
}

/**
 * Give every heading in the body a stable id, and return them for the
 * "On this page" rail.
 *
 * Done here rather than in the browser because the rail is rendered on the
 * server with the article — the ids have to exist in the HTML that ships, or
 * the anchors point at nothing until JavaScript runs.
 */
export function withHeadingIds(html: string): {
  html: string;
  headings: { id: string; text: string; level: 2 | 3 }[];
} {
  const headings: { id: string; text: string; level: 2 | 3 }[] = [];
  const used = new Set<string>();

  const withIds = html.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (match, levelRaw: string, attrs: string, inner: string) => {
      const level = Number(levelRaw) as 2 | 3;
      const text = inner.replace(/<[^>]+>/g, "").trim();
      if (!text) return match;

      const base =
        text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
          .slice(0, 60) || `section-${headings.length + 1}`;

      // Two headings with the same words would otherwise share an id, and the
      // rail would scroll to the first one from both entries.
      let id = base;
      let suffix = 2;
      while (used.has(id)) id = `${base}-${suffix++}`;
      used.add(id);

      headings.push({ id, text, level });
      // An id the editor typed wins — they may be linking to it from elsewhere.
      return /\sid=/.test(attrs)
        ? match
        : `<h${level}${attrs} id="${id}">${inner}</h${level}>`;
    }
  );

  return { html: withIds, headings };
}

/** Initials for the author chip, e.g. "Sana Rahal" → "SR". */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/** "Jul 29, 2026" — the format the cards and the feature panel both use. */
export function postDate(post: Pick<BlogPost, "publishedAt" | "createdAt">): string {
  const raw = post.publishedAt ?? post.createdAt;
  if (!raw) return "";
  const date = new Date(raw);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
