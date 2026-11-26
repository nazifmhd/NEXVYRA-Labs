"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { CoreFallback } from "./CoreFallback";

/**
 * The Intelligence Core (blueprint §7.1).
 *
 * A dependency-free canvas renderer: a frosted-glass icosahedron with
 * connected nodes, an inner glow, orbiting satellites, signal pulses along
 * edges and a sparse particle field. Guardrails:
 *  - static SVG paints first; canvas fades in once it has drawn
 *  - pauses offscreen and when the tab is hidden
 *  - prefers-reduced-motion → single still frame
 *  - pointer parallax only for fine pointers
 *  - DPR and particle count capped (lower on small screens)
 */

type V3 = [number, number, number];

const PHI = (1 + Math.sqrt(5)) / 2;

function buildIcosahedron() {
  const raw: V3[] = [];
  for (const a of [-1, 1]) {
    for (const b of [-PHI, PHI]) {
      raw.push([0, a, b], [a, b, 0], [b, 0, a]);
    }
  }
  const len = Math.hypot(1, PHI);
  const verts = raw.map(([x, y, z]) => [x / len, y / len, z / len] as V3);

  const dist = (p: V3, q: V3) => Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
  let min = Infinity;
  for (let i = 0; i < verts.length; i++)
    for (let j = i + 1; j < verts.length; j++) min = Math.min(min, dist(verts[i], verts[j]));

  const isEdge = (i: number, j: number) => Math.abs(dist(verts[i], verts[j]) - min) < 1e-3;
  const edges: [number, number][] = [];
  for (let i = 0; i < verts.length; i++)
    for (let j = i + 1; j < verts.length; j++) if (isEdge(i, j)) edges.push([i, j]);

  const faces: [number, number, number][] = [];
  for (let i = 0; i < verts.length; i++)
    for (let j = i + 1; j < verts.length; j++)
      for (let k = j + 1; k < verts.length; k++)
        if (isEdge(i, j) && isEdge(j, k) && isEdge(i, k)) faces.push([i, j, k]);

  return { verts, edges, faces };
}

function rotate([x, y, z]: V3, rx: number, ry: number): V3 {
  // Y-axis
  const cy = Math.cos(ry), sy = Math.sin(ry);
  const x1 = x * cy + z * sy;
  const z1 = -x * sy + z * cy;
  // X-axis
  const cx = Math.cos(rx), sx = Math.sin(rx);
  const y2 = y * cx - z1 * sx;
  const z2 = y * sx + z1 * cx;
  return [x1, y2, z2];
}

export function IntelligenceCore({ className, readout = true }: { className?: string; readout?: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotRef = useRef<HTMLSpanElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return; // fallback SVG remains

    const { verts, edges, faces } = buildIcosahedron();
    const small = window.matchMedia("(max-width: 640px)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = reduceMq.matches;

    // Deterministic pseudo-random so the composition is stable between loads.
    let seed = 7;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

    const particles = Array.from({ length: small ? 18 : 42 }, () => {
      const u = rand() * 2 - 1;
      const th = rand() * Math.PI * 2;
      const r = 1.55 + rand() * 1.0;
      const s = Math.sqrt(1 - u * u);
      return { p: [r * s * Math.cos(th), r * u * 0.8, r * s * Math.sin(th)] as V3, size: 0.6 + rand() * 1.1, phase: rand() * 6.28 };
    });

    // Start positions for the entrance: nodes drift in from a loose cloud and connect.
    const scatter = verts.map(() => {
      const u = rand() * 2 - 1;
      const th = rand() * Math.PI * 2;
      const r = 1.9 + rand() * 1.1;
      const sq = Math.sqrt(1 - u * u);
      return [r * sq * Math.cos(th), r * u, r * sq * Math.sin(th)] as V3;
    });
    let t0 = -1;
    let shown = false;

    const rings = [
      { r: 1.42, tilt: -0.32, roll: 0.28, speed: 0.00022, phase: 0.4 },
      { r: 1.26, tilt: 0.42, roll: -0.36, speed: -0.00017, phase: 2.6 },
    ];

    const pulses: { edge: number; start: number; dur: number }[] = [];
    let nextPulse = 0;

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    let raf = 0;
    let running = false;
    let visible = true;
    let lastReadout = 0;
    let w = 0, h = 0, dpr = 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t: number, full = false) => {
      ctx.clearRect(0, 0, w, h);
      let a = 1; // assembly progress 0..1
      if (!full && !reduced && t0 >= 0) {
        const k = Math.min(1, Math.max(0, (t - t0) / 2200));
        a = 1 - Math.pow(1 - k, 3);
      }
      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w, h) * 0.3;
      const F = 3.4; // camera distance

      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;

      const ry = t * 0.00013 + pointer.x * 0.35 + (1 - a) * 1.8;
      const rx = 0.38 + Math.sin(t * 0.00021) * 0.1 + pointer.y * 0.22;
      const floatY = Math.sin(t * 0.0007) * R * 0.035;

      const project = (v: V3) => {
        const s = F / (F - v[2]);
        return { x: cx + v[0] * R * s, y: cy + floatY + v[1] * R * s, s, z: v[2] };
      };

      // Halo
      const halo = ctx.createRadialGradient(cx, cy + floatY, R * 0.1, cx, cy + floatY, R * 2.1);
      halo.addColorStop(0, "rgba(54,140,235,0.30)");
      halo.addColorStop(0.45, "rgba(168,216,255,0.16)");
      halo.addColorStop(1, "rgba(217,238,255,0)");
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, w, h);

      // Particles (behind + in front, depth-faded)
      const drawParticles = (front: boolean) => {
        for (const pt of particles) {
          const v = rotate(pt.p, rx * 0.6, ry * 0.5);
          if (front !== v[2] > 0) continue;
          const p = project(v);
          const tw = 0.55 + 0.45 * Math.sin(t * 0.0012 + pt.phase);
          ctx.fillStyle = `rgba(23,105,170,${(0.12 + (v[2] + 2.5) * 0.08) * tw})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, pt.size * p.s, 0, Math.PI * 2);
          ctx.fill();
        }
      };
      drawParticles(false);

      // Orbit rings
      const ringPoint = (ring: (typeof rings)[number], a: number): V3 => {
        let v: V3 = [Math.cos(a) * ring.r, 0, Math.sin(a) * ring.r];
        // tilt around X, roll around Z
        const ct = Math.cos(ring.tilt), st = Math.sin(ring.tilt);
        v = [v[0], v[1] * ct - v[2] * st, v[1] * st + v[2] * ct];
        const cr = Math.cos(ring.roll), sr = Math.sin(ring.roll);
        v = [v[0] * cr - v[1] * sr, v[0] * sr + v[1] * cr, v[2]];
        return rotate(v, rx * 0.5, 0);
      };
      const satellites: { x: number; y: number; z: number; s: number }[] = [];
      for (const ring of rings) {
        ctx.beginPath();
        for (let i = 0; i <= 72; i++) {
          const p = project(ringPoint(ring, (i / 72) * Math.PI * 2));
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = "rgba(23,105,170,0.16)";
        ctx.lineWidth = 1;
        ctx.stroke();
        const p = project(ringPoint(ring, ring.phase + t * ring.speed));
        satellites.push(p);
      }
      const drawSatellites = (front: boolean) => {
        for (const p of satellites) {
          if (front !== p.z > 0) continue;
          ctx.fillStyle = front ? "#368CEB" : "rgba(54,140,235,0.45)";
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3.2 * p.s, 0, Math.PI * 2);
          ctx.fill();
          if (front) {
            ctx.strokeStyle = "rgba(54,140,235,0.25)";
            ctx.beginPath();
            ctx.arc(p.x, p.y, 7 * p.s, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      };
      drawSatellites(false);

      // Geometry
      const rv = verts.map((v, i) => {
        if (a >= 1) return rotate(v, rx, ry);
        const s0 = scatter[i];
        const m: V3 = [s0[0] + (v[0] - s0[0]) * a, s0[1] + (v[1] - s0[1]) * a, s0[2] + (v[2] - s0[2]) * a];
        return rotate(m, rx, ry);
      });
      const pv = rv.map(project);

      // Inner core glow (seen through the glass)
      const pulse = reduced ? 0.5 : 0.5 + 0.5 * Math.sin(t * 0.0016);
      const core = ctx.createRadialGradient(cx, cy + floatY, 0, cx, cy + floatY, R * 0.62);
      core.addColorStop(0, `rgba(255,255,255,${0.95})`);
      core.addColorStop(0.18, `rgba(168,216,255,${0.75 + pulse * 0.2})`);
      core.addColorStop(0.55, `rgba(54,140,235,${0.22 + pulse * 0.1})`);
      core.addColorStop(1, "rgba(54,140,235,0)");
      ctx.globalAlpha = a;
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx, cy + floatY, R * 0.62 * (0.35 + 0.65 * a), 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = a * a; // glass facets solidify last

      // Faces sorted back-to-front; light from upper-left-front.
      const L: V3 = [-0.45, -0.6, 0.66];
      const sorted = faces
        .map((f) => {
          const [a, b, c] = f.map((i) => rv[i]) as [V3, V3, V3];
          const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
          const vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
          let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
          const cxm = (a[0] + b[0] + c[0]) / 3, cym = (a[1] + b[1] + c[1]) / 3, czm = (a[2] + b[2] + c[2]) / 3;
          if (nx * cxm + ny * cym + nz * czm < 0) { nx = -nx; ny = -ny; nz = -nz; } // outward
          const nl = Math.hypot(nx, ny, nz);
          nx /= nl; ny /= nl; nz /= nl;
          const light = Math.max(0, nx * L[0] + ny * L[1] + nz * L[2]);
          return { f, z: czm, facing: nz, light };
        })
        .sort((p, q) => p.z - q.z);

      for (const { f, facing, light } of sorted) {
        const [a, b, c] = f.map((i) => pv[i]);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.lineTo(c.x, c.y);
        ctx.closePath();
        if (facing > 0) {
          const g = ctx.createLinearGradient(a.x, a.y, c.x, c.y);
          g.addColorStop(0, `rgba(255,255,255,${0.16 + light * 0.42})`);
          g.addColorStop(1, `rgba(168,216,255,${0.1 + light * 0.22})`);
          ctx.fillStyle = g;
        } else {
          ctx.fillStyle = "rgba(54,140,235,0.05)";
        }
        ctx.fill();
      }

      // Edges
      ctx.globalAlpha = 0.25 + 0.75 * a;
      edges.forEach(([i, j]) => {
        const a = pv[i], b = pv[j];
        const depth = (rv[i][2] + rv[j][2]) / 2; // -1..1
        ctx.strokeStyle = `rgba(23,105,170,${0.14 + (depth + 1) * 0.24})`;
        ctx.lineWidth = depth > 0 ? 1.25 : 0.8;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      });

      ctx.globalAlpha = 1;

      // Signal pulses along edges (once assembled)
      if (!reduced && a >= 1 && t > nextPulse) {
        pulses.push({ edge: Math.floor(rand() * edges.length), start: t, dur: 1100 + rand() * 500 });
        nextPulse = t + 650 + rand() * 900;
      }
      for (let k = pulses.length - 1; k >= 0; k--) {
        const pl = pulses[k];
        const u = (t - pl.start) / pl.dur;
        if (u >= 1) { pulses.splice(k, 1); continue; }
        const [i, j] = edges[pl.edge];
        const e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
        const x = pv[i].x + (pv[j].x - pv[i].x) * e;
        const y = pv[i].y + (pv[j].y - pv[i].y) * e;
        const fade = Math.sin(u * Math.PI);
        const g = ctx.createRadialGradient(x, y, 0, x, y, 10);
        g.addColorStop(0, `rgba(54,140,235,${0.9 * fade})`);
        g.addColorStop(1, "rgba(54,140,235,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fill();
      }

      // Nodes
      pv.forEach((p, i) => {
        const front = rv[i][2] > -0.1;
        ctx.fillStyle = front ? "#102B46" : "rgba(16,43,70,0.35)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, (front ? 3 : 2.2) * p.s, 0, Math.PI * 2);
        ctx.fill();
        if (front) {
          ctx.fillStyle = "#FFFFFF";
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.1 * p.s, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      drawSatellites(true);
      drawParticles(true);

      if (readout && rotRef.current && t - lastReadout > 200) {
        lastReadout = t;
        const deg = (((ry * 180) / Math.PI) % 360 + 360) % 360;
        rotRef.current.textContent = deg.toFixed(1).padStart(5, "0");
      }
    };

    const loop = (t: number) => {
      if (t0 < 0) t0 = t;
      draw(t);
      if (!shown) {
        shown = true;
        setReady(true);
      }
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || reduced || !visible || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const still = () => draw(4200, true);

    resize();
    if (reduced) {
      still();
      setReady(true);
    } else {
      start(); // first animated frame reveals the canvas and begins the assembly
    }

    const ro = new ResizeObserver(() => {
      resize();
      if (!running) still();
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(wrap);

    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);

    const onReduce = (e: MediaQueryListEvent) => {
      reduced = e.matches;
      if (reduced) {
        stop();
        still();
        setReady(true);
      } else start();
    };
    reduceMq.addEventListener("change", onReduce);

    const onMove = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    if (finePointer) window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      reduceMq.removeEventListener("change", onReduce);
      window.removeEventListener("pointermove", onMove);
    };
  }, [readout]);

  return (
    <div ref={wrapRef} className={cn("relative aspect-square w-full", className)} aria-hidden="true">
      <CoreFallback
        className={cn("absolute inset-0 transition-opacity duration-700", ready ? "opacity-0" : "opacity-100")}
      />
      <canvas
        ref={canvasRef}
        className={cn("absolute inset-0 h-full w-full transition-opacity duration-700", ready ? "opacity-100" : "opacity-0")}
      />
      {readout && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-between font-mono text-[0.68rem] tracking-[0.12em] text-muted uppercase">
          <span>
            ROT.Y <span ref={rotRef} className="text-navy tabular-nums">000.0</span>°
          </span>
          <span className="hidden xs:inline">V 12 · E 30 · F 20</span>
        </div>
      )}
    </div>
  );
}
