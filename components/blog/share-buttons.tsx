"use client";

import { useState } from "react";

const BUTTON =
  "grid size-11 place-items-center rounded-[10px] border border-white/[0.14] font-mono text-[0.72rem] text-dark-fg transition-colors duration-250 hover:border-brand hover:text-brand";

/**
 * Share the article.
 *
 * LinkedIn and X are plain links — no SDK, no tracking script, nothing that
 * loads third-party code onto the page. The third button copies the URL, which
 * is the one action that needs the browser.
 */
export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be refused (permissions, insecure context). The
      // URL is in the address bar either way, so this stays silent.
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-[0.62rem] tracking-[0.18em] text-dark-muted uppercase">
        Share
      </span>

      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className={BUTTON}
      >
        in
      </a>

      <a
        href={`https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
        className={BUTTON}
      >
        X
      </a>

      <button
        type="button"
        onClick={copy}
        aria-label="Copy link"
        className={`${BUTTON} cursor-pointer ${copied ? "border-brand text-brand" : ""}`}
      >
        {copied ? "✓" : "↗"}
      </button>
    </div>
  );
}
