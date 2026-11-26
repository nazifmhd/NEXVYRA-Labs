"use client";

import Link from "next/link";
import { useId, useRef, useState, type FormEvent } from "react";
import { talentAreas } from "@/content/careers";
import { talentSchema, type TalentField } from "@/lib/validation/talent";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { AlertIcon, CheckIcon, ChevronDown, Spinner } from "@/components/ui/Icons";

type State = { name: string; email: string; location: string; area: string; profile: string; message: string; consent: boolean };
const ORDER: TalentField[] = ["name", "email", "location", "area", "profile", "message", "consent"];
const initial: State = { name: "", email: "", location: "", area: "", profile: "", message: "", consent: false };

const inputCls =
  "block w-full rounded-xl border border-line bg-white px-4 py-3 text-[1rem] text-navy placeholder:text-muted/70 outline-none transition-[border-color,box-shadow] focus:border-action focus:ring-4 focus:ring-accent/15 aria-[invalid=true]:border-error";

export function TalentForm() {
  const uid = useId();
  const id = (f: string) => `${uid}-${f}`;
  const [data, setData] = useState<State>(initial);
  const [errors, setErrors] = useState<Partial<Record<TalentField, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const honeypot = useRef<HTMLInputElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  const set = <K extends keyof State>(k: K, v: State[K]) => {
    setData((d) => ({ ...d, [k]: v }));
    if (errors[k as TalentField]) setErrors((e) => ({ ...e, [k]: undefined }));
  };
  const err = (f: TalentField) =>
    errors[f] ? (
      <p id={`${id(f)}-error`} className="mt-2 flex items-center gap-1.5 text-[0.88rem] text-error">
        <AlertIcon size={15} />
        {errors[f]}
      </p>
    ) : null;
  const aria = (f: TalentField) => ({ "aria-invalid": Boolean(errors[f]), "aria-describedby": errors[f] ? `${id(f)}-error` : undefined });

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;
    setFormError(null);
    const parsed = talentSchema.safeParse(data);
    if (!parsed.success) {
      const fe = parsed.error.flatten().fieldErrors as Record<string, string[] | undefined>;
      const next: Partial<Record<TalentField, string>> = {};
      for (const f of ORDER) if (fe[f]?.[0]) next[f] = fe[f]![0];
      setErrors(next);
      const first = ORDER.find((f) => next[f]);
      if (first) document.getElementById(id(first))?.focus();
      return;
    }
    setStatus("submitting");
    try {
      const res = await fetch("/api/talent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, hp: honeypot.current?.value ?? "" }),
      });
      if (res.ok) {
        setStatus("done");
        requestAnimationFrame(() => doneRef.current?.focus());
        return;
      }
      const body = (await res.json().catch(() => ({}))) as { message?: string };
      setFormError(res.status === 429 ? "You’ve submitted several times recently. Please try again later." : body.message ?? "Something went wrong. Please try again.");
    } catch {
      setFormError("We couldn’t reach the server. Check your connection and try again.");
    }
    setStatus("error");
  }

  if (status === "done") {
    return (
      <div ref={doneRef} tabIndex={-1} role="status" className="rounded-[1.5rem] border border-success/30 bg-success/5 p-8 outline-none">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-success/15 text-success">
          <CheckIcon />
        </span>
        <h3 className="mt-5 font-display text-[1.5rem] font-medium text-navy">You’re in the talent pool.</h3>
        <p className="mt-2 text-[1rem] leading-relaxed text-muted">
          Thanks for your interest. We’ll get in touch if a role opens that matches your experience.
        </p>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-6">
      {formError && (
        <div role="alert" className="flex gap-3 rounded-xl border border-error/30 bg-error/5 px-4 py-3 text-[0.95rem] text-error">
          <AlertIcon className="mt-0.5 shrink-0" />
          {formError}
        </div>
      )}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor={id("name")} className="text-[0.95rem] font-medium text-navy">Full name</label>
          <input id={id("name")} autoComplete="name" maxLength={100} value={data.name} onChange={(e) => set("name", e.target.value)} className={cn(inputCls, "mt-2")} {...aria("name")} />
          {err("name")}
        </div>
        <div>
          <label htmlFor={id("email")} className="text-[0.95rem] font-medium text-navy">Email</label>
          <input id={id("email")} type="email" autoComplete="email" maxLength={200} value={data.email} onChange={(e) => set("email", e.target.value)} className={cn(inputCls, "mt-2")} {...aria("email")} />
          {err("email")}
        </div>
        <div>
          <label htmlFor={id("area")} className="text-[0.95rem] font-medium text-navy">Area of work</label>
          <div className="relative mt-2">
            <select id={id("area")} value={data.area} onChange={(e) => set("area", e.target.value)} className={cn(inputCls, "appearance-none pr-10")} {...aria("area")}>
              <option value="">Choose one</option>
              {talentAreas.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-muted" />
          </div>
          {err("area")}
        </div>
        <div>
          <label htmlFor={id("location")} className="flex justify-between text-[0.95rem] font-medium text-navy">
            Location <span className="text-[0.82rem] font-normal text-muted">Optional</span>
          </label>
          <input id={id("location")} autoComplete="address-level2" maxLength={120} value={data.location} onChange={(e) => set("location", e.target.value)} className={cn(inputCls, "mt-2")} {...aria("location")} />
          {err("location")}
        </div>
      </div>
      <div>
        <label htmlFor={id("profile")} className="text-[0.95rem] font-medium text-navy">LinkedIn, GitHub or portfolio</label>
        <input id={id("profile")} type="url" inputMode="url" placeholder="https://" maxLength={300} value={data.profile} onChange={(e) => set("profile", e.target.value)} className={cn(inputCls, "mt-2")} {...aria("profile")} />
        {err("profile")}
      </div>
      <div>
        <label htmlFor={id("message")} className="text-[0.95rem] font-medium text-navy">About you</label>
        <p className="mt-1 text-[0.88rem] text-muted">What do you work on, and what kind of work are you looking for?</p>
        <textarea id={id("message")} rows={5} maxLength={2000} value={data.message} onChange={(e) => set("message", e.target.value)} className={cn(inputCls, "mt-2 resize-y")} {...aria("message")} />
        {err("message")}
      </div>
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label>
          Leave empty
          <input ref={honeypot} tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
      <div>
        <label className="flex cursor-pointer items-start gap-3 text-[0.95rem] leading-relaxed text-navy">
          <input id={id("consent")} type="checkbox" checked={data.consent} onChange={(e) => set("consent", e.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-[var(--color-action)]" {...aria("consent")} />
          <span>
            I’ve read the{" "}
            <Link href="/privacy" className="text-action underline underline-offset-2">
              privacy notice
            </Link>{" "}
            and agree to {siteConfig.brand.displayName} keeping these details to contact me about future roles.
          </span>
        </label>
        {err("consent")}
      </div>
      <Button type="submit" disabled={submitting(status)} arrow={!submitting(status)} data-cursor="Send">
        {submitting(status) ? (
          <>
            <Spinner /> <span>Sending…</span>
          </>
        ) : (
          "Join the talent pool"
        )}
      </Button>
    </form>
  );
}

const submitting = (s: string) => s === "submitting";
