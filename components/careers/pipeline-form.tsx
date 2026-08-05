"use client";

import { useId, useState } from "react";

import { CAREERS } from "@/lib/careers";
import { SITE } from "@/lib/content";

const FIELD =
  "min-w-0 rounded-[10px] border border-black/[0.12] bg-paper px-4 py-3.5 text-[0.88rem] text-light-fg outline-brand placeholder:text-light-faint";
const LABEL =
  "font-mono text-[0.6rem] tracking-[0.14em] text-light-muted-2 uppercase";

/**
 * Candidate pipeline signup.
 *
 * Same no-backend approach as components/service/collaboration-form: submitting
 * composes a mail to the lab rather than posting to an endpoint that would
 * silently drop it. A mailto cannot carry an attachment, so the CV field only
 * reports the chosen filename and the copy asks the candidate to attach it —
 * swap `handleSubmit` for a Server Action to accept the file for real.
 */
export function PipelineForm() {
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
      `Name: ${submittedName}`,
      `Email: ${value("email")}`,
      `Discipline: ${value("discipline")}`,
      `CV: ${cvName || "—"}`,
      "",
      cvName
        ? `Please remember to attach ${cvName} before sending.`
        : "No CV attached.",
    ].join("\n");

    setFirstName(submittedName.split(" ")[0]);
    setSent(true);
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(
      `Workforce pipeline — ${submittedName}`,
    )}&body=${encodeURIComponent(body)}`;
  };

  if (sent) {
    return (
      <div
        data-reveal="fade-left"
        data-reveal-delay="1"
        className="rounded-[22px] border border-black/[0.12] bg-paper p-[clamp(26px,3vw,38px)]"
      >
        <div className="flex flex-col items-start gap-4 px-1 py-5">
          <p className="inline-flex items-center gap-2 font-mono text-[0.62rem] tracking-[0.2em] text-brand uppercase">
            <span
              aria-hidden="true"
              className="inline-block size-1.5 bg-brand"
            />
            Added to the pipeline
          </p>
          <h3 className="text-2xl font-semibold tracking-[-0.015em]">
            Thanks{firstName && `, ${firstName}`} — you&apos;re in.
          </h3>
          <p className="text-[0.92rem] leading-relaxed text-light-fg-2">
            Your mail client should have opened with your details ready to send
            {cvName && " — attach your CV before you do"}. If it didn&apos;t,
            write to us directly at{" "}
            <a
              href={`mailto:${SITE.email}`}
              className="font-mono underline underline-offset-2 hover:text-brand"
            >
              {SITE.email}
            </a>
            .
          </p>
          <button
            type="button"
            onClick={() => setSent(false)}
            className="cursor-pointer rounded-[10px] border border-black/20 px-4.5 py-2.5 font-mono text-[0.68rem] tracking-[0.1em] text-light-fg-2 transition-colors hover:border-brand hover:text-brand"
          >
            edit details →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      data-reveal="fade-left"
      data-reveal-delay="1"
      className="rounded-[22px] border border-black/[0.12] bg-paper p-[clamp(26px,3vw,38px)]"
    >
      <p className="mb-7 font-mono text-[0.62rem] tracking-[0.2em] text-brand uppercase">
        Join The Workforce Pipeline
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5.5">
        <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2">
          <label htmlFor={`${ids}-name`} className="flex flex-col gap-2.25">
            <span className={LABEL}>Full Name *</span>
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
        </div>

        <label htmlFor={`${ids}-discipline`} className="flex flex-col gap-2.25">
          <span className={LABEL}>Discipline</span>
          <select
            id={`${ids}-discipline`}
            name="discipline"
            defaultValue={CAREERS.pipeline.disciplines[0]}
            className={FIELD}
          >
            {CAREERS.pipeline.disciplines.map((discipline) => (
              <option key={discipline}>{discipline}</option>
            ))}
          </select>
        </label>

        <label
          htmlFor={`${ids}-cv`}
          className="flex cursor-pointer items-center justify-between gap-3 rounded-[10px] border border-dashed border-black/20 bg-paper px-4.5 py-4 transition-colors hover:border-brand"
        >
          <span className="min-w-0 truncate text-[0.84rem] text-light-muted">
            {cvName || "Upload CV / portfolio (PDF, DOCX)"}
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

        <div className="mt-1 flex flex-col gap-3.5">
          <button
            type="submit"
            className="group flex cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-brand px-5.5 py-4 text-[0.92rem] font-semibold text-white transition-colors duration-300 hover:bg-brand-hover"
          >
            [ Join The Pipeline
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
            ]
          </button>
          <p className="text-center font-mono text-[0.6rem] tracking-[0.06em] text-light-faint">
            No spam. Unsubscribe anytime. A human reviews every profile.
          </p>
        </div>
      </form>
    </div>
  );
}
