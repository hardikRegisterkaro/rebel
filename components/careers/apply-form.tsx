"use client";

import { useId, useState } from "react";

import type { Role } from "@/lib/careers";
import { SITE } from "@/lib/content";

const FIELD =
  "min-w-0 rounded-[10px] border border-black/[0.12] bg-paper px-4 py-3.5 text-[0.88rem] text-light-fg outline-brand placeholder:text-light-faint";
const LABEL =
  "font-mono text-[0.6rem] tracking-[0.14em] text-light-muted-2 uppercase";

/**
 * Application form for a single role.
 *
 * The role is prefilled from the page it is rendered on and shown read-only —
 * a visitor should never have to retype what they just clicked, and the value
 * still travels with the submission.
 *
 * Same no-backend approach as the other forms: submitting composes a mail to
 * the lab. A mailto cannot carry an attachment, so the CV field reports the
 * chosen filename and the copy asks the candidate to attach it. Swap
 * `handleSubmit` for a Server Action to accept the file for real — the field
 * names already match what one would expect.
 */
export function ApplyForm({ role }: { role: Role }) {
  const ids = useId();
  const [sent, setSent] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [cvName, setCvName] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = (key: string) => String(data.get(key) ?? "").trim();

    const submittedName = value("name");
    const body = [
      `Role: ${role.title}`,
      `Discipline: ${role.discipline}`,
      `Listing: ${role.meta} · ${role.comp}`,
      "",
      `Name: ${submittedName}`,
      `Email: ${value("email")}`,
      `CV: ${cvName || "—"}`,
      "",
      "Why this role:",
      value("note") || "—",
      "",
      cvName
        ? `Please remember to attach ${cvName} before sending.`
        : "No CV attached.",
    ].join("\n");

    setFirstName(submittedName.split(" ")[0]);
    setSent(true);
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(
      `Application — ${role.title}`,
    )}&body=${encodeURIComponent(body)}`;
  };

  if (sent) {
    return (
      <div className="rounded-[22px] border border-black/[0.14] bg-paper p-[clamp(24px,2.6vw,32px)] shadow-[0_24px_60px_-40px_rgb(0_0_0/0.35)]">
        <div className="flex flex-col items-start gap-4 py-4">
          <p className="inline-flex items-center gap-2 font-mono text-[0.62rem] tracking-[0.2em] text-brand uppercase">
            <span
              aria-hidden="true"
              className="inline-block size-1.5 bg-brand"
            />
            Application received
          </p>
          <h2 className="text-[1.5rem] font-semibold tracking-[-0.015em]">
            Thanks{firstName && `, ${firstName}`} — that&apos;s in.
          </h2>
          <p className="text-[0.92rem] leading-relaxed text-light-fg-2">
            Your mail client should have opened with the application ready to
            send{cvName && " — attach your CV before you do"}. The candidate
            desk replies within one business day.
          </p>
          <button
            type="button"
            onClick={() => setSent(false)}
            className="cursor-pointer rounded-[10px] border border-black/20 px-4.5 py-2.5 font-mono text-[0.68rem] tracking-[0.1em] text-light-fg-2 transition-colors hover:border-brand hover:text-brand"
          >
            edit application →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[22px] border border-black/[0.14] bg-paper p-[clamp(24px,2.6vw,32px)] shadow-[0_24px_60px_-40px_rgb(0_0_0/0.35)]">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h2 className="inline-flex items-center gap-2 font-mono text-[0.62rem] tracking-[0.2em] text-brand uppercase">
          <span aria-hidden="true" className="inline-block size-1.5 bg-brand" />
          Apply for this role
        </h2>
        <p className="font-mono text-[0.58rem] tracking-[0.14em] text-light-faint uppercase">
          Reply &lt; 1 day
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Prefilled and read-only: the visitor already chose this by
            navigating here, and the value still posts with the form. */}
        <label htmlFor={`${ids}-role`} className="flex flex-col gap-2.25">
          <span className={LABEL}>Role</span>
          <input
            id={`${ids}-role`}
            name="role"
            type="text"
            readOnly
            value={role.title}
            className={`${FIELD} cursor-default bg-black/[0.03] font-medium`}
          />
        </label>

        <label htmlFor={`${ids}-name`} className="flex flex-col gap-2.25">
          <span className={LABEL}>Full name *</span>
          <input
            id={`${ids}-name`}
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Ada Lovelace"
            className={FIELD}
          />
        </label>

        <label htmlFor={`${ids}-email`} className="flex flex-col gap-2.25">
          <span className={LABEL}>Email *</span>
          <input
            id={`${ids}-email`}
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="ada@email.com"
            className={FIELD}
          />
        </label>

        <label
          htmlFor={`${ids}-cv`}
          className="flex cursor-pointer items-center justify-between gap-3 rounded-[10px] border border-dashed border-black/20 bg-paper px-4.5 py-4 transition-colors hover:border-brand"
        >
          <span className="min-w-0 truncate text-[0.84rem] text-light-muted">
            {cvName || "Upload CV (PDF, DOCX)"}
          </span>
          <span className="flex-none font-mono text-[0.6rem] tracking-[0.1em] text-brand uppercase">
            {cvName ? "Change" : "Choose file"}
          </span>
          <input
            id={`${ids}-cv`}
            name="cv"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(event) => setCvName(event.target.files?.[0]?.name ?? "")}
            className="hidden"
          />
        </label>

        <label htmlFor={`${ids}-note`} className="flex flex-col gap-2.25">
          <span className={LABEL}>Why this role</span>
          <textarea
            id={`${ids}-note`}
            name="note"
            rows={4}
            placeholder="What draws you to this problem? Anything we should read first?"
            className={`${FIELD} resize-y`}
          />
        </label>

        <div className="mt-1 flex flex-col gap-3.5">
          <button
            type="submit"
            className="group flex cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-light-fg px-5.5 py-4 text-[0.92rem] font-semibold text-white transition-[background-color,box-shadow] duration-300 hover:bg-brand hover:shadow-[0_14px_34px_-14px_rgb(255_51_51/0.65)]"
          >
            Send application
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </button>
          <p className="text-center font-mono text-[0.6rem] tracking-[0.06em] text-light-faint">
            A human reads every application.
          </p>
        </div>
      </form>
    </div>
  );
}
