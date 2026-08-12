/**
 * The site footer, fetched from the CMS.
 *
 * Mirrors lib/header-menu-api.ts: the columns used to be the static
 * FOOTER_GROUPS in lib/content.ts, so adding a link meant a code change and a
 * deploy. They are now whatever an editor assembled under Footer Menu.
 *
 * FOOTER_GROUPS and SITE stay as the fallback, and they are load-bearing: an
 * unreachable CMS, an empty menu, or a menu whose entries were all dropped must
 * leave the footer rendering rather than blank it.
 *
 * The contact block is a LIST rather than fixed email/phone/linkedin fields,
 * because a lab that adds a second address — or a third social account —
 * should not need a schema change to show it.
 */
import { FOOTER_GROUPS, SITE, type NavGroup, type NavLink } from "@/lib/content";

const CMS_URL = (process.env.CMS_API_URL ?? "http://localhost:3000").replace(/\/$/, "");

/** Matches the other CMS readers — publishes purge by tag, so this is a backstop. */
const REVALIDATE_SECONDS = 3600;
const REQUEST_TIMEOUT_MS = 8000;

/**
 * The stored document. Key names are the CMS's — snake_case, inherited from the
 * schema this document has always used.
 */
/**
 * The stored tree. Each level names its children differently, and the deepest
 * one names its own fields differently again — inherited from the schema this
 * document has always used. Parsed rather than "fixed" in the CMS, because the
 * editor and other consumers already read these names.
 */
type StoredLeafItem = {
  sub_sub_child_title?: string;
  sub_sub_child_url?: string;
};

type StoredSubChildItem = {
  title?: string;
  url?: string;
  sub_sub_child_menu?: StoredLeafItem[] | false;
};

type StoredChildItem = {
  title?: string;
  url?: string;
  sub_child_menu?: StoredSubChildItem[] | false;
};

type StoredMenuItem = {
  title?: string;
  url?: string;
  child_menu?: StoredChildItem[] | false;
};

/** One line in the contact block. `type` decides how it is linked. */
type StoredContactItem = {
  title?: string;
  type?: "email" | "phone" | "address" | "social" | "link" | "text";
  value?: string;
  url?: string;
};

type FooterMenuResponse = {
  success: boolean;
  footerMenu?: {
    main_menu?: StoredMenuItem[];
    contact_details?: StoredContactItem[] | null;
  };
};

/** One contact line, resolved to what the footer actually renders. */
export type ContactLine = {
  label: string;
  /** Absolute or relative href, or null for a line that is not a link. */
  href: string | null;
  /** External links open in a new tab and need rel="noreferrer". */
  external: boolean;
};

export type SiteFooterContent = {
  /** Short paragraph under the logo. */
  tagline: string;
  contact: ContactLine[];
  groups: NavGroup[];
};

/**
 * Build the href for a contact line from its type.
 *
 * An explicit `url` always wins — an editor who typed one meant it. Otherwise
 * `email` and `phone` get their schemes derived, since typing `mailto:` by hand
 * is exactly the kind of thing that gets forgotten.
 */
function contactHref(item: StoredContactItem): { href: string | null; external: boolean } {
  const value = (item.value ?? "").trim();
  const url = (item.url ?? "").trim();

  if (url) return { href: url, external: /^https?:\/\//i.test(url) };

  switch (item.type) {
    case "email":
      return value ? { href: `mailto:${value}`, external: false } : { href: null, external: false };
    case "phone":
      // Strip spaces, dashes and brackets: tel: wants digits and a leading +.
      return value
        ? { href: `tel:${value.replace(/[^\d+]/g, "")}`, external: false }
        : { href: null, external: false };
    // address and text are informational; social and link need an explicit url.
    default:
      return { href: null, external: false };
  }
}

/** The shipped contact block, used when the CMS has none. */
const FALLBACK_CONTACT: ContactLine[] = [
  { label: SITE.email, href: `mailto:${SITE.email}`, external: false },
  { label: SITE.phone, href: SITE.phoneHref, external: false },
  { label: SITE.linkedin, href: SITE.linkedinHref, external: true },
];

const FALLBACK: SiteFooterContent = {
  tagline: SITE.tagline,
  contact: FALLBACK_CONTACT,
  groups: FOOTER_GROUPS,
};

const list = <T,>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);

/**
 * Turn the stored tree into footer columns, at whatever depth the CMS holds.
 *
 * Nesting is preserved rather than flattened: an editor who nested an entry
 * meant it to sit under its parent, and flattening would silently present a
 * child as a sibling. NavLink already nests, so the footer renders as deep as
 * the menu goes.
 *
 * An entry survives if it has a label AND either a link or children — a label
 * with neither is dead text in a list of destinations.
 */
function toLinks(items: StoredChildItem[]): NavLink[] {
  return items
    .map((child) => {
      const grandchildren: NavLink[] = list<StoredSubChildItem>(child.sub_child_menu)
        .map((sub) => {
          // The deepest level names its fields differently.
          const leaves: NavLink[] = list<StoredLeafItem>(sub.sub_sub_child_menu)
            .map((leaf) => ({
              label: (leaf.sub_sub_child_title ?? "").trim(),
              href: (leaf.sub_sub_child_url ?? "").trim(),
            }))
            .filter((leaf) => leaf.label && leaf.href);

          return {
            label: (sub.title ?? "").trim(),
            href: (sub.url ?? "").trim(),
            ...(leaves.length ? { links: leaves } : {}),
          };
        })
        .filter((sub) => sub.label && (sub.href || sub.links?.length));

      return {
        label: (child.title ?? "").trim(),
        href: (child.url ?? "").trim(),
        ...(grandchildren.length ? { links: grandchildren } : {}),
      };
    })
    .filter((link) => link.label && (link.href || link.links?.length));
}

function toGroups(items: StoredMenuItem[]): NavGroup[] {
  return items
    .map((item) => ({
      label: (item.title ?? "").trim(),
      links: toLinks(list<StoredChildItem>(item.child_menu)),
    }))
    .filter((group) => group.label && group.links.length > 0);
}

function toContact(items: StoredContactItem[]): ContactLine[] {
  return items
    .map((item) => {
      const label = (item.value ?? item.title ?? "").trim();
      const { href, external } = contactHref(item);
      return { label, href, external };
    })
    .filter((line) => line.label);
}

export async function getSiteFooter(): Promise<SiteFooterContent> {
  try {
    const res = await fetch(`${CMS_URL}/api/footer-menu`, {
      cache: "force-cache",
      next: { revalidate: REVALIDATE_SECONDS, tags: ["footer-menu"] },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!res.ok) return FALLBACK;

    const data = (await res.json()) as FooterMenuResponse;
    const stored = data?.footerMenu;

    const groups = toGroups(Array.isArray(stored?.main_menu) ? stored.main_menu : []);
    const contact = toContact(
      Array.isArray(stored?.contact_details) ? stored.contact_details : []
    );

    // Each half falls back independently: an editor who has built the columns
    // but not the contact block should still get their columns.
    return {
      tagline: FALLBACK.tagline,
      groups: groups.length ? groups : FALLBACK.groups,
      contact: contact.length ? contact : FALLBACK.contact,
    };
  } catch (error) {
    console.error(
      `[footer] CMS request failed at ${CMS_URL}:`,
      error instanceof Error ? error.message : error
    );
    return FALLBACK;
  }
}
