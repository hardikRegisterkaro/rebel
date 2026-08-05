"use client";

import { useId, useState } from "react";

import { SITE } from "@/lib/content";
import { CONTACT, TIMELINES, TOPICS, type Topic } from "@/lib/contact";

const FIELD =
  "min-w-0 rounded-[10px] border border-black/[0.12] bg-paper px-4 py-3.5 text-[0.9rem] text-light-fg outline-brand placeholder:text-light-faint";
const LABEL =
  "font-mono text-[0.6rem] tracking-[0.14em] text-light-muted-2 uppercase";

/**
 * Lead capture for the contact page.
 *
 * Same no-backend approach as components/service/collaboration-form: submitting
 * composes a mail to the lab rather than posting to an endpoint that would
 * silently drop it. Field names already match what a Server Action would
 * expect, so `handleSubmit` is the only thing that changes when one lands.
 */
export function ContactForm() {
  const ids = useId();
  const [topic, setTopic] = useState<Topic>(TOPICS[0]);
  const [sent, setSent] = useState(false);
  const [firstName, setFirstName] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = (key: string) => String(data.get(key) ?? "").trim();

    const submittedName = value("name");
    const body = [
      `Topic: ${topic}`,
      `Name: ${submittedName}`,
      `Email: ${value("email")}`,
      `Organization: ${value("org") || "—"}`,
      `Timeline: ${value("timeline")}`,
      "",
      "The problem:",
      value("msg"),
    ].join("\n");

    setFirstName(submittedName.split(" ")[0]);
    setSent(true);
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(
      `${topic} — ${value("org") || submittedName}`,
    )}&body=${encodeURIComponent(body)}`;
  };

  if (sent) {
    return (
      <div
        data-reveal="fade-right"
        className="rounded-[22px] border border-black/[0.14] bg-paper p-[clamp(26px,3vw,40px)] shadow-[0_24px_60px_-40px_rgb(0_0_0/0.35)]"
      >
        <div className="flex flex-col items-start gap-4.5 px-1 py-6">
          <p className="inline-flex items-center gap-2 font-mono text-[0.62rem] tracking-[0.2em] text-brand uppercase">
            <span
              aria-hidden="true"
              className="inline-block size-1.5 bg-brand"
            />
            Signal received
          </p>
          <h3 className="text-[1.6rem] font-semibold tracking-[-0.015em]">
            Thanks{firstName && `, ${firstName}`} — we&apos;re on it.
          </h3>
          <p className="max-w-[46ch] text-[0.95rem] leading-[1.65] text-light-fg-2">
            Your note is in the lab queue under{" "}
            <span className="font-mono text-light-fg">{topic}</span>. A human
            will reply within 48 hours from{" "}
            <a
              href={`mailto:${SITE.email}`}
              className="font-mono text-light-fg underline underline-offset-2 hover:text-brand"
            >
              {SITE.email}
            </a>
            .
          </p>
          <button
            type="button"
            onClick={() => setSent(false)}
            className="cursor-pointer rounded-[10px] border border-black/20 px-5 py-2.75 font-mono text-[0.68rem] tracking-[0.1em] text-light-fg-2 transition-colors hover:border-brand hover:text-brand"
          >
            Send another →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      data-reveal="fade-right"
      className="rounded-[22px] border border-black/[0.14] bg-paper p-[clamp(26px,3vw,40px)] shadow-[0_24px_60px_-40px_rgb(0_0_0/0.35)]"
    >
      <div className="mb-6.5 flex items-center justify-between gap-3">
        <p className="inline-flex items-center gap-2 font-mono text-[0.62rem] tracking-[0.2em] text-brand uppercase">
          <span aria-hidden="true" className="inline-block size-1.5 bg-brand" />
          {CONTACT.form.eyebrow}
        </p>
        <p className="font-mono text-[0.58rem] tracking-[0.14em] text-light-faint uppercase">
          {CONTACT.form.note}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5.5">
        <fieldset className="flex flex-col gap-2.5">
          <legend className={`${LABEL} mb-2.5`}>
            I&apos;m reaching out about *
          </legend>
          <div className="flex flex-wrap gap-2">
            {TOPICS.map((option) => {
              const active = option === topic;
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setTopic(option)}
                  className={`cursor-pointer rounded-full border px-3.75 py-2.25 font-mono text-[0.66rem] tracking-[0.08em] uppercase transition-[background-color,color,border-color] duration-250 ${
                    active
                      ? "border-light-fg bg-light-fg text-white"
                      : "border-black/[0.22] bg-transparent text-light-muted hover:border-light-fg hover:text-light-fg"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </fieldset>

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
            <span className={LABEL}>Work email *</span>
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
          <label htmlFor={`${ids}-timeline`} className="flex flex-col gap-2.25">
            <span className={LABEL}>Timeline</span>
            <select
              id={`${ids}-timeline`}
              name="timeline"
              defaultValue={TIMELINES[0]}
              className={FIELD}
            >
              {TIMELINES.map((timeline) => (
                <option key={timeline}>{timeline}</option>
              ))}
            </select>
          </label>
        </div>

        <label htmlFor={`${ids}-msg`} className="flex flex-col gap-2.25">
          <span className={LABEL}>The problem *</span>
          <textarea
            id={`${ids}-msg`}
            name="msg"
            required
            rows={4}
            placeholder="What decision, workflow, or question are you trying to solve? What have you already tried?"
            className={`${FIELD} resize-y`}
          />
        </label>

        <div className="mt-1 flex flex-col gap-3.5">
          <button
            type="submit"
            className="group flex cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-light-fg px-5.5 py-4 text-[0.94rem] font-semibold text-white transition-[background-color,box-shadow] duration-300 hover:bg-brand hover:shadow-[0_14px_34px_-14px_rgb(255_51_51/0.65)]"
          >
            Send to the lab
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
