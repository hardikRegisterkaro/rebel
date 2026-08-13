import type { AboutContent } from "@/lib/about-api";

export function ImpactStats({ stats }: { stats: AboutContent["stats"] }) {
  return (
    <section aria-label="Impact so far" className="bg-brand text-white">
      <dl className="mx-auto grid grid-cols-2 max-w-(--spacing-shell) gap-[clamp(20px,3vw,40px)] px-6 py-[clamp(48px,7vh,72px)] sm:px-7 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            data-reveal="fade-up"
            data-reveal-delay={index + 1}
            className="flex flex-col gap-2"
          >
            <dd className="text-[clamp(2.4rem,4.4vw,3.4rem)] leading-none font-bold tracking-[-0.03em]">
              {stat.value}
            </dd>
            <dt className="font-mono text-[0.66rem] tracking-[0.14em] text-white/80 uppercase">
              {stat.label}
            </dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
