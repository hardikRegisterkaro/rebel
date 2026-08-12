import type { ComparisonRow } from "@/lib/solutions";

/**
 * Traditional-AI vs Rebel-Labz comparison. A real <table> so the relationship
 * between a capability and its two answers survives screen readers; below `md`
 * the header row is dropped and each cell carries its own visible label.
 */
type Header = {
  eyebrow: string;
  heading: string;
  aside: string;
  columns: { feature: string; traditional: string; rebel: string };
};

export function ComparisonTable({
  rows,
  header,
}: {
  rows: ComparisonRow[];
  header: Header;
}) {
  return (
    <section
      id="advantage"
      aria-labelledby="advantage-heading"
      className="bg-ink text-dark-fg"
    >
      <div className="mx-auto max-w-(--spacing-shell) px-6 py-[clamp(68px,10vh,116px)] sm:px-7">
        <div
          data-reveal="fade-right"
          className="mb-[clamp(36px,5vh,56px)] max-w-[60ch]"
        >
          <p className="mb-4 inline-flex items-center gap-2.5 font-mono text-[0.68rem] tracking-[0.22em] text-brand uppercase">
            <span
              aria-hidden="true"
              className="inline-block size-[7px] bg-brand"
            />
            {header.eyebrow}
          </p>
          <h2
            id="advantage-heading"
            className="text-[clamp(1.9rem,4vw,3.1rem)] leading-[1.05] font-semibold tracking-[-0.022em]"
          >
            {header.heading}<span className="text-brand">?</span>
          </h2>
          <p className="mt-5 text-[0.98rem] leading-relaxed text-[#a8a8a8]">
            {header.aside}
          </p>
        </div>

        <div
          data-reveal="zoom-in"
          data-reveal-delay="1"
          className="overflow-hidden rounded-[22px] border border-white/[0.14] bg-ink-800"
        >
          <table className="w-full border-collapse text-left max-md:block">
            <thead className="max-md:hidden">
              <tr className="bg-white/[0.03]">
                <th
                  scope="col"
                  className="w-[38%] border-b border-white/[0.14] px-6.5 py-5 font-mono text-[0.62rem] font-normal tracking-[0.16em] text-dark-muted-2 uppercase"
                >
                  {header.columns.feature}
                </th>
                <th
                  scope="col"
                  className="w-[31%] border-b border-l border-white/[0.14] px-6.5 py-5 font-mono text-[0.62rem] font-normal tracking-[0.16em] text-dark-muted-2 uppercase"
                >
                  {header.columns.traditional}
                </th>
                <th
                  scope="col"
                  className="w-[31%] border-b border-l border-brand/35 bg-brand/[0.12] px-6.5 py-5 font-mono text-[0.62rem] font-normal tracking-[0.16em] text-white uppercase"
                >
                  <span className="inline-flex items-center gap-2.5">
                    <span
                      aria-hidden="true"
                      className="inline-block size-1.5 bg-brand"
                    />
                    Rebel Labz
                  </span>
                </th>
              </tr>
            </thead>

            <tbody className="max-md:block">
              {rows.map((row) => (
                <tr
                  key={row.feature}
                  className="border-b border-white/[0.09] last:border-b-0 max-md:block"
                >
                  <th
                    scope="row"
                    className="px-6.5 py-5.5 text-left text-[0.95rem] font-semibold max-md:block max-md:pb-2"
                  >
                    {row.feature}
                  </th>

                  <td className="border-l border-white/[0.09] px-6.5 py-5.5 align-top text-[0.9rem] leading-normal text-[#7a7a7a] max-md:block max-md:border-l-0 max-md:py-3">
                    <span className="mb-2 block font-mono text-[0.55rem] tracking-[0.16em] text-dark-muted-2 uppercase md:hidden">
                      {header.columns.traditional}
                    </span>
                    <span className="flex items-start gap-2.5">
                      <span
                        aria-hidden="true"
                        className="mt-1.5 size-1.75 flex-none border border-[#4a4a4a]"
                      />
                      {row.traditional}
                    </span>
                  </td>

                  <td className="border-l border-brand/30 bg-brand/[0.06] px-6.5 py-5.5 align-top text-[0.9rem] leading-normal text-[#f0f0f0] max-md:block max-md:border-l-0 max-md:py-3">
                    <span className="mb-2 block font-mono text-[0.55rem] tracking-[0.16em] text-brand uppercase md:hidden">
                      Rebel Labz
                    </span>
                    <span className="flex items-start gap-2.5">
                      <span
                        aria-hidden="true"
                        className="mt-1.5 size-1.75 flex-none bg-brand"
                      />
                      {row.rebel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
