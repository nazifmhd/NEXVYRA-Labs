import type { CSSProperties } from "react";

/**
 * Orthogonal "circuit traces" with data pulses running along them, used as a
 * background for dark emphasis sections. Original geometry; decorative only.
 */
const traces = [
  { d: "M-20 90 H240 L290 140 H560 L600 100 H820", dur: 8, delay: 0 },
  { d: "M1220 60 H980 L940 100 H760 L720 60 H620", dur: 9, delay: 2.5 },
  { d: "M-20 330 H160 L210 280 H420 L470 330 H700", dur: 10, delay: 1.2 },
  { d: "M1220 300 H1060 L1010 350 H860 L820 310 H740", dur: 7.5, delay: 3.8 },
  { d: "M120 620 V520 L170 470 H380 L430 420 V380", dur: 8.5, delay: 5 },
  { d: "M1080 620 V540 L1030 490 H900 L860 450 V410", dur: 9.5, delay: 0.8 },
  { d: "M-20 470 H60 L100 510 H260", dur: 6.5, delay: 4.2 },
];

const nodes: [number, number][] = [
  [820, 100], [620, 60], [700, 330], [740, 310], [430, 380], [860, 410], [260, 510],
  [290, 140], [600, 100], [210, 280], [470, 330], [1010, 350], [170, 470],
];

export function CircuitTraces({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true" focusable="false">
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {traces.map((t) => (
          <path key={t.d} d={t.d} stroke="rgb(168 216 255 / 0.12)" strokeWidth="1.2" />
        ))}
        {traces.map((t) => (
          <path
            key={`p-${t.d}`}
            d={t.d}
            pathLength={100}
            className="trace-pulse"
            stroke="url(#trace-grad)"
            strokeWidth="2"
            style={{ "--dur": `${t.dur}s`, "--delay": `${t.delay}s` } as CSSProperties}
          />
        ))}
      </g>
      <g fill="rgb(168 216 255 / 0.35)">
        {nodes.map(([x, y]) => (
          <rect key={`${x}-${y}`} x={x - 3} y={y - 3} width="6" height="6" rx="1" />
        ))}
      </g>
      <defs>
        <linearGradient id="trace-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#368CEB" />
          <stop offset="100%" stopColor="#A8D8FF" />
        </linearGradient>
      </defs>
    </svg>
  );
}
