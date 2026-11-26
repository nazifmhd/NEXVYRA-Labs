"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/motion";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionLabel";
import { CheckIcon } from "@/components/ui/Icons";

/**
 * "Quality gates": the release standard every system passes, shown as a
 * pipeline that runs while in view. Shows discipline instead of a tool list.
 */
const gates = [
  { code: "G1", title: "Code review", body: "Every change is reviewed by another engineer before it merges.", log: "review: approved by a second engineer" },
  { code: "G2", title: "Automated tests", body: "Unit, integration and end-to-end tests run on every change.", log: "tests: unit · integration · end-to-end passed" },
  { code: "G3", title: "AI evaluation", body: "AI behaviour is measured against an evaluation set before release.", log: "eval: evaluation set passed · no critical failures" },
  { code: "G4", title: "Security checks", body: "Dependencies audited, secrets scanned, access reviewed.", log: "security: dependency audit · secret scan clean" },
  { code: "G5", title: "Accessibility & performance", body: "Checked against agreed accessibility and performance budgets.", log: "quality: accessibility scan · performance budget met" },
  { code: "G6", title: "Docs & handover", body: "Release notes and runbooks updated with every release.", log: "docs: release notes · runbook updated" },
];

const STEP_MS = 900;
const HOLD_MS = 3200;

export function QualityGates({ index }: { index?: string }) {
  // -1 = idle, 0..5 = gate running, 6 = all passed
  const [stage, setStage] = useState(gates.length);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return; // static: every gate shown as passed
    let timer = 0;
    let visible = false;
    let current = -1;

    const tick = () => {
      if (!visible) return;
      current = current >= gates.length ? -1 : current + 1;
      setStage(current);
      timer = window.setTimeout(tick, current >= gates.length ? HOLD_MS : current < 0 ? 500 : STEP_MS);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      window.clearTimeout(timer);
      if (visible) {
        current = -1;
        setStage(-1);
        timer = window.setTimeout(tick, 400);
      } else {
        setStage(gates.length);
      }
    }, { threshold: 0.35 });
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  const passed = (i: number) => stage > i;
  const running = (i: number) => stage === i;
  const done = stage >= gates.length;
  const progress = Math.max(0, Math.min(1, stage / gates.length));

  return (
    <section className="relative overflow-hidden bg-white py-24 sm:py-32" aria-labelledby="gates-title">
      <Container>
        <SectionHeader
          index={index}
          label="Quality gates"
          title={<span id="gates-title">Every release earns its way to production.</span>}
          intro="Tools change from project to project. The standard doesn’t. Nothing we build reaches your users without passing these gates."
        />

        <div ref={ref} className="mt-16 grid gap-6 lg:grid-cols-12">
          {/* Pipeline */}
          <ol className="relative lg:col-span-7" aria-label="Release gates">
            <span className="absolute top-3 bottom-3 left-[1.0625rem] w-px bg-line" aria-hidden="true">
              <span
                className="block w-full origin-top bg-gradient-to-b from-action via-accent to-emerald-400 transition-transform duration-700 ease-[var(--ease-expo)]"
                style={{ height: "100%", transform: `scaleY(${progress})` }}
              />
            </span>
            {gates.map((g, i) => (
              <li key={g.code} className="relative flex gap-5 pb-7 last:pb-0">
                <span
                  className={cn(
                    "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border font-mono text-[0.68rem] transition-[background-color,border-color,color,box-shadow] duration-500",
                    passed(i)
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : running(i)
                        ? "border-accent bg-white text-action shadow-[0_0_0_6px_rgb(54_140_235/0.15)]"
                        : "border-line bg-white text-muted",
                  )}
                  aria-hidden="true"
                >
                  {passed(i) ? <CheckIcon size={15} strokeWidth={2.5} /> : g.code}
                  {running(i) && <span className="absolute inset-0 animate-ping rounded-full border border-accent/50" />}
                </span>
                <div
                  className={cn(
                    "flex-1 rounded-2xl border px-5 py-4 transition-[border-color,background-color] duration-500",
                    running(i) ? "border-accent/50 bg-mist" : "border-line bg-white",
                  )}
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-display text-[1.15rem] font-medium text-navy">{g.title}</h3>
                    <span
                      className={cn(
                        "shrink-0 font-mono text-[0.66rem] tracking-[0.12em] uppercase",
                        passed(i) ? "text-emerald-700" : running(i) ? "text-action" : "text-muted",
                      )}
                    >
                      {passed(i) ? "Passed" : running(i) ? "Running…" : "Queued"}
                    </span>
                  </div>
                  <p className="mt-1 text-[0.95rem] leading-relaxed text-muted">{g.body}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* Console */}
          <div className="lg:col-span-5" aria-hidden="true">
            <div className="sticky top-28 overflow-hidden rounded-[1.5rem] bg-navy-950 text-white shadow-[0_40px_80px_-40px_rgb(16_43_70/0.7)]">
              <div className="bp-grid-dark pointer-events-none absolute inset-0 opacity-70" />
              <div className="relative flex items-center justify-between border-b border-white/10 px-5 py-3.5 font-mono text-[0.66rem] tracking-[0.12em] text-sky/70 uppercase">
                <span className="flex items-center gap-2">
                  <span className={cn("h-1.5 w-1.5 rounded-full", done ? "bg-emerald-400" : "pulse-dot bg-accent")} />
                  Release pipeline
                </span>
                <span>{done ? "complete" : stage < 0 ? "starting" : `gate ${stage + 1}/6`}</span>
              </div>
              <div className="relative min-h-[19rem] space-y-2.5 px-5 py-5 font-mono text-[0.8rem] leading-relaxed">
                <p className="text-sky/50">$ release --to production</p>
                {gates.map((g, i) =>
                  passed(i) ? (
                    <p key={g.code} className="animate-rise text-sky/85">
                      <span className="text-emerald-400">✓</span> {g.log}
                    </p>
                  ) : running(i) ? (
                    <p key={g.code} className="text-sky/60">
                      <span className="inline-block animate-pulse text-accent">●</span> {g.log.split(":")[0]}: running…
                    </p>
                  ) : null,
                )}
                {done && (
                  <p className="animate-rise pt-2 text-[0.9rem] text-white">
                    <span className="mr-2 rounded bg-emerald-400/15 px-2 py-0.5 text-emerald-300">READY</span>
                    All gates passed — ready to ship.
                  </p>
                )}
              </div>
              <div className="relative h-1 bg-white/5">
                <span className="block h-full origin-left bg-gradient-to-r from-accent to-emerald-400 transition-transform duration-700" style={{ transform: `scaleX(${progress})` }} />
              </div>
            </div>
            <p className="mt-5 text-[0.9rem] leading-relaxed text-muted">
              This website ships the same way: automated tests, accessibility scans and an evaluation of its AI assistant run before every release.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
