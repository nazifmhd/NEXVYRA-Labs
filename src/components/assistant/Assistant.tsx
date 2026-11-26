"use client";

import Link from "next/link";
import { Fragment, useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { ArrowRight, CloseIcon } from "@/components/ui/Icons";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = ["What services do you offer?", "How does a project usually start?", "Do you work with healthcare organisations?", "Who owns the code you build?"];
const MAX_TURNS = 12;

/** Turn internal paths like /services/ai-engineering into links; everything else stays plain text. */
function RichText({ text }: { text: string }) {
  const parts = text.split(/(\/(?:[a-z0-9-]+)(?:\/[a-z0-9-]+)*)/g);
  return (
    <>
      {parts.map((p, i) =>
        /^\/[a-z0-9-]+(\/[a-z0-9-]+)*$/.test(p) ? (
          <Link key={i} href={p} className="text-sky underline underline-offset-2 hover:text-white">
            {p}
          </Link>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  );
}

/**
 * Site assistant (blueprint §18): answers only from the website's content,
 * hands off to people via /contact, never stores conversations here.
 * Rendered only when the server has an API key configured.
 */
export function Assistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [messages]);

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
      .map((m) => ({ ...m, content: m.content.slice(0, 4000) }))
      .slice(-MAX_TURNS);
    // History must start with a user turn.
    while (history.length && history[0].role !== "user") history.shift();
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);
    track("primary_cta_click", { location: "assistant_question" });

    const ac = new AbortController();
    abortRef.current = ac;
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: ac.signal,
      });
      if (!res.ok || !res.body) {
        const msg =
          res.status === 429
            ? "You’ve asked a lot of questions in a short time. Please wait a few minutes, or use /contact to reach the team."
            : "Sorry — I couldn’t answer just now. Please try again, or use /contact to reach the team.";
        setMessages((m) => [...m.slice(0, -1), { role: "assistant", content: msg }]);
        return;
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        setMessages((m) => [...m.slice(0, -1), { role: "assistant", content: acc }]);
      }
    } catch (err) {
      if (!(err instanceof DOMException && err.name === "AbortError")) {
        setMessages((m) => [...m.slice(0, -1), { role: "assistant", content: "Connection lost. Please try again." }]);
      }
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  }

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

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        data-cursor={open ? "" : "Ask"}
        className={cn(
          "fixed right-4 bottom-4 z-[80] flex items-center gap-2.5 rounded-full bg-navy py-2.5 pr-5 pl-2.5 text-white shadow-[0_20px_40px_-15px_rgb(16_43_70/0.7)] transition-[transform,background-color] duration-300 hover:bg-action sm:right-6 sm:bottom-6",
          open && "max-sm:hidden",
        )}
      >
        <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/10" aria-hidden="true">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M12 3 20 8v8l-8 5-8-5V8Z" />
            <circle cx="12" cy="12" r="2.2" fill="currentColor" />
          </svg>
          <span className="pulse-dot absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-accent" />
        </span>
        <span className="text-[0.92rem] font-medium">{open ? "Close assistant" : "Ask NEXVYRA"}</span>
      </button>

      <div
        id={panelId}
        role="dialog"
        aria-label="Website assistant"
        hidden={!open}
        className="fixed inset-x-0 bottom-0 z-[85] flex max-h-[85svh] flex-col overflow-hidden rounded-t-[1.5rem] bg-navy-950 text-white shadow-[0_30px_80px_-20px_rgb(10_28_47/0.8)] sm:inset-x-auto sm:right-6 sm:bottom-24 sm:h-[36rem] sm:max-h-[calc(100svh-8rem)] sm:w-[24rem] sm:rounded-[1.5rem]"
      >
        <div className="bp-grid-dark pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="relative flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <p className="font-display text-[1.05rem]">NEXVYRA assistant</p>
            <p className="font-mono text-[0.62rem] tracking-[0.12em] text-sky/60 uppercase">Answers from this website · AI</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              triggerRef.current?.focus();
            }}
            aria-label="Close assistant"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 hover:bg-white/10"
          >
            <CloseIcon size={16} />
          </button>
        </div>

        <div ref={logRef} role="log" aria-live="polite" aria-busy={busy} className="relative flex-1 space-y-4 overflow-y-auto px-5 py-5 text-[0.93rem] leading-relaxed">
          {messages.length === 0 ? (
            <div>
              <p className="text-sky/85">
                Hi — I can answer questions about our services, process and how to work with us. For anything specific to your project, a person from the team is the best route.
              </p>
              <ul className="mt-5 space-y-2">
                {SUGGESTIONS.map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      onClick={() => void ask(s)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-left text-[0.88rem] text-sky transition-colors hover:border-accent/50 hover:bg-white/10"
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            messages.map((m, i) => (
              <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[88%] rounded-2xl px-4 py-2.5 whitespace-pre-wrap",
                    m.role === "user" ? "rounded-br-sm bg-white text-navy" : "rounded-bl-sm border border-white/10 bg-white/[0.06] text-white",
                  )}
                >
                  <span className="sr-only">{m.role === "user" ? "You: " : "Assistant: "}</span>
                  {m.role === "assistant" ? (
                    m.content ? (
                      <RichText text={m.content} />
                    ) : (
                      <span className="inline-flex gap-1 py-1" aria-label="Thinking">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sky" />
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sky [animation-delay:150ms]" />
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sky [animation-delay:300ms]" />
                      </span>
                    )
                  ) : (
                    m.content
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="relative border-t border-white/10 px-4 pt-3 pb-4">
          <form onSubmit={onSubmit} className="flex items-end gap-2">
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
              placeholder="Ask about our services…"
              className="max-h-32 min-h-11 flex-1 resize-none rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-[0.93rem] text-white placeholder:text-sky/40 outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
            />
            {busy ? (
              <button
                type="button"
                onClick={() => abortRef.current?.abort()}
                className="flex h-11 shrink-0 items-center rounded-xl border border-white/15 px-3 text-[0.85rem] hover:bg-white/10"
              >
                Stop
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="Send question"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-white transition-colors hover:bg-sky hover:text-navy disabled:opacity-40"
              >
                <ArrowRight size={17} />
              </button>
            )}
          </form>
          <p className="mt-2.5 text-[0.72rem] leading-snug text-sky/50">
            AI answers can be wrong. Don’t share personal or confidential details.{" "}
            <Link href="/contact" className="text-sky underline underline-offset-2" onClick={() => setOpen(false)}>
              Talk to a person
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
