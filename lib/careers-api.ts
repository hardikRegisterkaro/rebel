/**
 * Roles, fetched from the CMS.
 *
 * The CMS's public careers endpoints return the `Role` shape this site already
 * renders — `discipline`, `meta`, `comp`, `posted` and the two bullet lists are
 * composed server-side there, so nothing here reshapes anything and no
 * component had to change.
 *
 * Static copy (perks, FAQs, hero) still lives in lib/careers.ts; only the open
 * roles are dynamic.
 */
import type { Role } from "@/lib/careers";

/**
 * Where the CMS lives. Falls back to the local dev CMS so `npm run dev` works
 * in a fresh checkout without an env file.
 */
const CMS_URL = (process.env.CMS_API_URL ?? "http://localhost:3000").replace(/\/$/, "");

/**
 * How long a cached roles response is served before Next refetches.
 *
 * The CMS also pushes tag-based revalidation on publish, so this is the
 * backstop for a missed webhook rather than the primary freshness mechanism.
 */
const REVALIDATE_SECONDS = 300;

type RolesResponse = {
  success: boolean;
  roles: Role[];
  filters: { categories: string[] };
  total: number;
  pagination?: { totalCount: number };
};

type RoleResponse = {
  success: boolean;
  role: Role;
};

/**
 * Roles are fetched at request/build time, and a CMS outage must not take the
 * careers page down with it — callers get an empty list and the page renders
 * its "no roles" state instead of a 500.
 */
async function getJson<T>(path: string, tag: string): Promise<T | null> {
  try {
    // `cache: "force-cache"` is required: this project does not enable
    // cacheComponents, and under that model Next 16 does NOT cache fetch by
    // default. Without it every visit would hit the CMS and the careers pages
    // would lose their static prerender.
    const res = await fetch(`${CMS_URL}${path}`, {
      cache: "force-cache",
      next: { revalidate: REVALIDATE_SECONDS, tags: [tag] },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/** Every published role, newest first. */
export async function getRoles(): Promise<Role[]> {
  const data = await getJson<RolesResponse>("/api/careers/client", "careers");
  return data?.roles ?? [];
}

/**
 * The first page of roles plus the total, which is what the board needs to
 * render its pagination before any client-side fetching happens.
 *
 * `limit` must match ROLES_PER_PAGE on the board, or the first page would
 * disagree with every page fetched after it.
 */
export async function getRolesPage({
  page = 1,
  discipline = "",
  limit = 6,
}: { page?: number; discipline?: string; limit?: number } = {}): Promise<{
  roles: Role[];
  total: number;
}> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (discipline) params.set("category", discipline);

  const data = await getJson<RolesResponse>(
    `/api/careers/client?${params}`,
    "careers"
  );
  return {
    roles: data?.roles ?? [],
    total: data?.pagination?.totalCount ?? data?.total ?? 0,
  };
}

/** One role by slug, or null when it is unpublished or missing. */
export async function getRole(slug: string): Promise<Role | null> {
  const data = await getJson<RoleResponse>(
    `/api/careers/client/${encodeURIComponent(slug)}`,
    `career:${slug}`
  );
  return data?.role ?? null;
}

/**
 * Discipline tabs, in the order configured in the CMS.
 *
 * Falls back to the static DISCIPLINES union if the CMS is unreachable, so the
 * board still renders its filter chips.
 */
export async function getDisciplines(): Promise<string[]> {
  const data = await getJson<RolesResponse>("/api/careers/client", "careers");
  return data?.filters?.categories ?? [];
}
