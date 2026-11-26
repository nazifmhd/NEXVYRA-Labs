"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/motion";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionLabel";
import { CheckIcon } from "@/components/ui/Icons";

/**
 * "Follow one system": a scroll-driven walkthrough of how an AI knowledge
 * assistant handles one question end to end. Desktop: steps scroll on the left
 * while a sticky "system trace" console updates on the right. Mobile: each step
 * shows its own console inline. Everything is labelled illustrative.
 */

const steps = [
  {
    key: "ask",
    tag: "Input",
    title: "A question arrives",
    body: "A customer asks something on your website, by email or in your helpdesk. The system receives it with its context: channel, intent and language.",
  },
  {
    key: "retrieve",
    tag: "Retrieval",
    title: "It finds the right sources",
    body: "Only approved documents are searched. Passages are ranked by relevance, and weak matches are discarded rather than guessed from.",
  },
  {
    key: "draft",
    tag: "Generation",
    title: "It drafts a grounded answer",
    body: "The model writes a reply from the retrieved passages only, with citations so every statement can be checked.",
  },
  {
    key: "guard",
    tag: "Evaluation",
    title: "Guardrails check the work",
    body: "Automated checks confirm the answer is grounded, safe and on-policy, and score its confidence before anything is sent.",
  },
  {
    key: "handoff",
    tag: "Human-in-the-loop",
    title: "People handle the edge cases",
    body: "Sensitive or low-confidence cases go to the right person with the draft and sources attached, so they start halfway done.",
  },
  {
    key: "improve",
    tag: "Improvement",
    title: "Every outcome makes it better",
    body: "Corrections and feedback grow an evaluation set. Every change is tested against it before release, so quality is proven, not assumed.",
  },
] as const;

type StepKey = (typeof steps)[number]["key"];

const ANSWER =
  "Yes, you can change the delivery address until your order is dispatched. Open Orders → Manage delivery, or reply here with the new address and we’ll update it [1]. After dispatch, the courier can redirect the parcel for a small fee [2].";

function useTyped(text: string, active: boolean) {
  const [n, setN] = useState(text.length);
  useEffect(() => {
    if (!active) return;
    if (prefersReducedMotion()) {
      setN(text.length);
      return;
    }
    let i = 0;
    setN(0);
    const id = window.setInterval(() => {
      i += 2;
      setN(i);
      if (i >= text.length) window.clearInterval(id);
    }, 16);
    return () => window.clearInterval(id);
  }, [active, text]);
  return text.slice(0, n);
}

const i = (n: number) => ({ "--i": n }) as CSSProperties;

function Item({ n, className, children }: { n: number; className?: string; children: ReactNode }) {
  return (
    <div className={cn("fs-item", className)} style={i(n)}>
      {children}
    </div>
  );
}

function Bar({ value, tone = "accent" }: { value: number; tone?: "accent" | "muted" }) {
  return (
    <span className="fs-bar block h-1 w-full overflow-hidden rounded-full bg-white/10">
      <span
        className={cn("block h-full origin-left rounded-full", tone === "accent" ? "bg-gradient-to-r from-accent to-sky" : "bg-white/25")}
        style={{ "--v": value } as CSSProperties}
      />
    </span>
  );
}

function Chip({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "ok" | "warn" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[0.66rem] tracking-[0.08em] uppercase",
        tone === "ok" && "border-emerald-300/30 bg-emerald-300/10 text-emerald-200",
        tone === "warn" && "border-amber-300/30 bg-amber-300/10 text-amber-200",
        tone === "default" && "border-white/15 bg-white/5 text-sky/80",
      )}
    >
      {children}
    </span>
  );
}

function Stage({ k, active }: { k: StepKey; active: boolean }) {
  const typed = useTyped(ANSWER, active && k === "draft");

  return (
    <div className="fs-stage space-y-3 text-[0.9rem]" data-active={active ? "true" : undefined}>
      {k === "ask" && (
        <>
          <Item n={0} className="flex items-center justify-between font-mono text-[0.68rem] tracking-[0.1em] text-sky/60 uppercase">
            <span>Customer · Web chat · 09:42</span>
            <span className="text-emerald-300">● Received</span>
          </Item>
          <Item n={1} className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-navy">
            Can I change my delivery address after I’ve placed an order?
          </Item>
          <Item n={2} className="flex flex-wrap gap-2 pt-2">
            <Chip>Channel · Web chat</Chip>
            <Chip>Intent · Order change</Chip>
            <Chip>Lang · EN</Chip>
          </Item>
          <Item n={3} className="rounded-xl border border-white/10 bg-white/5 p-3 font-mono text-[0.72rem] text-sky/70">
            <span className="text-sky">route</span>(&quot;knowledge-assistant&quot;) → retrieval
          </Item>
        </>
      )}

      {k === "retrieve" && (
        <>
          <Item n={0} className="rounded-xl border border-white/10 bg-white/5 p-3 font-mono text-[0.72rem] text-sky/80">
            <span className="text-sky">search</span>(&quot;change delivery address after order&quot;, top_k=4)
          </Item>
          {[
            { doc: "Delivery policy", sec: "§4.2 Address changes", v: 0.91 },
            { doc: "Orders FAQ", sec: "Managing an order", v: 0.84 },
            { doc: "Courier terms", sec: "Redirection", v: 0.72 },
            { doc: "Returns policy", sec: "Refund timing", v: 0.38, drop: true },
          ].map((r, n) => (
            <Item key={r.doc} n={n + 1} className={cn("grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1.5", r.drop && "opacity-50")}>
              <span className={cn("text-white", r.drop && "line-through")}>
                {r.doc} <span className="text-sky/60">· {r.sec}</span>
              </span>
              <span className="font-mono text-[0.75rem] text-sky tabular-nums">{r.v.toFixed(2)}</span>
              <span className="col-span-2">
                <Bar value={r.v} tone={r.drop ? "muted" : "accent"} />
              </span>
            </Item>
          ))}
          <Item n={5} className="font-mono text-[0.68rem] tracking-[0.08em] text-sky/50 uppercase">
            Discarded below 0.60 relevance
          </Item>
        </>
      )}

      {k === "draft" && (
        <>
          <Item n={0} className="flex items-center justify-between font-mono text-[0.68rem] tracking-[0.1em] text-sky/60 uppercase">
            <span>Draft reply</span>
            <span>3 sources in context</span>
          </Item>
          <Item n={1} className="min-h-[8.5rem] rounded-2xl rounded-tr-sm border border-accent/30 bg-accent/10 px-4 py-3 leading-relaxed text-white">
            {typed.split(/(\[\d\])/).map((part, n) =>
              /^\[\d\]$/.test(part) ? (
                <sup key={n} className="mx-0.5 rounded bg-sky/20 px-1 font-mono text-[0.65rem] text-sky">
                  {part.slice(1, -1)}
                </sup>
              ) : (
                <span key={n}>{part}</span>
              ),
            )}
            {active && typed.length < ANSWER.length && <span className="ml-0.5 inline-block h-4 w-1.5 translate-y-0.5 animate-pulse bg-sky" />}
          </Item>
          <Item n={2} className="space-y-1.5 font-mono text-[0.72rem] text-sky/70">
            <p>
              <span className="text-sky">[1]</span> Delivery policy · §4.2 Address changes
            </p>
            <p>
              <span className="text-sky">[2]</span> Courier terms · Redirection
            </p>
          </Item>
        </>
      )}

      {k === "guard" && (
        <>
          {[
            "Grounded in retrieved sources",
            "No personal data exposed",
            "Consistent with delivery policy",
            "Tone and format checks",
          ].map((c, n) => (
            <Item key={c} n={n} className="flex items-center gap-3 text-white">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-300/15 text-emerald-300">
                <CheckIcon size={12} strokeWidth={2.5} />
              </span>
              {c}
            </Item>
          ))}
          <Item n={4} className="pt-2">
            <div className="flex justify-between font-mono text-[0.7rem] tracking-[0.08em] text-sky/70 uppercase">
              <span>Confidence</span>
              <span className="text-white tabular-nums">0.87</span>
            </div>
            <div className="relative mt-2">
              <Bar value={0.87} />
              <span className="absolute -top-1.5 left-[75%] h-4 w-px bg-amber-200" aria-hidden="true" />
            </div>
            <p className="mt-1.5 text-right font-mono text-[0.62rem] text-amber-200/80 uppercase">Threshold 0.75</p>
          </Item>
          <Item n={5}>
            <Chip tone="ok">● Auto-reply approved</Chip>
          </Item>
        </>
      )}

      {k === "handoff" && (
        <>
          <Item n={0} className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-white px-4 py-3 text-navy">
            I was charged twice for one order and need a refund.
          </Item>
          <Item n={1} className="flex flex-wrap gap-2">
            <Chip tone="warn">Confidence 0.41</Chip>
            <Chip tone="warn">Sensitive · Payment</Chip>
          </Item>
          <Item n={2} className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center justify-between">
              <span className="font-display text-[1rem] text-white">Routed to Billing team</span>
              <span className="font-mono text-[0.65rem] text-sky/60 uppercase">Queue</span>
            </div>
            <ul className="mt-3 space-y-1.5 font-mono text-[0.72rem] text-sky/75">
              <li>+ Draft reply attached</li>
              <li>+ 2 sources attached</li>
              <li>+ Order and payment history linked</li>
            </ul>
          </Item>
          <Item n={3} className="font-mono text-[0.68rem] tracking-[0.08em] text-sky/50 uppercase">
            Customer told a person will reply
          </Item>
        </>
      )}

      {k === "improve" && (
        <>
          <Item n={0} className="flex items-center justify-between font-mono text-[0.68rem] tracking-[0.1em] text-sky/60 uppercase">
            <span>Evaluation set · release check</span>
            <span>Example</span>
          </Item>
          {[
            { l: "Grounded answers", v: 0.96 },
            { l: "Correct per reviewer", v: 0.92 },
            { l: "Escalated when it should", v: 0.98 },
          ].map((m, n) => (
            <Item key={m.l} n={n + 1}>
              <div className="mb-1.5 flex justify-between text-white">
                <span>{m.l}</span>
                <span className="font-mono text-[0.75rem] text-sky tabular-nums">{Math.round(m.v * 100)}%</span>
              </div>
              <Bar value={m.v} />
            </Item>
          ))}
          <Item n={4} className="rounded-xl border border-white/10 bg-white/[0.04] p-3 font-mono text-[0.72rem] text-sky/75">
            Reviewer correction captured → added to test set
          </Item>
          <Item n={5}>
            <Chip tone="ok">● New version passed regression</Chip>
          </Item>
        </>
      )}
    </div>
  );
}

function Console({ active, children, compact = false }: { active: number; children: ReactNode; compact?: boolean }) {
  const step = steps[active];
  return (
    <div className="relative overflow-hidden rounded-[1.5rem] bg-navy-950 text-white ring-1 ring-white/5 shadow-[0_40px_80px_-40px_rgb(16_43_70/0.7)]">
      <div className="bp-grid-dark pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
      <div className="relative flex items-center justify-between border-b border-white/10 px-5 py-3.5 font-mono text-[0.68rem] tracking-[0.12em] text-sky/70 uppercase">
        <span className="flex items-center gap-2">
          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
          System trace · knowledge-assistant
        </span>
        <span className="tabular-nums">
          {String(active + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
        </span>
      </div>
      {!compact && (
        <div className="relative flex gap-1 px-5 pt-4" aria-hidden="true">
          {steps.map((s, n) => (
            <span key={s.key} className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
              <span
                className="block h-full origin-left bg-gradient-to-r from-accent to-sky transition-transform duration-700 ease-[var(--ease-expo)]"
                style={{ transform: `scaleX(${n <= active ? 1 : 0})` }}
              />
            </span>
          ))}
        </div>
      )}
      <div className="relative px-5 pt-4 pb-2">
        <p className="font-mono text-[0.68rem] tracking-[0.12em] text-accent uppercase">{step.tag}</p>
      </div>
      <div className="relative px-5 pb-5">{children}</div>
      <p className="relative border-t border-white/10 px-5 py-3 font-mono text-[0.62rem] tracking-[0.1em] text-sky/45 uppercase">
        Illustrative example — not client data
      </p>
    </div>
  );
}

export function FollowSystem({ index = "03" }: { index?: string }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const els = refs.current.filter(Boolean) as HTMLLIElement[];
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="relative bg-white py-24 sm:py-32" aria-labelledby="follow-title">
      <Container>
        <SectionHeader
          index={index}
          label="Follow one system"
          title={<span id="follow-title">From one question to a better system.</span>}
          intro="Here’s how a typical AI knowledge assistant we’d engineer handles a single request — and what happens when it shouldn’t answer on its own."
        />

        <div className="mt-16 grid gap-10 lg:grid-cols-12 lg:gap-16">
          <ol className="relative lg:col-span-5">
            <span className="absolute top-2 bottom-2 left-[0.6875rem] w-px bg-line" aria-hidden="true" />
            {steps.map((s, n) => (
              <li
                key={s.key}
                ref={(el) => {
                  refs.current[n] = el;
                }}
                data-step={n}
                className="relative pb-12 pl-12 last:pb-0 lg:flex lg:min-h-[62vh] lg:flex-col lg:justify-center lg:pb-0"
              >
                <span
                  className={cn(
                    "absolute top-1 left-0 flex h-[1.375rem] w-[1.375rem] items-center justify-center rounded-full border bg-white transition-all duration-500 lg:top-auto",
                    n <= active ? "border-action shadow-[0_0_0_5px_rgb(54_140_235/0.12)]" : "border-line",
                  )}
                  aria-hidden="true"
                >
                  <span className={cn("h-2 w-2 rounded-full transition-all duration-500", n <= active ? "scale-100 bg-action" : "scale-50 bg-line")} />
                </span>
                <div className={cn("transition-opacity duration-500", n === active ? "lg:opacity-100" : "lg:opacity-40")}>
                  <p className="font-mono text-[0.72rem] tracking-[0.14em] text-muted uppercase">
                    Step {String(n + 1).padStart(2, "0")} · {s.tag}
                  </p>
                  <h3 className="mt-2 font-display text-[clamp(1.5rem,2.4vw,2.1rem)] leading-tight font-medium text-navy">{s.title}</h3>
                  <p className="mt-3 max-w-md text-[1.02rem] leading-relaxed text-muted">{s.body}</p>
                </div>
                {/* Mobile: inline console per step */}
                <div className="mt-6 lg:hidden" aria-hidden="true">
                  <Console active={n} compact>
                    <Stage k={s.key} active={n === active} />
                  </Console>
                </div>
              </li>
            ))}
          </ol>

          {/* Desktop: sticky console */}
          <div className="hidden lg:col-span-7 lg:block" aria-hidden="true">
            <div className="sticky top-28">
              <Console active={active}>
                <div className="relative h-[21rem]">
                  {steps.map((s, n) => (
                    <div
                      key={s.key}
                      className={cn(
                        "absolute inset-0 transition-[opacity,transform] duration-500 ease-[var(--ease-expo)]",
                        n === active ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0",
                      )}
                    >
                      <Stage k={s.key} active={n === active} />
                    </div>
                  ))}
                </div>
              </Console>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
