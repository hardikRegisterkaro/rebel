import type { Role } from "@/lib/careers";
import { PERKS } from "@/lib/careers";

function Block({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <section className="mt-10">
      <h2 className="mb-4.5 font-mono text-[0.68rem] tracking-[0.22em] text-brand uppercase">
        {title}
      </h2>
      <ul className="flex flex-col gap-3.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="mt-2 inline-block size-1.5 flex-none bg-brand"
            />
            <span className="text-[0.94rem] leading-[1.6] text-light-fg-2">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** The left column of a role page: what the job actually is. */
export function JobDetail({ role }: { role: Role }) {
  return (
    <div data-reveal="fade-right" className="min-w-0">
      <h2 className="mb-4.5 font-mono text-[0.68rem] tracking-[0.22em] text-brand uppercase">
        The role
      </h2>
      <p className="max-w-[62ch] text-[1.05rem] leading-[1.65] text-light-fg-2">
        {role.summary}
      </p>

      <Block title="What you'll do" items={role.responsibilities} />
      <Block title="What you bring" items={role.requirements} />

      <section className="mt-10 border-t border-black/[0.1] pt-8">
        <h2 className="mb-4.5 font-mono text-[0.68rem] tracking-[0.22em] text-brand uppercase">
          What we offer
        </h2>
        {/* Shared with the careers index — the offer is the same for every
            role, so it lives in one place rather than per-role copy. */}
        <ul className="grid grid-cols-1 gap-x-8 gap-y-3.5 sm:grid-cols-2">
          {PERKS.map((perk) => (
            <li key={perk.title} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="mt-1.5 inline-block size-2 flex-none rotate-45 bg-brand"
              />
              <span className="text-[0.92rem] leading-[1.55] text-light-fg-2">
                <strong className="font-semibold text-light-fg">
                  {perk.title}
                </strong>{" "}
                — {perk.desc}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
