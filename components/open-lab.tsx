"use client";

import { useId, useState } from "react";

import { SITE } from "@/lib/content";

/**
 * Closing CTA. The terminal prompt composes a mail to the lab with whatever
 * question the visitor typed as the subject — a plain `mailto:` so it works
 * without a backend and degrades to the address printed underneath.
 *
 * `tone` exists so the section can sit on either surface: pages alternate
 * dark/light, and this is the last section on more than one of them, so which
 * one it needs depends on what precedes it.
 */
export function OpenLab({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  const [question, setQuestion] = useState("");
  const inputId = useId();

  const subject = question.trim() || "A question worth working on";
  const mailto = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}`;

  return (
    <section
      id="openlab"
      aria-labelledby="openlab-heading"
      className={`scroll-mt-24 ${dark ? "border-t border-white/10 bg-ink text-dark-fg" : "bg-paper text-light-fg"}`}
    >
      <div className="mx-auto max-w-(--spacing-shell) px-6 pt-[clamp(84px,13vh,150px)] pb-[clamp(40px,6vh,70px)] sm:px-7">
        <p
          data-reveal
          className={`mb-8 flex items-center gap-3 text-[0.74rem] tracking-[0.12em] ${dark ? "text-dark-fg-2" : "text-light-muted-2"}`}
        >
          <span
            className={`inline-flex items-center gap-2.5 rounded-full border px-4 py-2 ${dark ? "border-white/[0.16]" : "border-black/[0.14]"}`}
          >
            <span
              aria-hidden="true"
              className="inline-block size-[7px] animate-(--animate-soft-pulse) rounded-full bg-brand"
            />
            Lab Status: Open
          </span>
        </p>

        <h2
          id="openlab-heading"
          data-reveal
          className="max-w-[18ch] text-[clamp(2.4rem,6.4vw,5rem)] leading-none font-semibold tracking-[-0.02em] text-balance"
        >
          The most important <em className="italic">conversations</em>{" "}
          shouldn&apos;t require a login.
        </h2>

        <p
          data-reveal
          className={`mt-8 max-w-[46ch] text-[clamp(1.05rem,1.8vw,1.35rem)] leading-snug ${dark ? "text-dark-fg-3" : "text-light-fg-2"}`}
        >
          Rebel Labz is a shared workshop, not a closed vault. We work with
          researchers, enterprises, and citizens to make intelligence{" "}
          <em className="italic">affordable</em>,{" "}
          <em className="italic">accessible</em>, and{" "}
          <em className="italic">worth having</em>.
        </p>

        <form
          data-reveal
          action={mailto}
          onSubmit={(event) => {
            event.preventDefault();
            window.location.href = mailto;
          }}
          className="mt-12 max-w-[620px]"
        >
          <div
            className={`flex flex-wrap items-center gap-3 rounded-[14px] bg-ink-600 p-4 pl-5 sm:flex-nowrap ${dark ? "border border-white/10" : ""}`}
          >
            <label
              htmlFor={inputId}
              className="flex-none font-mono text-[0.86rem] text-dark-muted-2"
            >
              rebel@labz:~$
            </label>
            <input
              id={inputId}
              type="text"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="state a question worth working on"
              className="min-w-0 flex-1 border-none bg-transparent font-mono text-[0.9rem] text-[#f5f5f5] caret-brand outline-none placeholder:text-dark-faint"
            />
            <button
              type="submit"
              className="flex-none cursor-pointer rounded-[9px] bg-brand px-4.5 py-2.5 font-mono text-[0.82rem] tracking-[0.02em] text-[#f5f5f5] transition-colors duration-300 hover:bg-brand-hover"
            >
              send →
            </button>
          </div>

          <div
            className={`mt-3.5 flex flex-wrap items-center justify-between gap-2.5 font-mono text-[0.68rem] ${dark ? "text-dark-muted" : "text-light-muted-2"}`}
          >
            <span className="inline-flex items-center gap-2">
              <span
                aria-hidden="true"
                className="inline-block size-[7px] animate-(--animate-soft-pulse) rounded-full bg-brand"
              />
              [ Lab Node: Online / Open to Collaboration ]
            </span>
            <span>
              or write to{" "}
              <a
                href={`mailto:${SITE.email}`}
                className="underline underline-offset-2 hover:text-brand"
              >
                {SITE.email}
              </a>
            </span>
          </div>
        </form>
      </div>
    </section>
  );
}
