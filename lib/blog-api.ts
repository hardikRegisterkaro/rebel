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
