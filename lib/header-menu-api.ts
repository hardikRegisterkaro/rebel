/**
 * The site header, fetched from the CMS.
 *
 * The navigation used to be the static PRIMARY_NAV in lib/content.ts, so
 * adding a solution to the header meant a code change and a deploy. It is now
 * whatever an editor assembled under Header Menu — every entry there is a page
 * they picked, not a URL they typed, so a link in the header always points at
 * a page that exists.
 *
 * PRIMARY_NAV and HEADER_CTA stay as the fallback, and they are load-bearing:
 * an unreachable CMS, an empty menu, or a menu whose entries were all dropped
 * must leave the header rendering rather than blank it.
 */
import { HEADER_CTA, PRIMARY_NAV, type NavItem, type NavLink } from "@/lib/content";

const CMS_URL = (process.env.CMS_API_URL ?? "http://localhost:3000").replace(/\/$/, "");

/** Matches lib/careers-api.ts — publishes purge by tag, so this is a backstop. */
const REVALIDATE_SECONDS = 3600;
const REQUEST_TIMEOUT_MS = 8000;

/**
 * The stored menu. Key names are the CMS's — each level has its own, inherited
 * from the schema this document has always used; see menuTree.ts there.
 */
type StoredMenuItem = {
  title?: string;
  url?: string;
  child_menu?: StoredChildItem[] | false;
};

type StoredChildItem = {
  title?: string;
  url?: string;
  sub_child_menu?: StoredSubChildItem[] | false;
};

type StoredSubChildItem = {
  title?: string;
  url?: string;
  sub_sub_child_menu?: StoredLeafItem[] | false;
};

type StoredLeafItem = {
  sub_sub_child_title?: string;
  sub_sub_child_url?: string;
};

type HeaderMenuResponse = {
  success: boolean;
  headerMenu?: {
    main_menu?: StoredMenuItem[];
    contact_details?: { ctaText?: string; ctaUrl?: string } | null;
  };
};

export type SiteHeaderContent = {
  nav: NavItem[];
  cta: { label: string; href: string };
};

/** What the header falls back to. Exported so the caller can compare against it. */
export const DEFAULT_HEADER: SiteHeaderContent = {
  nav: PRIMARY_NAV,
  cta: { label: HEADER_CTA.label, href: HEADER_CTA.href },
};

const list = <T,>(value: T[] | false | undefined): T[] =>
  Array.isArray(value) ? value : [];

/**
 * Build one dropdown entry and everything nested under it.
 *
 * An entry needs a label, and then either a destination or children — a label
 * with neither is a dead row, so it is dropped. A label with children and no
 * URL is kept and rendered as a group heading: that is how "Solutions" is
 * authored, a section of the site with no page of its own.
 */
function toNavLink(
  label: string | undefined,
  url: string | undefined,
  children: NavLink[]
): NavLink[] {
  const trimmedLabel = label?.trim();
  if (!trimmedLabel) return [];

  const href = url?.trim();
  if (!href && children.length === 0) return [];

  const link: NavLink = { label: trimmedLabel };
  if (href) link.href = href;
  if (children.length > 0) link.links = children;
  return [link];
}

/**
 * Map the stored tree onto the header's shape, all four levels of it.
 *
 * The depth is preserved rather than flattened: a sub-child pushed up beside
 * its own parent reads as a sibling, which is a different menu from the one the
 * editor built.
 */
function toNavItems(menu: StoredMenuItem[]): NavItem[] {
  return menu.flatMap<NavItem>((item) => {
    const label = item.title?.trim();
    if (!label) return [];

    const children = list(item.child_menu).flatMap((child) =>
      toNavLink(
        child.title,
        child.url,
        list(child.sub_child_menu).flatMap((subChild) =>
          toNavLink(
            subChild.title,
            subChild.url,
            list(subChild.sub_sub_child_menu).flatMap((leaf) =>
              toNavLink(leaf.sub_sub_child_title, leaf.sub_sub_child_url, [])
            )
          )
        )
      )
    );

    const href = item.url?.trim();
    if (children.length > 0) {
      // A top-level group still needs an href for the pill in the bar; the
      // header opens its dropdown and never follows it, so "#" is safe here.
      return [{ label, href: href || "#", links: children }];
    }

    return href ? [{ label, href }] : [];
  });
}

/**
 * The header's navigation and CTA.
 *
 * Never throws and never returns an empty nav — the header is on every page,
 * so a CMS outage has to degrade to the built-in navigation rather than take
 * the chrome down with it.
 */
export async function getSiteHeader(): Promise<SiteHeaderContent> {
  let data: HeaderMenuResponse | null = null;

  try {
    // `cache: "force-cache"` is required: this project does not enable
    // cacheComponents, and under that model Next 16 does NOT cache fetch by
    // default. Without it every visit to every page would hit the CMS.
    const res = await fetch(`${CMS_URL}/api/header-menu`, {
      cache: "force-cache",
      next: { revalidate: REVALIDATE_SECONDS, tags: ["header-menu"] },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (res.ok) data = (await res.json()) as HeaderMenuResponse;
  } catch (error) {
    console.error(
      `[header-menu] CMS request failed at ${CMS_URL}:`,
      error instanceof Error ? error.message : error
    );
  }

  const stored = data?.headerMenu;
  const nav = toNavItems(stored?.main_menu ?? []);
  const contact = stored?.contact_details;

  return {
    // An empty menu is the CMS's own "keep the site's default navigation" —
    // the editor says so in as many words — not a reason to render no nav.
    nav: nav.length > 0 ? nav : DEFAULT_HEADER.nav,
    cta: {
      label: contact?.ctaText?.trim() || DEFAULT_HEADER.cta.label,
      href: contact?.ctaUrl?.trim() || DEFAULT_HEADER.cta.href,
    },
  };
}
