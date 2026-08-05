import type { CSSProperties, ReactNode } from "react";

/**
 * The live "signature" that runs inside each foundational-principle card.
 *
 * Every stage is a single charcoal computational line with one red motion whose
 * behaviour matches the principle's meaning — a write-head that never erases,
 * a graph that links up node by node, a wave compressing against fixed walls.
 * All declarative SVG plus CSS keyframes: no rAF, no client JS.
 */

const W = 260;
const H = 120;
const MID = 60;
const X0 = 14;
const X1 = 246;
const SPAN = X1 - X0;

const FG = "rgb(255 255 255 / 0.72)";
const FAINT = "rgb(255 255 255 / 0.18)";
const FAINTER = "rgb(255 255 255 / 0.10)";
const BASE = "rgb(255 255 255 / 0.15)";
const BRAND = "#FF3333";

const loop = (name: string, seconds: number, easing = "linear", delay = 0) =>
  `${name} ${seconds}s ${easing} ${delay.toFixed(2)}s infinite`;

/** A sine wave sampled across the full width. */
function sine(amplitude: number, cycles: number, midline = MID) {
  const steps = 140;
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const x = X0 + (SPAN * i) / steps;
    const y =
      midline - amplitude * Math.sin((cycles * 2 * Math.PI * i) / steps);
    d += `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)} `;
  }
  return d;
}

/** A square wave — the "structured signal" motif. */
function square(amplitude: number, count: number, midline = MID) {
  let d = `M${X0} ${midline} `;
  const segment = SPAN / (count * 2);
  let x = X0;
  let up = true;
  for (let i = 0; i < count * 2; i++) {
    const y = up ? midline - amplitude : midline + amplitude;
    d += `L${x.toFixed(1)} ${y.toFixed(1)} `;
    x += segment;
    d += `L${x.toFixed(1)} ${y.toFixed(1)} `;
    up = !up;
  }
  return `${d}L${X1} ${midline}`;
}

export function Signature({ stage }: { stage: number }) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      className="block overflow-visible"
    >
      {/* Baseline ticks shared by every stage */}
      {Array.from({ length: 9 }, (_, i) => {
        const x = X0 + (SPAN * i) / 8;
        return (
          <line
            key={`tick-${i}`}
            x1={x}
            y1={MID - 2}
            x2={x}
            y2={MID + 2}
            stroke={FAINTER}
            strokeWidth="0.6"
          />
        );
      })}
      {STAGES[stage]?.() ?? null}
    </svg>
  );
}

/* ── Shared building blocks ─────────────────────────────────────────────── */

type PathProps = {
  d: string;
  stroke: string;
  width?: number;
  style?: CSSProperties;
  dash?: string;
  pathLength?: number;
};

const Path = ({
  d,
  stroke,
  width = 1.4,
  style,
  dash,
  pathLength,
}: PathProps) => (
  <path
    d={d}
    fill="none"
    stroke={stroke}
    strokeWidth={width}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeDasharray={dash}
    pathLength={pathLength}
    style={style}
  />
);

/** A dim path that the brand colour redraws end to end, then clears. */
const DrawOn = ({
  d,
  width = 1.5,
  seconds = 3.4,
}: {
  d: string;
  width?: number;
  seconds?: number;
}) => (
  <>
    <Path d={d} stroke={BASE} width={width} />
    <Path
      d={d}
      stroke={BRAND}
      width={width + 0.2}
      pathLength={100}
      dash="100"
      style={{ animation: loop("sig-draw", seconds, "ease-in-out") }}
    />
  </>
);

/* ── Stages ─────────────────────────────────────────────────────────────── */

const STAGES: Record<number, () => ReactNode> = {
  // 02 · Contextual Memory — a write-head sweeps; every cell it passes locks
  // into memory and stays held. Nothing forgotten.
  2: () => {
    const topY = MID - 20;
    const cells = 11;
    return (
      <>
        <Path
          d={square(9, 6, topY)}
          stroke="rgb(255 255 255 / 0.16)"
          width={1.1}
        />
        <Path
          d={`M${X0} ${MID + 24} L${X1} ${MID + 24}`}
          stroke={FAINTER}
          width={0.8}
        />
        {Array.from({ length: cells }, (_, i) => {
          const x = X0 + (SPAN * (i + 0.5)) / cells;
          return (
            <g key={i}>
              <line
                x1={x}
                y1={topY + 9}
                x2={x}
                y2={MID + 6}
                stroke="rgb(255 255 255 / 0.07)"
                strokeWidth="0.6"
              />
              <line
                x1={x}
                y1={MID + 8}
                x2={x}
                y2={MID + 24}
                stroke={FAINTER}
                strokeWidth="2"
              />
              <line
                x1={x}
                y1={MID + 24}
                x2={x}
                y2={MID + 8}
                stroke={FG}
                strokeWidth="2"
                strokeLinecap="round"
                style={{
                  transformBox: "fill-box",
                  transformOrigin: "bottom",
                  animation: loop("sig-write", 4.6, "ease-in-out", i * 0.34),
                }}
              />
            </g>
          );
        })}
        <g style={{ animation: loop("sig-scan", 4.6, "ease-in-out") }}>
          <line
            x1={X0}
            y1={MID - 28}
            x2={X0}
            y2={MID + 27}
            stroke={BRAND}
            strokeWidth="1.4"
          />
          <circle cx={X0} cy={MID - 28} r="2.6" fill={BRAND} />
        </g>
      </>
    );
  },

  // 03 · Collective Knowledge — a living graph; links form one at a time.
  3: () => {
    const nodes: [number, number][] = [
      [26, 88],
      [66, 32],
      [114, 76],
      [102, 22],
      [158, 50],
      [144, 96],
      [198, 26],
      [212, 74],
      [240, 46],
    ];
    const edges: [number, number][] = [
      [0, 1],
      [1, 2],
      [1, 3],
      [2, 4],
      [3, 4],
      [4, 5],
      [4, 6],
      [6, 8],
      [5, 7],
      [7, 8],
      [2, 5],
      [6, 7],
    ];
    return (
      <>
        {edges.map(([a, b], i) => (
          <line
            key={`b${i}`}
            x1={nodes[a][0]}
            y1={nodes[a][1]}
            x2={nodes[b][0]}
            y2={nodes[b][1]}
            stroke={FAINTER}
            strokeWidth="0.7"
          />
        ))}
        {edges.map(([a, b], i) => (
          <line
            key={`e${i}`}
            x1={nodes[a][0]}
            y1={nodes[a][1]}
            x2={nodes[b][0]}
            y2={nodes[b][1]}
            stroke={BRAND}
            strokeWidth="0.9"
            style={{
              animation: loop(
                "sig-appear",
                5.2,
                "ease-in-out",
                -5.2 + i * 0.42,
              ),
            }}
          />
        ))}
        {nodes.map(([x, y], i) => (
          <circle
            key={`n${i}`}
            cx={x}
            cy={y}
            r={i === 4 ? 2.8 : 2.1}
            fill={i === 4 ? BRAND : FG}
          />
        ))}
      </>
    );
  },

  // 04 · Continuous Learning — a closed circuit; output loops back as input.
  4: () => {
    const d =
      `M ${X0 + 16} ${MID - 22} L ${X1 - 16} ${MID - 22} Q ${X1} ${MID - 22} ${X1} ${MID - 6}` +
      ` L ${X1} ${MID + 6} Q ${X1} ${MID + 22} ${X1 - 16} ${MID + 22} L ${X0 + 16} ${MID + 22}` +
      ` Q ${X0} ${MID + 22} ${X0} ${MID + 6} L ${X0} ${MID - 6} Q ${X0} ${MID - 22} ${X0 + 16} ${MID - 22} Z`;
    return (
      <>
        <Path d={d} stroke={BASE} />
        <Path
          d={d}
          stroke={BRAND}
          width={1.7}
          pathLength={100}
          dash="20 100"
          style={{ animation: loop("trace-flow", 3.2) }}
        />
        <Path
          d={`M${X0 + 118} ${MID - 26.5} L${X0 + 126} ${MID - 22} L${X0 + 118} ${MID - 17.5}`}
          stroke={FG}
          width={1.2}
        />
        <Path
          d={`M${X0 + 126} ${MID + 17.5} L${X0 + 118} ${MID + 22} L${X0 + 126} ${MID + 26.5}`}
          stroke={FG}
          width={1.2}
        />
        <text
          x={(X0 + X1) / 2}
          y={MID + 3.5}
          fill="rgb(255 255 255 / 0.35)"
          fontSize="9"
          fontFamily="var(--font-jetbrains-mono), monospace"
          textAnchor="middle"
          letterSpacing="2"
        >
          FEEDBACK
        </text>
      </>
    );
  },

  // 05 · Shared Cognition — stepped inference climbing premise → consequence.
  5: () => {
    const steps = 5;
    let d = `M${X0} ${MID + 24} `;
    let y = MID + 24;
    for (let i = 0; i < steps; i++) {
      const x = X0 + (SPAN * (i + 1)) / steps;
      d += `L${x.toFixed(1)} ${y.toFixed(1)} `;
      if (i < steps - 1) {
        y -= 12;
        d += `L${x.toFixed(1)} ${y.toFixed(1)} `;
      }
    }
    return (
      <>
        <DrawOn d={d} width={1.5} seconds={4.2} />
        {Array.from({ length: steps }, (_, i) => (
          <circle
            key={i}
            cx={X0 + (SPAN * (i + 0.5)) / steps}
            cy={MID + 24 - i * 12 - 6}
            r="2.4"
            fill={BRAND}
            style={{ animation: loop("sig-step", 4.2, "ease-in-out", i * 0.7) }}
          />
        ))}
      </>
    );
  },

  // 06 · Distilled Intelligence — layers condense; the essence drips down.
  6: () => {
    const cx = (X0 + X1) / 2;
    return (
      <>
        {[0, 1, 2, 3].map((i) => {
          const y = MID - 32 + i * 8;
          const inset = i * 28;
          return (
            <line
              key={i}
              x1={X0 + inset}
              y1={y}
              x2={X1 - inset}
              y2={y}
              stroke={`rgb(255 255 255 / ${(0.16 + i * 0.11).toFixed(2)})`}
              strokeWidth="1"
              style={{
                animation: loop("sig-retain", 3.4, "ease-in-out", -i * 0.5),
              }}
            />
          );
        })}
        <Path
          d={`M${X0 + 84} ${MID - 1} L${cx} ${MID + 13}`}
          stroke={FAINT}
          width={1}
        />
        <Path
          d={`M${X1 - 84} ${MID - 1} L${cx} ${MID + 13}`}
          stroke={FAINT}
          width={1}
        />
        <circle
          cx={cx}
          cy={MID + 16}
          r="2.4"
          fill={BRAND}
          style={{ animation: loop("sig-drip", 2.6, "ease-in") }}
        />
        <Path
          d={`M${X0 + 44} ${MID + 42} L${X1 - 44} ${MID + 42}`}
          stroke={FG}
          width={1.8}
        />
        <Path
          d={`M${X0 + 44} ${MID + 42} L${X1 - 44} ${MID + 42}`}
          stroke={BRAND}
          width={2}
          pathLength={100}
          dash="22 100"
          style={{ animation: loop("trace-flow", 3.4) }}
        />
      </>
    );
  },

  // 07 · Reinforced Adaptation — the wave flexes against fixed walls.
  7: () => {
    const d = sine(14, 8);
    return (
      <>
        <line
          x1={X0}
          y1={MID - 30}
          x2={X0}
          y2={MID + 30}
          stroke={FAINT}
          strokeWidth="1"
        />
        <line
          x1={X1}
          y1={MID - 30}
          x2={X1}
          y2={MID + 30}
          stroke={FAINT}
          strokeWidth="1"
        />
        <Path
          d={`M${X0} ${MID - 30} L${X1} ${MID - 30}`}
          stroke={FAINTER}
          width={0.6}
        />
        <Path
          d={`M${X0} ${MID + 30} L${X1} ${MID + 30}`}
          stroke={FAINTER}
          width={0.6}
        />
        <Path d={d} stroke={BASE} width={1.5} />
        <g
          style={{
            transformBox: "fill-box",
            transformOrigin: "center",
            animation: loop("sig-breathe-x", 3.4, "ease-in-out"),
          }}
        >
          <Path d={d} stroke={BRAND} width={1.6} />
        </g>
      </>
    );
  },

  // 08 · Applied Simplicity — the tangle dissolves into one clean line, and
  // new forms sprout from it.
  8: () => {
    const steps = 140;
    let tangle = "";
    for (let i = 0; i <= steps; i++) {
      const x = X0 + (SPAN * i) / steps;
      const y =
        MID -
        13 * Math.sin((9 * 2 * Math.PI * i) / steps) -
        7 * Math.sin((23 * i) / steps + 2) -
        (((i * 37) % 9) - 4);
      tangle += `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)} `;
    }
    const sprouts: [number, number][] = [
      [0.3, 18],
      [0.5, 26],
      [0.7, 18],
    ];
    return (
      <>
        <Path
          d={tangle}
          stroke="rgb(255 255 255 / 0.34)"
          width={0.9}
          style={{ animation: loop("sig-fade", 4.6, "ease-in-out") }}
        />
        <Path
          d={`M${X0} ${MID + 12} L${X1} ${MID + 12}`}
          stroke={BRAND}
          width={1.8}
          pathLength={100}
          dash="100"
          style={{ animation: loop("sig-draw", 4.6, "ease-in-out") }}
        />
        {sprouts.map(([at, height], i) => {
          const x = X0 + SPAN * at;
          return (
            <g key={i}>
              <line
                x1={x}
                y1={MID + 12}
                x2={x}
                y2={MID + 12 - height}
                stroke={FG}
                strokeWidth="1.1"
                style={{
                  transformBox: "fill-box",
                  transformOrigin: "bottom",
                  animation: loop(
                    "sig-sprout",
                    4.6,
                    "ease-in-out",
                    1.7 + i * 0.3,
                  ),
                }}
              />
              <circle
                cx={x}
                cy={MID + 12 - height}
                r="1.7"
                fill={BRAND}
                style={{
                  animation: loop(
                    "sig-appear",
                    4.6,
                    "ease-in-out",
                    2.1 + i * 0.3,
                  ),
                }}
              />
            </g>
          );
        })}
      </>
    );
  },

  // 09 · Cross-Pollinated Thinking — separate strands merge into one line.
  9: () => {
    const merge = X0 + SPAN * 0.52;
    return (
      <>
        {[-22, 0, 22].map((offset, i) => {
          const d = `M${X0} ${MID + offset} C ${X0 + 62} ${MID + offset} ${merge - 46} ${MID} ${merge} ${MID}`;
          return (
            <g key={i}>
              <Path d={d} stroke={BASE} width={1.2} />
              <Path
                d={d}
                stroke={BRAND}
                width={1.3}
                pathLength={100}
                dash="18 100"
                style={{
                  animation: loop("trace-flow", 3, "linear", -i * 0.45),
                }}
              />
              <circle cx={X0} cy={MID + offset} r="2" fill={FG} />
            </g>
          );
        })}
        <Path d={`M${merge} ${MID} L${X1} ${MID}`} stroke={FG} width={2} />
        <Path
          d={`M${merge} ${MID} L${X1} ${MID}`}
          stroke={BRAND}
          width={2.2}
          pathLength={100}
          dash="26 100"
          style={{ animation: loop("trace-flow", 3, "linear", -1.2) }}
        />
        <circle cx={merge} cy={MID} r="2.8" fill={BRAND} />
      </>
    );
  },

  // 10 · Universal Access — one signal broadcast outward, reaching everyone.
  10: () => {
    const cx = (X0 + X1) / 2;
    return (
      <>
        {[0, 1, 2, 3].map((i) => (
          <circle
            key={i}
            cx={cx}
            cy={MID}
            r="46"
            fill="none"
            stroke={BRAND}
            strokeWidth="1"
            style={{
              transformBox: "fill-box",
              transformOrigin: "center",
              animation: loop("sig-ripple", 3.2, "linear", i * 0.8),
            }}
          />
        ))}
        <Path d={`M${X0} ${MID} L${X1} ${MID}`} stroke={BASE} width={1.2} />
        {Array.from({ length: 9 }, (_, i) => (
          <circle key={i} cx={X0 + (SPAN * i) / 8} cy={MID} r="1.8" fill={FG} />
        ))}
        <circle cx={cx} cy={MID} r="3" fill={BRAND} />
      </>
    );
  },
};
