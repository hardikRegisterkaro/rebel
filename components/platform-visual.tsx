import type { CSSProperties } from "react";

import type { PlatformVisual as Variant } from "@/lib/content";

const NEUTRAL = "#AEB6C6";
const STAR = "#C6CDDA";
const BRAND = "#FF3333";
const DIM = "#54555E";

/**
 * The three ambient card visuals for the intelligence platforms. Each is
 * generated from a small geometry table rather than hand-written markup — the
 * source design shipped ~60KB of literal SVG for the same three frames.
 *
 * Motion is CSS-driven (not SMIL) so it honours prefers-reduced-motion.
 */
export function PlatformVisual({ variant }: { variant: Variant }) {
  return (
    <svg
      viewBox="0 0 440 200"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className="block size-full bg-ink"
    >
      {variant === "memory" && <MemoryRadar />}
      {variant === "adaptive" && <AdaptiveBranches />}
      {variant === "collective" && <CollectiveMesh />}
    </svg>
  );
}

/* ── 01 · Memory & Knowledge — a radar sweeping a field of held traces ───── */

type Orbit = {
  radius: number;
  seconds: number;
  reverse?: boolean;
  /** [angle in degrees, radius, is brand-coloured] */
  dots: [number, number, boolean][];
};

const ORBITS: Orbit[] = [
  {
    radius: 46,
    seconds: 44,
    dots: [
      [20, 2.6, true],
      [150, 1.7, false],
      [-90, 2.6, true],
    ],
  },
  {
    radius: 70,
    seconds: 58,
    reverse: true,
    dots: [
      [40, 1.7, false],
      [110, 2.6, true],
      [-160, 1.7, false],
      [-60, 2.6, true],
    ],
  },
  {
    radius: 94,
    seconds: 74,
    dots: [
      [10, 2.6, true],
      [70, 1.7, false],
      [135, 1.7, false],
      [-165, 2.6, true],
      [-105, 1.7, false],
      [-40, 2.6, true],
    ],
  },
];

function MemoryRadar() {
  const cx = 220;
  const cy = 100;
  const spin = (seconds: number, reverse?: boolean): CSSProperties => ({
    transformOrigin: `${cx}px ${cy}px`,
    animation: `${reverse ? "spin-slow-reverse" : "spin-slow"} ${seconds}s linear infinite`,
  });

  return (
    <>
      <defs>
        <filter id="mem-glow" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="2.4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="mem-sweep" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={BRAND} stopOpacity="0.22" />
          <stop offset="1" stopColor={BRAND} stopOpacity="0" />
        </linearGradient>
      </defs>

      {ORBITS.map((orbit) => (
        <circle
          key={`ring-${orbit.radius}`}
          cx={cx}
          cy={cy}
          r={orbit.radius}
          fill="none"
          stroke={NEUTRAL}
          strokeOpacity="0.1"
        />
      ))}

      {/* Sweep wedge */}
      <path
        d="M 220 100 L 312.3 73.5 A 96 96 0 0 1 312.3 126.5 Z"
        fill="url(#mem-sweep)"
        style={spin(7)}
      />

      {/* Held traces, each ring drifting at its own rate */}
      {ORBITS.map((orbit) => (
        <g key={`orbit-${orbit.radius}`} style={spin(orbit.seconds, orbit.reverse)}>
          {orbit.dots.map(([angle, size, isBrand], index) => {
            const radians = (angle * Math.PI) / 180;
            return (
              <circle
                key={index}
                cx={(cx + orbit.radius * Math.cos(radians)).toFixed(1)}
                cy={(cy + orbit.radius * Math.sin(radians)).toFixed(1)}
                r={size}
                fill={isBrand ? BRAND : STAR}
                opacity={isBrand ? undefined : 0.55}
                filter={isBrand ? "url(#mem-glow)" : undefined}
                style={
                  isBrand
                    ? {
                        animation: `dot-pulse ${(2.6 + index * 0.4).toFixed(1)}s ease-in-out infinite`,
                      }
                    : undefined
                }
              />
            );
          })}
        </g>
      ))}

      {/* Retrieval pings out of the core */}
      {[0, 1.8].map((delay) => (
        <circle
          key={delay}
          cx={cx}
          cy={cy}
          r="8"
          fill="none"
          stroke={BRAND}
          strokeWidth="1"
          style={{
            transformOrigin: `${cx}px ${cy}px`,
            animation: `ring-out 3.6s ease-out ${delay}s infinite`,
          }}
        />
      ))}

      <circle cx={cx} cy={cy} r="3.6" fill={BRAND} filter="url(#mem-glow)" />
    </>
  );
}

/* ── 02 · Adaptive Reasoning — one premise branching to live conclusions ── */

const BRANCHES = [
  { path: "M 80 100 C 180 100, 250 52, 366 52", target: 52 },
  { path: "M 80 100 C 180 100, 250 100, 366 100", target: 100 },
  { path: "M 80 100 C 180 100, 250 150, 366 150", target: 150 },
];

function AdaptiveBranches() {
  return (
    <>
      <defs>
        <filter id="adpt-glow" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="2.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="adpt-halo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FF5544" stopOpacity="0.55" />
          <stop offset="1" stopColor={BRAND} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Reference grid */}
      <g stroke={NEUTRAL} strokeOpacity="0.045">
        {Array.from({ length: 10 }, (_, i) => 40 + i * 40).map((x) => (
          <line key={`v${x}`} x1={x} y1="20" x2={x} y2="180" />
        ))}
        {Array.from({ length: 4 }, (_, i) => 40 + i * 40).map((y) => (
          <line key={`h${y}`} x1="20" y1={y} x2="420" y2={y} />
        ))}
      </g>

      <line x1="-20" y1="100" x2="80" y2="100" stroke="#8A93A8" strokeOpacity="0.2" strokeWidth="1.4" />

      {BRANCHES.map(({ path }, index) => (
        <g key={path}>
          <path d={path} fill="none" stroke="#8A93A8" strokeOpacity="0.2" strokeWidth="1.4" />
          <path
            d={path}
            fill="none"
            stroke={NEUTRAL}
            strokeOpacity="0.22"
            strokeWidth="1"
            pathLength={100}
            strokeDasharray="1.5 7"
            style={{
              animation: `dash-flow 2.2s linear ${(index * -0.4).toFixed(1)}s infinite`,
            }}
          />
          {/* Inference travelling the branch */}
          <circle
            r="4.2"
            fill="#FF7A6B"
            filter="url(#adpt-glow)"
            style={{
              offsetPath: `path("${path}")`,
              offsetRotate: "0deg",
              animation: `travel 6.6s linear ${(index * 2.2).toFixed(1)}s infinite`,
            }}
          />
        </g>
      ))}

      {/* Waypoint ticks */}
      {[
        [217, 76],
        [277.7, 61.2],
        [217, 100],
        [277.7, 100],
        [217, 125],
        [277.7, 140.4],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="1.5" fill={NEUTRAL} />
      ))}

      {/* Source */}
      <circle
        cx="80"
        cy="100"
        r="10"
        fill="none"
        stroke={BRAND}
        strokeWidth="1"
        style={{
          transformOrigin: "80px 100px",
          animation: "ring-out 2.6s ease-out infinite",
        }}
      />
      <circle cx="80" cy="100" r="18" fill="url(#adpt-halo)" style={{ animation: "dot-pulse 2.4s ease-in-out infinite" }} />
      <circle cx="80" cy="100" r="4" fill={BRAND} filter="url(#adpt-glow)" />

      {/* Conclusions, lighting up as each inference lands */}
      {BRANCHES.map(({ target }, index) => (
        <g key={target}>
          <circle
            cx="366"
            cy={target}
            r="16"
            fill="url(#adpt-halo)"
            opacity="0"
            style={{
              animation: `node-arrive 6.6s ease-in-out ${(index * 2.2).toFixed(1)}s infinite`,
            }}
          />
          <circle cx="366" cy={target} r="3.4" fill={DIM} />
        </g>
      ))}
    </>
  );
}

/* ── 03 · Collective Intelligence — a mesh traversed by one shared signal ── */

const MESH_NODES: [number, number, boolean][] = [
  [58, 64, false],
  [150, 46, true],
  [244, 58, false],
  [338, 70, true],
  [96, 128, false],
  [192, 116, true],
  [284, 132, true],
  [372, 110, false],
  [140, 166, true],
  [300, 176, true],
];

const MESH_EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [0, 4], [1, 4], [1, 5], [2, 5], [2, 6],
  [3, 6], [3, 7], [4, 5], [5, 6], [6, 7], [4, 8], [5, 8], [8, 9],
  [6, 9], [9, 7], [0, 8],
];

/** The order the shared signal walks the mesh — every node, once. */
const TRAVERSAL = [0, 1, 2, 3, 7, 6, 5, 4, 8, 9];

const STARS: [number, number][] = [
  [40, 40], [120, 30], [210, 26], [300, 34], [390, 44], [70, 90],
  [400, 150], [30, 150], [180, 185], [350, 185], [260, 90], [150, 95],
];

const HOP_SECONDS = 2.2;

function CollectiveMesh() {
  const totalSeconds = (TRAVERSAL.length - 1) * HOP_SECONDS;

  return (
    <>
      <defs>
        <filter id="col-glow" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="col-halo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FF5544" stopOpacity="0.55" />
          <stop offset="1" stopColor={BRAND} stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="215" cy="105" r="60" fill="url(#col-halo)" opacity="0.12" />

      {STARS.map(([x, y], index) => (
        <circle
          key={`star-${x}-${y}`}
          cx={x}
          cy={y}
          r="1.2"
          fill={STAR}
          opacity="0.18"
          style={{
            animation: `star-twinkle ${(4 + (index % 5) * 0.4).toFixed(1)}s ease-in-out infinite`,
          }}
        />
      ))}

      {/* Latent structure */}
      {MESH_EDGES.map(([a, b]) => (
        <line
          key={`e-${a}-${b}`}
          x1={MESH_NODES[a][0]}
          y1={MESH_NODES[a][1]}
          x2={MESH_NODES[b][0]}
          y2={MESH_NODES[b][1]}
          stroke={NEUTRAL}
          strokeOpacity="0.12"
        />
      ))}

      {/* The contribution walking the network, hop by hop */}
      {TRAVERSAL.slice(0, -1).map((from, index) => {
        const to = TRAVERSAL[index + 1];
        const [x1, y1] = MESH_NODES[from];
        const [x2, y2] = MESH_NODES[to];
        const path = `M${x1} ${y1} L${x2} ${y2}`;
        const delay = (index * HOP_SECONDS).toFixed(1);
        return (
          <g key={`hop-${from}-${to}`}>
            <path
              d={path}
              fill="none"
              stroke={BRAND}
              strokeWidth="1.4"
              pathLength={100}
              strokeDasharray="100"
              style={{
                animation: `sig-draw ${totalSeconds}s linear ${delay}s infinite`,
              }}
            />
            <circle
              r="5.5"
              fill={BRAND}
              filter="url(#col-glow)"
              style={{
                offsetPath: `path("${path}")`,
                offsetRotate: "0deg",
                animation: `travel ${totalSeconds}s linear ${delay}s infinite`,
              }}
            />
          </g>
        );
      })}

      {/* Nodes — brand nodes flare as the signal reaches them */}
      {MESH_NODES.map(([x, y, isBrand], index) => {
        const arrival = TRAVERSAL.indexOf(index);
        return (
          <g key={`n-${x}-${y}`}>
            <circle
              cx={x}
              cy={y}
              r="15"
              fill="url(#col-halo)"
              opacity="0"
              style={{
                animation: `node-arrive ${totalSeconds}s ease-in-out ${(arrival * HOP_SECONDS).toFixed(1)}s infinite`,
              }}
            />
            <circle
              cx={x}
              cy={y}
              r={isBrand ? 3.2 : 2.2}
              fill={isBrand ? BRAND : STAR}
              filter={isBrand ? "url(#col-glow)" : undefined}
            />
          </g>
        );
      })}
    </>
  );
}
