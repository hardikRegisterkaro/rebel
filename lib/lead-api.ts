/**
 * Website forms → CMS leads.
 *
 * Every collaboration form on the site used to compose a `mailto:` and hand the
 * visitor off to their mail client. That still works, but nothing was recorded:
 * a submission existed only in somebody's inbox. These forms now POST to the
 * CMS so each one becomes a Lead the team can see, assign and track.
 *
 * The career forms are deliberately NOT routed through here — they upload a CV
 * and have their own flow.
 */

/**
 * Public CMS origin. `NEXT_PUBLIC_` because these submits happen in the
 * browser, unlike the server-side content reads.
 */
const CMS_URL = (
  process.env.NEXT_PUBLIC_CMS_API_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

/** A submit must not hang a visitor on a spinner if the CMS is unreachable. */
const REQUEST_TIMEOUT_MS = 12000;

export type LeadPayload = {
  name: string;
  email: string;
  /**
   * Required — every form asks for one, because the team replies by phone as
   * often as by email. The CMS rejects a submission without it.
   */
  phoneNo: string;
  /** Which form this came from, e.g. "Contact — Research partnership". */
  leadSource: string;
  /** Everything else, as {"Field Label": value} — the dashboard renders these. */
  formData?: Record<string, string>;
};

/**
 * The page the visitor was on when they submitted.
 *
 * Read here rather than passed in by each form: the same modal and the same
 * CTA appear on several pages, so "which form" is not the same question as
 * "which page", and a form cannot answer the second one about itself.
 */
function currentPagePath(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return `${window.location.pathname}${window.location.search}`;
}

export type LeadResult =
  | { ok: true }
  | { ok: false; message: string };

/**
 * Send a lead to the CMS.
 *
 * Never throws: a form's job is to tell the visitor what happened, and an
 * exception escaping here would surface as an unhandled rejection instead of a
 * message they can act on.
 */
export async function submitLead(payload: LeadPayload): Promise<LeadResult> {
  try {
    const res = await fetch(`${CMS_URL}/api/lead`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, pagePath: currentPagePath() }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    const data = (await res.json().catch(() => null)) as
      | { success?: boolean; message?: string }
      | null;

    if (!res.ok || !data?.success) {
      // The CMS validates name/email/phone and returns a message written for a
      // visitor, so it is passed through rather than replaced with a generic one.
      return { ok: false, message: data?.message ?? "Something went wrong. Please try again." };
    }
    return { ok: true };
  } catch (error) {
    console.error("[lead] submit failed:", error instanceof Error ? error.message : error);
    return {
      ok: false,
      message: "We could not reach the lab just now. Please try again, or email us directly.",
    };
  }
}

/**
 * Build a `mailto:` link for a form's failure message.
 *
 * Rendered as a link the visitor can choose to click — never assigned to
 * `window.location`. Redirecting on failure yanked people out of the page and
 * into whatever mail client the OS decided to open (often an empty "Add
 * Account" prompt), losing the form they had just filled in.
 */
export function leadMailto(to: string, subject: string, lines: string[]): string {
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    lines.filter(Boolean).join("\n")
  )}`;
}
