import Link from "next/link";

export default function NotFound() {
  return (
    // The root layout supplies <main>; this is just its content.
    <div className="flex min-h-[60svh] items-center justify-center px-6 py-32">
      <div className="max-w-[46ch]">
        <p className="mb-6 inline-flex items-center gap-2.5 font-mono text-[0.7rem] tracking-[0.22em] text-brand uppercase">
          <span
            aria-hidden="true"
            className="inline-block size-[7px] bg-brand"
          />
          404 // Route not found
        </p>
        <h1 className="text-[clamp(2rem,5vw,3.4rem)] leading-[1.04] font-semibold tracking-[-0.02em]">
          This page isn&apos;t in the lab
          <span className="text-brand">.</span>
        </h1>
        <p className="mt-6 text-[1.05rem] leading-relaxed text-dark-fg-3">
          Not everything we&apos;re building has been published yet. Head back
          to the homepage, or write to us about what you were looking for.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 rounded-full border border-brand bg-brand px-[22px] py-3.5 text-[0.85rem] text-white transition-colors duration-300 hover:bg-brand-hover"
          >
            Back to the lab
          </Link>
          <a
            href="mailto:amigo@rebel-labz.com"
            className="font-mono text-[0.75rem] text-dark-muted underline underline-offset-4 transition-colors hover:text-white"
          >
            amigo@rebel-labz.com
          </a>
        </div>
      </div>
    </div>
  );
}
