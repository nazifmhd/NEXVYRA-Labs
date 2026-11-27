import type { Project } from "@/content/projects";
import { CoreFallback } from "@/components/visuals/CoreFallback";

/**
 * Card visual for a case study without screenshots: a miniature schematic of
 * the project's real architecture diagram. Decorative (the case study page has
 * the interactive, accessible version).
 */
export function ProjectVisual({ project }: { project: Project }) {
  const d = project.architecture.diagram;
  const W = 1000;
  const H = 560;
  const BW = 192;
  const BH = 64;

  return (
    <div className="relative h-full w-full overflow-hidden bg-navy-950" aria-hidden="true">
      <div className="bp-grid-dark absolute inset-0 opacity-80" />
      <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-[radial-gradient(closest-side,rgb(54_140_235/0.35),transparent)]" />
      {d ? (
        <svg viewBox={`-30 -20 ${W + 60} ${H + 40}`} className="absolute inset-x-6 top-14 bottom-6 h-[calc(100%-5rem)] w-[calc(100%-3rem)]" preserveAspectRatio="xMidYMid meet">
          {d.edges.map(([a, b]) => {
            const A = d.nodes.find((n) => n.id === a);
            const B = d.nodes.find((n) => n.id === b);
            if (!A || !B) return null;
            return (
              <g key={`${a}-${b}`}>
                <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="rgb(168 216 255 / 0.28)" strokeWidth={2} />
                <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} pathLength={100} className="trace-pulse" stroke="#368CEB" strokeWidth={3} strokeLinecap="round" />
              </g>
            );
          })}
          {d.nodes.map((n) => {
            const core = n.tone === "core";
            const human = n.tone === "human";
            return (
              <g key={n.id} transform={`translate(${n.x - BW / 2} ${n.y - BH / 2})`}>
                <rect
                  width={BW}
                  height={BH}
                  rx={12}
                  fill={core ? "#1769AA" : "rgb(16 43 70 / 0.92)"}
                  stroke={core ? "#A8D8FF" : "rgb(168 216 255 / 0.35)"}
                  strokeWidth={1.5}
                  strokeDasharray={human ? "6 5" : undefined}
                />
                <text x={14} y={28} fill="#FFFFFF" style={{ fontFamily: "var(--font-space), sans-serif", fontSize: 20, fontWeight: 500 }}>
                  {n.label.length > 18 ? `${n.label.slice(0, 17)}…` : n.label}
                </text>
                <text x={14} y={50} fill="rgb(168 216 255 / 0.7)" style={{ fontFamily: "var(--font-jb), monospace", fontSize: 13, letterSpacing: 1 }}>
                  {n.sub.toUpperCase().slice(0, 20)}
                </text>
              </g>
            );
          })}
        </svg>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1/2 opacity-80">
            <CoreFallback />
          </div>
        </div>
      )}
      <div className="absolute top-4 left-5 font-mono text-[0.66rem] tracking-[0.14em] text-sky/70 uppercase">
        {project.code} · Architecture
      </div>
    </div>
  );
}
