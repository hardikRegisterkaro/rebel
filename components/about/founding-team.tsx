import Image from "next/image";

import { ABOUT, TEAM, type TeamMember } from "@/lib/about";

/** "Sana Rahal" → "SR". Used until a portrait is available. */
const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

function Portrait({ member }: { member: TeamMember }) {
  if (member.image) {
    return (
      <Image
        src={member.image}
        alt={member.name}
        fill
        sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 23vw"
        className="object-cover grayscale-[0.4] contrast-[1.05] transition-[filter] duration-400 group-hover:grayscale-0"
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(140deg,#111111,#050505)] font-mono text-[2rem] tracking-[0.08em] text-white/25 transition-colors duration-400 group-hover:text-brand/70"
    >
      {initials(member.name)}
    </span>
  );
}

export function FoundingTeam() {
  return (
    <section
      aria-labelledby="team-heading"
      className="border-t border-white/10 bg-ink text-dark-fg"
    >
      <div className="mx-auto max-w-(--spacing-shell) px-6 py-[clamp(64px,10vh,110px)] sm:px-7">
        <div data-reveal="fade-right" className="mb-[clamp(36px,5vh,56px)]">
          <p className="mb-4 inline-flex items-center gap-2.25 font-mono text-[0.68rem] tracking-[0.22em] text-brand uppercase">
            <span
              aria-hidden="true"
              className="inline-block size-[7px] bg-brand"
            />
            {ABOUT.team.eyebrow}
          </p>
          <h2
            id="team-heading"
            className="max-w-[20ch] text-[clamp(1.9rem,4vw,3rem)] leading-[1.05] font-semibold tracking-[-0.02em]"
          >
            {ABOUT.team.heading}
            <span className="text-brand">.</span>
          </h2>
        </div>

        <ul
          data-reveal="fade-up"
          data-reveal-delay="1"
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {TEAM.map((member) => (
            <li key={member.name} className="group min-w-0">
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-ink-800">
                <Portrait member={member} />
              </div>

              <div className="mt-4 flex flex-col gap-1">
                <p className="text-base font-semibold">{member.name}</p>
                <p className="font-mono text-[0.62rem] tracking-[0.1em] text-[#7a7a7a] uppercase">
                  {member.role}
                </p>
              </div>
              <p className="mt-2.5 text-[0.84rem] leading-[1.5] text-[#a8a8a8]">
                {member.bio}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
