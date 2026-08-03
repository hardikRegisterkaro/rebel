/** The Energy Talents sunrise mark. */
export function EtLogo({
  width = 34,
  height = 26,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 34 26"
      fill="none"
      aria-hidden="true"
    >
      <g stroke="#EA580C" strokeWidth="1.6" strokeLinecap="round">
        {/* Rays */}
        <line x1="17" y1="1" x2="17" y2="6" />
        <line x1="8" y1="4" x2="11" y2="8" />
        <line x1="26" y1="4" x2="23" y2="8" />
        <line x1="3" y1="11" x2="8" y2="12" />
        <line x1="31" y1="11" x2="26" y2="12" />
        {/* Horizon */}
        <line x1="6" y1="16" x2="28" y2="16" />
        <line x1="4" y1="19.5" x2="30" y2="19.5" />
        <line x1="7" y1="23" x2="27" y2="23" />
      </g>
    </svg>
  );
}

export function EtWordmark({ width = 34, height = 26 }) {
  return (
    <span className="flex shrink-0 items-center gap-2.5">
      <EtLogo width={width} height={height} />
      <span className="font-head text-[11px] leading-[1.1] font-bold tracking-[.28em] text-[var(--et-ink)]">
        ENERGY
        <br />
        TALENTS
      </span>
    </span>
  );
}
