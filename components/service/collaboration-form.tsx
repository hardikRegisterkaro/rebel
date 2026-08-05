"use client";

import { useId, useState } from "react";

import { SITE } from "@/lib/content";

const FIELD =
  "min-w-0 rounded-[10px] border border-black/[0.12] bg-paper px-4 py-3.5 text-[0.88rem] text-light-fg outline-brand placeholder:text-light-faint";
const LABEL =
  "font-mono text-[0.6rem] tracking-[0.14em] text-light-muted-2 uppercase";

/**
 * Lead capture for the solution pages.
 *
 * There is no backend, so submitting composes a mail to the lab with the form
 * contents rather than posting to an endpoint that would silently drop it. To
 * move this server-side later, swap `handleSubmit` for a Server Action — the
 * field names already match what such an action would expect.
 */
export function CollaborationForm({
  interests,
  subjectPrefix,
}: {
  interests: string[];
  subjectPrefix: string;
}) {
  const ids = useId();
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = (key: string) => String(data.get(key) ?? "").trim();

    const submittedName = value("name");
    const subject = `${subjectPrefix} — ${value("org") || submittedName}`;
    const body = [
      `Name: ${submittedName}`,
      `Email: ${value("email")}`,
      `Organization: ${value("org") || "—"}`,
      `Interested in: ${value("interest")}`,
      "",
      "The decision:",
      value("decision"),
    ].join("\n");

    setName(submittedName);
    setSent(true);
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  };

  if (sent) {
    return (
      <div
        data-reveal="fade-left"
        data-reveal-delay="1"
        className="rounded-[22px] border border-black/[0.14] bg-paper p-[clamp(26px,3vw,38px)] shadow-[0_24px_60px_-40px_rgb(0_0_0/0.35)]"
      >
        <div className="flex flex-col items-start gap-4 px-1 py-5">
          <p className="inline-flex items-center gap-2 font-mono text-[0.62rem] tracking-[0.2em] text-brand uppercase">
            <span
              aria-hidden="true"
              className="inline-block size-1.5 bg-brand"
            />
            Signal received
          </p>
          <h3 className="text-2xl font-semibold tracking-[-0.015em]">
            Thanks{name && `, ${name}`} — we&apos;re on it.
          </h3>
          <p className="text-[0.92rem] leading-relaxed text-light-fg-2">
            Your mail client should have opened with the request ready to send.
            If it didn&apos;t, write to us directly at{" "}
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
            send another →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      data-reveal="fade-left"
      data-reveal-delay="1"
      className="rounded-[22px] border border-black/[0.14] bg-paper p-[clamp(26px,3vw,38px)] shadow-[0_24px_60px_-40px_rgb(0_0_0/0.35)]"
    >
      <div className="mb-6.5 flex items-center justify-between gap-3">
        <p className="inline-flex items-center gap-2 font-mono text-[0.62rem] tracking-[0.2em] text-brand uppercase">
          <span aria-hidden="true" className="inline-block size-1.5 bg-brand" />
          Start a collaboration
        </p>
        <p className="font-mono text-[0.58rem] tracking-[0.14em] text-light-faint">
          Reply &lt; 48h
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2">
          <label htmlFor={`${ids}-name`} className="flex flex-col gap-2.25">
            <span className={LABEL}>Name *</span>
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
            <span className={LABEL}>Work Email *</span>
            <input
              id={`${ids}-email`}
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="ada@company.com"
              className={FIELD}
            />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2">
          <label htmlFor={`${ids}-org`} className="flex flex-col gap-2.25">
            <span className={LABEL}>Organization</span>
            <input
              id={`${ids}-org`}
              name="org"
              type="text"
              autoComplete="organization"
              placeholder="Company / institute"
              className={FIELD}
            />
          </label>
          <label htmlFor={`${ids}-interest`} className="flex flex-col gap-2.25">
            <span className={LABEL}>Interested In</span>
            <select
              id={`${ids}-interest`}
              name="interest"
              defaultValue={interests[0]}
              className={FIELD}
            >
              {interests.map((interest) => (
                <option key={interest}>{interest}</option>
              ))}
            </select>
          </label>
        </div>

        <label htmlFor={`${ids}-decision`} className="flex flex-col gap-2.25">
          <span className={LABEL}>The Decision *</span>
          <textarea
            id={`${ids}-decision`}
            name="decision"
            required
            rows={3}
            placeholder="Describe the decision, workflow, or question you're working on..."
            className={`${FIELD} resize-y`}
          />
        </label>

        <div className="mt-1 flex flex-col gap-3.5">
          <button
            type="submit"
            className="group flex cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-light-fg px-5.5 py-4 text-[0.92rem] font-semibold text-white transition-colors duration-300 hover:bg-brand"
          >
            Request collaboration
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </button>
          <p className="text-center font-mono text-[0.6rem] tracking-[0.06em] text-light-faint">
            No login. No newsletter. A human reads every submission.
          </p>
        </div>
      </form>
    </div>
  );
}
