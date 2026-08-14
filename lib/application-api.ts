/**
 * Career forms → CMS applications.
 *
 * Two steps, because a JSON body cannot carry a file: the CV is uploaded first
 * and comes back as a URL, then the application is submitted with that URL
 * attached. Splitting them also means a failed submit does not force the
 * candidate to pick their file again.
 *
 * Applications are NOT leads. They go to their own endpoint, their own table
 * and their own dashboard section — a candidate with a CV is not a sales
 * enquiry, and the two are read by different people.
 */

const CMS_URL = (
  process.env.NEXT_PUBLIC_CMS_API_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

/** A CV upload crosses the network twice (to us, then to the media host). */
const UPLOAD_TIMEOUT_MS = 60000;
const SUBMIT_TIMEOUT_MS = 15000;

/** Mirrors the CMS's own limit, so an oversized file is caught before upload. */
export const MAX_CV_BYTES = 10 * 1024 * 1024;
export const CV_ACCEPT = ".pdf,application/pdf";

export type UploadedCv = {
  url: string;
  key: string;
  filename: string;
  bytes: number;
};

export type ApplicationPayload = {
  name: string;
  email: string;
  phoneNo: string;
  /** Slug of the role being applied to; omitted by the talent-pipeline form. */
  roleSlug?: string;
  /** Used when there is no role — the area the candidate works in. */
  discipline?: string;
  note?: string;
  cv?: UploadedCv | null;
};

export type ApplicationResult = { ok: true } | { ok: false; message: string };

/**
 * Check the file before it leaves the browser.
 *
 * The CMS checks all of this again — this is about telling the candidate
 * immediately rather than after a 10MB upload.
 */
export function validateCv(file: File): string | null {
  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) return "Please upload your CV as a PDF.";
  if (file.size === 0) return "That file is empty.";
  if (file.size > MAX_CV_BYTES) return "That file is too large (max 10MB).";
  return null;
}

/** Upload the CV and return where it landed. Never throws. */
export async function uploadCv(
  file: File
): Promise<{ ok: true; cv: UploadedCv } | { ok: false; message: string }> {
  const localError = validateCv(file);
  if (localError) return { ok: false, message: localError };

  try {
    const body = new FormData();
    body.append("file", file);

    const res = await fetch(`${CMS_URL}/api/career-resume`, {
      method: "POST",
      body,
      signal: AbortSignal.timeout(UPLOAD_TIMEOUT_MS),
    });

    const data = (await res.json().catch(() => null)) as
      | { success?: boolean; message?: string; url?: string; key?: string; bytes?: number; filename?: string }
      | null;

    if (!res.ok || !data?.success || !data.url) {
      return {
        ok: false,
        message: data?.message ?? "We couldn't upload your CV. Please try again.",
      };
    }

    return {
      ok: true,
      cv: {
        url: data.url,
        key: data.key ?? "",
        filename: data.filename ?? file.name,
        bytes: data.bytes ?? file.size,
      },
    };
  } catch (error) {
    console.error("[application] CV upload failed:", error instanceof Error ? error.message : error);
    return {
      ok: false,
      message: "We couldn't reach the lab to upload your CV. Please try again.",
    };
  }
}

/** Submit the application itself. Never throws. */
export async function submitApplication(
  payload: ApplicationPayload
): Promise<ApplicationResult> {
  try {
    const res = await fetch(`${CMS_URL}/api/career-application`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        phoneNo: payload.phoneNo,
        roleSlug: payload.roleSlug,
        discipline: payload.discipline,
        note: payload.note,
        resumeUrl: payload.cv?.url,
        resumeKey: payload.cv?.key,
        resumeName: payload.cv?.filename,
        resumeBytes: payload.cv?.bytes,
        // Which page it came from, same as the lead forms record.
        pagePath:
          typeof window === "undefined"
            ? undefined
            : `${window.location.pathname}${window.location.search}`,
      }),
      signal: AbortSignal.timeout(SUBMIT_TIMEOUT_MS),
    });

    const data = (await res.json().catch(() => null)) as
      | { success?: boolean; message?: string }
      | null;

    if (!res.ok || !data?.success) {
      // The CMS writes these messages for the candidate — a closed role, a bad
      // phone number — so they are passed through rather than replaced.
      return { ok: false, message: data?.message ?? "Something went wrong. Please try again." };
    }
    return { ok: true };
  } catch (error) {
    console.error("[application] submit failed:", error instanceof Error ? error.message : error);
    return {
      ok: false,
      message: "We couldn't reach the lab just now. Please try again.",
    };
  }
}
