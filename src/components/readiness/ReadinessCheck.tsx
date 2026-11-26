"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { dimensions, questions, score } from "@/content/readiness";
import { services } from "@/content/services";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { Button, ButtonLink } from "@/components/ui/Button";
import { CheckIcon } from "@/components/ui/Icons";

/** Circular readiness gauge — the score "charges" the core when results appear. */
function Gauge({ value }: { value: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(value));
    return () => cancelAnimationFrame(id);
  }, [value]);
  return (
    <div className="relative h-44 w-44 shrink-0" role="img" aria-label={`Readiness score ${value} out of 100`}>
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <defs>
          <linearGradient id="rd-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1769AA" />
            <stop offset="100%" stopColor="#A8D8FF" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgb(168 216 255 / 0.15)" strokeWidth="8" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="url(#rd-g)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - shown / 100)}
          className="transition-[stroke-dashoffset] duration-[1600ms] ease-[var(--ease-expo)]"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-[2.8rem] leading-none font-medium tabular-nums">{value}</span>
        <span className="mt-1 font-mono text-[0.62rem] tracking-[0.14em] text-sky/60 uppercase">of 100</span>
      </div>
    </div>
  );
}

export function ReadinessCheck() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [step, setStep] = useState(0); // 0..questions.length (results)
  const [copied, setCopied] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);
  const advanceTimer = useRef<number | undefined>(undefined);

  const done = step >= questions.length;
  const q = questions[Math.min(step, questions.length - 1)];
  const result = done ? score(answers) : null;

  useEffect(() => {
    if (moved.current) headingRef.current?.focus();
  }, [step]);
  useEffect(() => () => window.clearTimeout(advanceTimer.current), []);
  useEffect(() => {
    if (done && result) track("primary_cta_click", { location: "readiness_result", level: result.level.name });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const go = (n: number) => {
    moved.current = true;
    window.clearTimeout(advanceTimer.current);
    setStep(n);
  };

  const choose = (value: number) => {
    setAnswers((a) => ({ ...a, [q.id]: value }));
    window.clearTimeout(advanceTimer.current);
    advanceTimer.current = window.setTimeout(() => go(step + 1), 420);
  };

  const restart = () => {
    setAnswers({});
    setCopied(false);
    go(0);
  };

  const summary = result
    ? `AI readiness check: ${result.level.name} (${result.total}/100). ` +
      result.dims.map((d) => `${dimensions[d.key].label} ${d.pct}%`).join(", ") +
      `. Suggested first step: ${result.level.step}.`
    : "";

  const recommended = result
    ? Array.from(new Set([dimensions[result.weakest.key].service, ...(result.total >= 61 ? (["ai-engineering", "intelligent-automation"] as const) : (["digital-innovation", "ai-engineering"] as const))])).slice(0, 3)
    : [];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const contactHref = result
    ? `/contact?type=consultation&services=${recommended.join(",")}&brief=${encodeURIComponent(`${summary}\n\nI'd like to discuss what this means for us.`)}`
    : "/contact";

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-navy-950 text-white shadow-[0_50px_100px_-50px_rgb(10_28_47/0.9)]">
      <div className="bp-grid-dark pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
      <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[radial-gradient(closest-side,rgb(54_140_235/0.3),transparent)]" aria-hidden="true" />

      {/* Progress rail */}
      <div className="relative flex items-center justify-between gap-6 border-b border-white/10 px-6 py-4 sm:px-10">
        <p className="font-mono text-[0.68rem] tracking-[0.14em] text-sky/70 uppercase">
          {done ? "Assessment complete" : `Question ${String(step + 1).padStart(2, "0")} / ${String(questions.length).padStart(2, "0")} · ${dimensions[q.dimension].label}`}
        </p>
        <div className="hidden flex-1 gap-1 sm:flex" aria-hidden="true">
          {questions.map((x, n) => (
            <span key={x.id} className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
              <span
                className="block h-full origin-left bg-gradient-to-r from-accent to-sky transition-transform duration-500"
                style={{ transform: `scaleX(${n < step || done ? 1 : 0})` }}
              />
            </span>
          ))}
        </div>
      </div>

      <div className="relative px-6 py-10 sm:px-10 sm:py-12">
        {!done ? (
          <fieldset key={q.id} className="animate-rise" aria-labelledby={`rq-${q.id}`} aria-describedby={`rq-${q.id}-help`}>
            <h2 id={`rq-${q.id}`} ref={headingRef} tabIndex={-1} className="max-w-2xl font-display text-[clamp(1.6rem,3vw,2.3rem)] leading-tight font-medium outline-none">
              {q.text}
            </h2>
            <p id={`rq-${q.id}-help`} className="mt-3 text-[1rem] text-sky/65">{q.help}</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {q.options.map((label, value) => {
                const selected = answers[q.id] === value;
                return (
                  <label
                    key={label}
                    className={cn(
                      "group relative flex min-h-16 cursor-pointer items-center gap-4 rounded-2xl border px-5 py-4 transition-[border-color,background-color,transform] duration-300 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-accent/40",
                      selected ? "border-accent bg-accent/15" : "border-white/12 bg-white/[0.04] hover:-translate-y-0.5 hover:border-white/30",
                    )}
                    style={{ animationDelay: `${value * 60}ms` } as CSSProperties}
                  >
                    <input type="radio" name={q.id} value={value} checked={selected} onChange={() => choose(value)} className="sr-only" />
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border font-mono text-[0.72rem] transition-colors",
                        selected ? "border-accent bg-accent text-white" : "border-white/20 text-sky/70 group-hover:border-white/40",
                      )}
                      aria-hidden="true"
                    >
                      {selected ? <CheckIcon size={13} strokeWidth={2.5} /> : String.fromCharCode(65 + value)}
                    </span>
                    <span className="text-[0.98rem] leading-snug">{label}</span>
                    {/* Level meter: shows where each answer sits, 1–4 bars */}
                    <span className="ml-auto flex items-end gap-0.5" aria-hidden="true">
                      {[0, 1, 2, 3].map((b) => (
                        <span key={b} className={cn("w-1 rounded-sm", b <= value ? "bg-sky/60" : "bg-white/10")} style={{ height: `${6 + b * 3}px` }} />
                      ))}
                    </span>
                  </label>
                );
              })}
            </div>
            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={() => go(step - 1)}
                disabled={step === 0}
                className="rounded-full px-3 py-2 text-[0.92rem] text-sky/80 hover:text-white disabled:invisible"
              >
                ← Back
              </button>
              {answers[q.id] !== undefined && (
                <Button type="button" variant="inverse" arrow onClick={() => go(step + 1)}>
                  {step === questions.length - 1 ? "See my results" : "Next"}
                </Button>
              )}
            </div>
          </fieldset>
        ) : (
          result && (
            <div className="animate-rise">
              <div className="flex flex-col gap-8 md:flex-row md:items-center">
                <Gauge value={result.total} />
                <div>
                  <p className="font-mono text-[0.7rem] tracking-[0.14em] text-accent uppercase">Your readiness level</p>
                  <h2 ref={headingRef} tabIndex={-1} className="mt-2 font-display text-[clamp(2.2rem,5vw,3.4rem)] leading-none font-medium outline-none">
                    {result.level.name}
                  </h2>
                  <p className="mt-4 max-w-xl text-[1.04rem] leading-relaxed text-sky/80">{result.level.summary}</p>
                </div>
              </div>

              <div className="mt-10 grid gap-8 lg:grid-cols-2">
                <div>
                  <h3 className="font-mono text-[0.7rem] tracking-[0.14em] text-sky/60 uppercase">By dimension</h3>
                  <ul className="mt-4 space-y-4">
                    {result.dims.map((d, n) => (
                      <li key={d.key}>
                        <div className="flex justify-between text-[0.95rem]">
                          <span>{dimensions[d.key].label}</span>
                          <span className="font-mono text-sky tabular-nums">{d.pct}%</span>
                        </div>
                        <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-white/10">
                          <span
                            className="block h-full origin-left rounded-full bg-gradient-to-r from-accent to-sky"
                            style={{ transform: `scaleX(${d.pct / 100})`, animation: `rd-bar 1.2s cubic-bezier(.16,1,.3,1) ${300 + n * 120}ms both` } as CSSProperties}
                          />
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.06] p-5">
                    <p className="font-mono text-[0.66rem] tracking-[0.14em] text-emerald-200 uppercase">Strongest · {dimensions[result.strongest.key].label}</p>
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-sky/85">{dimensions[result.strongest.key].strength}</p>
                  </div>
                  <div className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.06] p-5">
                    <p className="font-mono text-[0.66rem] tracking-[0.14em] text-amber-200 uppercase">Focus first · {dimensions[result.weakest.key].label}</p>
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-sky/85">{dimensions[result.weakest.key].gap}</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-7">
                <p className="font-mono text-[0.7rem] tracking-[0.14em] text-accent uppercase">Suggested first step</p>
                <h3 className="mt-2 font-display text-[1.5rem] font-medium">{result.level.step}</h3>
                <p className="mt-2 max-w-2xl text-[0.98rem] leading-relaxed text-sky/80">{result.level.stepDetail}</p>
                <ul className="mt-5 flex flex-wrap gap-2" aria-label="Relevant services">
                  {recommended.map((slug) => {
                    const s = services.find((x) => x.slug === slug);
                    return s ? (
                      <li key={slug}>
                        <Link href={`/services/${slug}`} className="inline-block rounded-full border border-white/15 px-3 py-1.5 text-[0.84rem] text-sky hover:border-accent/60 hover:text-white">
                          {s.title}
                        </Link>
                      </li>
                    ) : null;
                  })}
                </ul>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <ButtonLink href={contactHref} variant="inverse" arrow data-cursor="Discuss">
                  Discuss my results
                </ButtonLink>
                <button type="button" onClick={copy} className="rounded-full border border-white/15 px-5 py-3 text-[0.92rem] hover:bg-white/10">
                  {copied ? "Copied ✓" : "Copy summary"}
                </button>
                <button type="button" onClick={restart} className="rounded-full px-4 py-3 text-[0.92rem] text-sky/80 hover:text-white">
                  Retake
                </button>
              </div>
              <p className="mt-6 text-[0.8rem] leading-relaxed text-sky/50">
                A self-assessment guide based on your answers — not a formal audit. Your answers stay in your browser and aren’t stored or sent anywhere
                unless you choose to share them.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
