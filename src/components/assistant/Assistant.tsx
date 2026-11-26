"use client";

import Link from "next/link";
import { Fragment, useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { ArrowRight, ArrowUpRight, CloseIcon } from "@/components/ui/Icons";
import { CoreOrb } from "./CoreOrb";

type Msg = { role: "user" | "assistant"; content: string; feedback?: "up" | "down" };

const MAX_TURNS = 12;
const PATH_RE = /(\/(?:[a-z0-9-]+)(?:\/[a-z0-9-]+)*)/g;
const IS_PATH = /^\/[a-z0-9-]+(\/[a-z0-9-]+)*$/;

const TOPICS = [
  { label: "Services", q: "What services do you offer?" },
  { label: "Process", q: "How does a project usually start?" },
  { label: "Industries", q: "Which industries do you work with?" },
  { label: "Ownership", q: "Who owns the code you build?" },
];

/* ---------------- rendering helpers ---------------- */

/**
 * "Title (/path)" → title + a compact ↗ link; a bare "/path" → small mono link.
 * Only internal paths become links; nothing else is interpreted.
 */
function Inline({ text, titles }: { text: string; titles: Record<string, string> }) {
  const re = /\s?\((\/[a-z0-9-]+(?:\/[a-z0-9-]+)*)\)|(\/[a-z0-9-]+(?:\/[a-z0-9-]+)*)/g;
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(<Fragment key={`t${last}`}>{text.slice(last, m.index)}</Fragment>);
    const path = m[1] ?? m[2];
    out.push(
      m[1] ? (
        <Link
          key={`l${m.index}`}
          href={path}
          className="ml-1 inline-flex h-[1.15em] w-[1.15em] translate-y-[0.12em] items-center justify-center rounded bg-white/10 text-sky hover:bg-accent hover:text-white"
        >
          <ArrowUpRight size={10} />
          <span className="sr-only">{titles[path] ?? path}</span>
        </Link>
      ) : (
        <Link key={`l${m.index}`} href={path} className="rounded bg-white/10 px-1 font-mono text-[0.82em] text-sky hover:bg-white/15">
          {path}
        </Link>
      ),
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(<Fragment key={`t${last}`}>{text.slice(last)}</Fragment>);
  return <>{out}</>;
}

/** Minimal, safe formatter: paragraphs and "- " / "1. " lists. No HTML is ever interpreted. */
function Formatted({ text, titles, streaming }: { text: string; titles: Record<string, string>; streaming: boolean }) {
  const blocks = text.split(/\n{2,}/);
  return (
    <div className="space-y-2.5">
      {blocks.map((block, bi) => {
        const lines = block.split("\n").filter((l) => l.trim());
        const isList = lines.length > 0 && lines.every((l) => /^\s*(-|\*|\d+\.)\s+/.test(l));
        const caret = streaming && bi === blocks.length - 1 ? <span className="ast-caret" aria-hidden="true" /> : null;
        if (isList) {
          return (
            <ul key={bi} className="space-y-1.5">
              {lines.map((l, li) => (
                <li key={li} className="flex gap-2.5">
                  <span className="mt-[0.6em] h-1 w-2 shrink-0 bg-accent" aria-hidden="true" />
                  <span>
                    <Inline text={l.replace(/^\s*(-|\*|\d+\.)\s+/, "")} titles={titles} />
                    {li === lines.length - 1 && caret}
                  </span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={bi}>
            <Inline text={block} titles={titles} />
            {caret}
          </p>
        );
      })}
    </div>
  );
}

function referencedPaths(text: string, titles: Record<string, string>) {
  const found = text.match(PATH_RE) ?? [];
  return Array.from(new Set(found.filter((p) => IS_PATH.test(p) && titles[p] && p !== "/contact"))).slice(0, 4);
}

function followUps(paths: string[], titles: Record<string, string>, asked: Set<string>) {
  const out: string[] = [];
  for (const p of paths) {
    const t = titles[p];
    if (p.startsWith("/services/")) out.push(`What does ${t} include?`);
    else if (p.startsWith("/industries/")) out.push(`What do you build for ${t.toLowerCase()}?`);
    else if (p.startsWith("/insights/")) out.push(`Summarise “${t}”`);
    else if (p === "/process") out.push("What happens in the discovery stage?");
    else if (p === "/careers") out.push("How do I join the talent pool?");
  }
  out.push("How do we get started?", "What makes your approach different?", "How do you handle client data?");
  return Array.from(new Set(out)).filter((q) => !asked.has(q)).slice(0, 3);
}

function IconButton({ label, onClick, children, active }: { label: string; onClick: () => void; children: ReactNode; active?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-lg border transition-colors",
        active ? "border-accent/60 bg-accent/20 text-white" : "border-white/10 text-sky/60 hover:border-white/25 hover:text-white",
      )}
    >
      {children}
    </button>
  );
}

/* ---------------- component ---------------- */

/**
 * Site assistant (blueprint §18): answers only from the website's content,
 * hands off to people via /contact, never stores conversations here.
 * Rendered only when the server has an API key configured.
 */
export function Assistant({ titles }: { titles: Record<string, string> }) {
  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState(0);
  const abortRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  // One gentle hint per session, after the visitor has had time to look around.
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("nx-ast-hint") === "1";
    } catch {}
    if (seen) return;
    const t = window.setTimeout(() => setTeaser(true), 9000);
    return () => window.clearTimeout(t);
  }, []);

  const dismissTeaser = () => {
    setTeaser(false);
    try {
      sessionStorage.setItem("nx-ast-hint", "1");
    } catch {}
  };

  useEffect(() => {
    if (open) {
      dismissTeaser();
      track("assistant_open");
      const t = window.setTimeout(() => inputRef.current?.focus(), 250);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  async function ask(question: string) {
    const q = question.trim().slice(0, 1000);
    if (!q || busy) return;
    const history = [...messages.filter((m) => m.content.trim()), { role: "user" as const, content: q }]
      .map(({ role, content }) => ({ role, content: content.slice(0, 4000) }))
      .slice(-MAX_TURNS);
    while (history.length && history[0].role !== "user") history.shift();

    setMessages((m) => [...m.filter((x) => x.content.trim()), { role: "user", content: q }, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);
    setStage(0);
    const stageTimer = window.setTimeout(() => setStage(1), 1100);

    const ac = new AbortController();
    abortRef.current = ac;
    const setLast = (content: string) => setMessages((m) => [...m.slice(0, -1), { role: "assistant", content }]);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: ac.signal,
      });
      if (!res.ok || !res.body) {
        setLast(
          res.status === 429
            ? "You’ve asked a lot of questions in a short time. Please wait a few minutes, or use /contact to reach the team."
            : "Sorry — I couldn’t answer just now. Please try again, or use /contact to reach the team.",
        );
        return;
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        setLast(acc);
      }
    } catch (err) {
      if (!(err instanceof DOMException && err.name === "AbortError")) setLast("Connection lost. Please try again.");
    } finally {
      window.clearTimeout(stageTimer);
      setBusy(false);
      abortRef.current = null;
    }
  }

  const reset = () => {
    abortRef.current?.abort();
    setMessages([]);
    setInput("");
    inputRef.current?.focus();
  };

  const rate = (i: number, v: "up" | "down") => {
    setMessages((m) => m.map((x, k) => (k === i ? { ...x, feedback: x.feedback === v ? undefined : v } : x)));
    track("assistant_feedback", { value: v });
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void ask(input);
  };
  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void ask(input);
    }
  };

  const asked = new Set(messages.filter((m) => m.role === "user").map((m) => m.content));
  const lastIndex = messages.length - 1;

  return (
    <>
      {/* Launcher */}
      <div className={cn("fixed right-4 bottom-4 z-[80] flex items-end gap-3 sm:right-6 sm:bottom-6", open && "max-sm:hidden")}>
        {teaser && !open && (
          <div className="ast-teaser relative mb-2 hidden max-w-[15rem] rounded-2xl rounded-br-sm border border-line bg-white px-4 py-3 text-[0.88rem] text-navy shadow-[0_20px_40px_-20px_rgb(16_43_70/0.45)] sm:block">
            <button type="button" onClick={dismissTeaser} aria-label="Dismiss" className="absolute top-1.5 right-1.5 rounded p-1 text-muted hover:text-navy">
              <CloseIcon size={12} />
            </button>
            <p className="pr-4 font-medium">Have a question?</p>
            <p className="mt-0.5 text-muted">I answer from this website — instantly.</p>
          </div>
        )}
        <button
          ref={triggerRef}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((o) => !o)}
          data-cursor={open ? "" : "Ask"}
          className="ast-launcher group relative flex h-14 items-center gap-0 overflow-hidden rounded-full bg-navy-950 pr-1.5 pl-1.5 text-white shadow-[0_20px_40px_-15px_rgb(10_28_47/0.8)] ring-1 ring-white/10 transition-[padding,background-color] duration-500 ease-[var(--ease-expo)] hover:bg-navy hover:pr-5"
        >
          <span className="relative flex h-11 w-11 shrink-0 items-center justify-center">
            {open ? <CloseIcon size={18} /> : <CoreOrb busy={busy} className="h-9 w-9" />}
          </span>
          <span className="max-w-0 overflow-hidden whitespace-nowrap text-[0.92rem] font-medium opacity-0 transition-[max-width,opacity,margin] duration-500 ease-[var(--ease-expo)] group-hover:ml-1.5 group-hover:max-w-40 group-hover:opacity-100 group-focus-visible:ml-1.5 group-focus-visible:max-w-40 group-focus-visible:opacity-100">
            {open ? "Close" : "Ask NEXVYRA"}
          </span>
          <span className="sr-only">{open ? "Close assistant" : "Open the NEXVYRA assistant"}</span>
        </button>
      </div>

      {/* Panel */}
      <div
        id={panelId}
        role="dialog"
        aria-label="NEXVYRA website assistant"
        aria-hidden={!open}
        inert={!open}
        data-open={open ? "true" : undefined}
        className="ast-panel fixed inset-x-0 bottom-0 z-[85] flex h-[88svh] flex-col overflow-hidden rounded-t-[1.75rem] bg-navy-950 text-white shadow-[0_40px_100px_-20px_rgb(10_28_47/0.85)] ring-1 ring-white/10 sm:inset-x-auto sm:right-6 sm:bottom-24 sm:h-[38rem] sm:max-h-[calc(100svh-8rem)] sm:w-[25.5rem] sm:rounded-[1.75rem]"
      >
        <div className="bp-grid-dark pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[radial-gradient(closest-side,rgb(54_140_235/0.35),transparent)]" aria-hidden="true" />

        {/* Header */}
        <div className="relative flex items-center gap-3 border-b border-white/10 px-4 py-3.5">
          <CoreOrb busy={busy} className="h-10 w-10 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="font-display text-[1.02rem] leading-tight">NEXVYRA assistant</p>
            <p className="mt-0.5 flex items-center gap-1.5 font-mono text-[0.6rem] tracking-[0.12em] text-sky/60 uppercase">
              <span className={cn("h-1.5 w-1.5 rounded-full", busy ? "animate-pulse bg-amber-300" : "bg-emerald-400")} aria-hidden="true" />
              {busy ? "Working…" : "Online · answers from this site"}
            </p>
          </div>
          {messages.length > 0 && (
            <button type="button" onClick={reset} className="rounded-lg border border-white/10 px-2.5 py-1.5 font-mono text-[0.62rem] tracking-[0.1em] text-sky/70 uppercase hover:border-white/25 hover:text-white">
              New chat
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              triggerRef.current?.focus();
            }}
            aria-label="Close assistant"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 hover:bg-white/10"
          >
            <CloseIcon size={16} />
          </button>
        </div>

        {/* Conversation */}
        <div ref={logRef} role="log" aria-live="polite" aria-busy={busy} className="relative flex-1 overflow-y-auto overscroll-contain px-4 py-5 text-[0.92rem] leading-relaxed">
          {messages.length === 0 ? (
            <div className="ast-intro">
              <p className="font-mono text-[0.62rem] tracking-[0.14em] text-accent uppercase">SYS · ready</p>
              <h2 className="mt-2 font-display text-[1.55rem] leading-tight">
                Hello. Ask me anything about <span className="ink-gradient">NEXVYRA Labs</span>.
              </h2>
              <p className="mt-3 text-sky/75">
                I answer from this website’s content — services, process, industries and how we work. For anything specific to your project, a person from the team is the best route.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-2">
                {TOPICS.map((t, i) => (
                  <button
                    key={t.label}
                    type="button"
                    onClick={() => void ask(t.q)}
                    style={{ animationDelay: `${150 + i * 70}ms` }}
                    className="ast-topic group rounded-2xl border border-white/10 bg-white/[0.04] p-3.5 text-left transition-colors hover:border-accent/50 hover:bg-white/[0.08]"
                  >
                    <span className="font-mono text-[0.6rem] tracking-[0.12em] text-sky/50 uppercase">0{i + 1}</span>
                    <span className="mt-1 block font-display text-[0.98rem] text-white">{t.label}</span>
                    <span className="mt-1 block text-[0.78rem] leading-snug text-sky/60 group-hover:text-sky/85">{t.q}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <ol className="space-y-5">
              {messages.map((m, i) => {
                const streaming = busy && i === lastIndex && m.role === "assistant";
                if (m.role === "user") {
                  return (
                    <li key={i} className="ast-msg flex justify-end">
                      <span className="sr-only">You said: </span>
                      <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-white px-4 py-2.5 whitespace-pre-wrap text-navy">{m.content}</div>
                    </li>
                  );
                }
                const done = !streaming && m.content.length > 0;
                const refs = done ? referencedPaths(m.content, titles) : [];
                const handoff = done && m.content.includes("/contact");
                const isLatest = i === lastIndex;
                return (
                  <li key={i} className="ast-msg relative pl-4">
                    <span className="absolute top-1 bottom-1 left-0 w-px bg-gradient-to-b from-accent via-accent/40 to-transparent" aria-hidden="true" />
                    <p className="font-mono text-[0.6rem] tracking-[0.14em] text-sky/50 uppercase">
                      <span className="sr-only">Assistant: </span>
                      <span aria-hidden="true">NEXVYRA</span>
                    </p>
                    <div className="mt-1.5 text-white/95">
                      {m.content ? (
                        <Formatted text={m.content} titles={titles} streaming={streaming} />
                      ) : (
                        <div className="ast-stages font-mono text-[0.72rem] tracking-[0.06em] text-sky/70" aria-label="Working on an answer">
                          <p className={cn("flex items-center gap-2", stage > 0 && "text-sky/40")}>
                            <span className={cn("h-1.5 w-1.5 rounded-full", stage > 0 ? "bg-emerald-400" : "animate-pulse bg-accent")} />
                            Reading site content{stage > 0 ? " ✓" : "…"}
                          </p>
                          {stage > 0 && (
                            <p className="mt-1.5 flex items-center gap-2">
                              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                              Composing answer…
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {refs.length > 0 && (
                      <div className="mt-3">
                        <p className="font-mono text-[0.58rem] tracking-[0.14em] text-sky/45 uppercase">Referenced pages</p>
                        <ul className="mt-1.5 flex flex-wrap gap-1.5">
                          {refs.map((p) => (
                            <li key={p}>
                              <Link
                                href={p}
                                className="inline-flex items-center gap-1 rounded-full border border-white/12 bg-white/[0.05] px-2.5 py-1 text-[0.76rem] text-sky hover:border-accent/60 hover:text-white"
                              >
                                {titles[p]}
                                <ArrowUpRight size={11} />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {handoff && (
                      <Link
                        href="/contact"
                        onClick={() => setOpen(false)}
                        className="group mt-3 flex items-center justify-between gap-3 rounded-2xl border border-accent/30 bg-gradient-to-r from-accent/15 to-transparent px-4 py-3 hover:border-accent/60"
                      >
                        <span>
                          <span className="block text-[0.88rem] font-medium text-white">Talk to a person</span>
                          <span className="block text-[0.76rem] text-sky/65">Start a project enquiry — the team replies by email.</span>
                        </span>
                        <ArrowRight size={16} className="shrink-0 text-sky transition-transform group-hover:translate-x-1" />
                      </Link>
                    )}

                    {done && (
                      <div className="mt-3 flex items-center gap-1.5">
                        <IconButton label="Helpful answer" active={m.feedback === "up"} onClick={() => rate(i, "up")}>
                          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path d="M7 10v11M7 10l4-7c1.5 0 2.5 1 2.5 2.5V9h5a2 2 0 0 1 2 2.3l-1.2 7A2 2 0 0 1 17.3 20H7" />
                          </svg>
                        </IconButton>
                        <IconButton label="Not helpful" active={m.feedback === "down"} onClick={() => rate(i, "down")}>
                          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 rotate-180" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path d="M7 10v11M7 10l4-7c1.5 0 2.5 1 2.5 2.5V9h5a2 2 0 0 1 2 2.3l-1.2 7A2 2 0 0 1 17.3 20H7" />
                          </svg>
                        </IconButton>
                        {m.feedback && <span className="ml-1 text-[0.72rem] text-sky/55">Thanks for the feedback</span>}
                      </div>
                    )}

                    {done && isLatest && (
                      <div className="mt-4">
                        <p className="font-mono text-[0.58rem] tracking-[0.14em] text-sky/45 uppercase">Ask next</p>
                        <ul className="mt-1.5 space-y-1.5">
                          {followUps(referencedPaths(m.content, titles), titles, asked).map((q) => (
                            <li key={q}>
                              <button
                                type="button"
                                onClick={() => void ask(q)}
                                className="group flex w-full items-center justify-between gap-2 rounded-xl border border-white/10 px-3 py-2 text-left text-[0.82rem] text-sky/85 hover:border-accent/50 hover:bg-white/[0.06] hover:text-white"
                              >
                                {q}
                                <ArrowRight size={13} className="shrink-0 opacity-50 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          )}
        </div>

        {/* Composer */}
        <div className="relative border-t border-white/10 bg-navy-950/80 px-4 pt-3 pb-4 backdrop-blur">
          <form onSubmit={onSubmit} className="ast-composer flex items-end gap-2 rounded-2xl border border-white/12 bg-white/[0.05] p-1.5 pl-3.5 transition-colors focus-within:border-accent/70">
            <label htmlFor={`${panelId}-q`} className="sr-only">
              Your question
            </label>
            <textarea
              id={`${panelId}-q`}
              ref={inputRef}
              rows={1}
              maxLength={1000}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask about services, process, industries…"
              className="max-h-32 min-h-10 flex-1 resize-none bg-transparent py-2 text-[0.92rem] text-white placeholder:text-sky/35 outline-none"
            />
            {busy ? (
              <button type="button" onClick={() => abortRef.current?.abort()} className="flex h-10 shrink-0 items-center rounded-xl border border-white/15 px-3 text-[0.8rem] hover:bg-white/10">
                Stop
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="Send question"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-action text-white transition-[opacity,transform] hover:scale-105 disabled:opacity-35 disabled:hover:scale-100"
              >
                <ArrowRight size={17} />
              </button>
            )}
          </form>
          <p className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-[0.68rem] leading-snug text-sky/45">
            <span>AI answers can be wrong · don’t share personal details</span>
            <Link href="/contact" className="text-sky/80 underline underline-offset-2 hover:text-white" onClick={() => setOpen(false)}>
              Talk to a person
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
