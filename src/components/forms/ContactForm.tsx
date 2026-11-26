"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { services } from "@/content/services";
import { siteConfig } from "@/config/site";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import {
  BUDGET_RANGES,
  ENQUIRY_TYPES,
  SERVICE_SLUGS,
  contactSchema,
  type ContactField,
  type ServiceSlug,
} from "@/lib/validation/contact";
import { Button } from "@/components/ui/Button";
import { AlertIcon, CheckIcon, ChevronDown, Spinner } from "@/components/ui/Icons";

type FormState = {
  name: string;
  email: string;
  company: string;
  location: string;
  enquiryType: string;
  services: ServiceSlug[];
  budget: string;
  message: string;
  website: string;
  consent: boolean;
};

type Errors = Partial<Record<ContactField, string>>;
type Status = "idle" | "submitting" | "error";

const STEPS: { title: string; short: string; fields: ContactField[] }[] = [
  { title: "What can we help with?", short: "Enquiry", fields: ["enquiryType", "services"] },
  { title: "Tell us about the project", short: "Project", fields: ["message", "budget", "website"] },
  { title: "How can we reach you?", short: "Details", fields: ["name", "email", "company", "location", "consent"] },
];
const FIELD_ORDER = STEPS.flatMap((s) => s.fields);
const stepOf = (f: ContactField) => STEPS.findIndex((s) => s.fields.includes(f));

const initial: FormState = {
  name: "",
  email: "",
  company: "",
  location: "",
  enquiryType: "project",
  services: [],
  budget: "",
  message: "",
  website: "",
  consent: false,
};

const inputCls =
  "block w-full rounded-xl border border-line bg-white px-4 py-3 text-[1rem] text-navy placeholder:text-muted/70 transition-[border-color,box-shadow] outline-none focus:border-action focus:ring-4 focus:ring-accent/15 aria-[invalid=true]:border-error";

function Field({
  id,
  label,
  optional,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 text-[0.95rem] font-medium text-navy">
        {label}
        {optional && <span className="text-[0.82rem] font-normal text-muted">Optional</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-[0.88rem] text-muted">
          {hint}
        </p>
      )}
      <div className="mt-2">{children}</div>
      {error && <ErrorText id={`${id}-error`}>{error}</ErrorText>}
    </div>
  );
}

function ErrorText({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-2 flex items-center gap-1.5 text-[0.88rem] text-error">
      <AlertIcon size={15} />
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Live brief — a draft project brief that assembles as you answer     */
/* ------------------------------------------------------------------ */

function BriefRow({ label, value, empty = "—" }: { label: string; value: string; empty?: string }) {
  const has = value.trim().length > 0;
  return (
    <div className="grid grid-cols-[6.5rem_1fr] gap-3 border-b border-white/[0.07] py-2.5 last:border-0">
      <dt className="font-mono text-[0.66rem] tracking-[0.12em] text-sky/50 uppercase">{label}</dt>
      <dd className={cn("min-w-0 text-[0.9rem] break-words", has ? "text-white" : "text-sky/35")}>
        <span key={value} className={cn("px-0.5", has && "brief-val")}>
          {has ? value : empty}
        </span>
      </dd>
    </div>
  );
}

function LiveBrief({ data, step }: { data: FormState; step: number }) {
  const type = ENQUIRY_TYPES.find((t) => t.value === data.enquiryType)?.label ?? "";
  const areas = data.services.map((s) => services.find((x) => x.slug === s)?.title ?? s).join(", ");
  const budget = BUDGET_RANGES.find((b) => b.value === data.budget)?.label ?? "";
  const summary = data.message.trim().length > 180 ? `${data.message.trim().slice(0, 180)}…` : data.message.trim();
  const contact = [data.name.trim(), data.company.trim()].filter(Boolean).join(" · ");

  const checks = [
    Boolean(type),
    data.services.length > 0,
    data.message.trim().length >= 20,
    Boolean(data.budget),
    Boolean(data.website.trim()),
    data.name.trim().length >= 2,
    /\S+@\S+\.\S+/.test(data.email),
    Boolean(data.company.trim()),
    Boolean(data.location.trim()),
    data.consent,
  ];
  const pct = Math.round((checks.filter(Boolean).length / checks.length) * 100);
  const segments = 12;
  const filled = Math.round((pct / 100) * segments);

  return (
    <div className="relative overflow-hidden rounded-[1.5rem] bg-navy-950 text-white shadow-[0_40px_80px_-45px_rgb(16_43_70/0.8)]">
      <div className="bp-grid-dark pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
      <div className="relative flex items-center justify-between border-b border-white/10 px-5 py-3.5 font-mono text-[0.68rem] tracking-[0.12em] text-sky/70 uppercase">
        <span>Project brief · Draft</span>
        <span className="flex items-center gap-2">
          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
          Live
        </span>
      </div>
      <dl className="relative px-5 py-2">
        <BriefRow label="Type" value={type} />
        <BriefRow label="Areas" value={areas} empty="Choose in step 1" />
        <div className="grid grid-cols-[6.5rem_1fr] gap-3 border-b border-white/[0.07] py-2.5">
          <dt className="font-mono text-[0.66rem] tracking-[0.12em] text-sky/50 uppercase">Summary</dt>
          <dd className={cn("min-w-0 text-[0.9rem] leading-relaxed break-words", summary ? "text-white" : "text-sky/35")}>
            {summary ? <span>“{summary}”</span> : "Describe it in step 2"}
            {step === 1 && <span className="brief-caret ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 bg-sky" aria-hidden="true" />}
          </dd>
        </div>
        <BriefRow label="Budget" value={budget} empty="Not specified" />
        <BriefRow label="Reference" value={data.website.trim()} />
        <BriefRow label="Contact" value={contact} empty="Add in step 3" />
        <BriefRow label="Region" value={data.location.trim()} />
      </dl>
      <div className="relative border-t border-white/10 px-5 py-4">
        <div className="flex items-center justify-between font-mono text-[0.66rem] tracking-[0.12em] text-sky/60 uppercase">
          <span>Completeness</span>
          <span className="text-white tabular-nums">{pct}%</span>
        </div>
        <div className="mt-2 flex gap-1" aria-hidden="true">
          {Array.from({ length: segments }, (_, n) => (
            <span
              key={n}
              className={cn("h-1.5 flex-1 rounded-sm transition-colors duration-500", n < filled ? "bg-gradient-to-r from-accent to-sky" : "bg-white/10")}
              style={{ transitionDelay: `${n * 25}ms` }}
            />
          ))}
        </div>
        <p className="mt-3 text-[0.82rem] leading-relaxed text-sky/60">
          Everything in this brief is sent with your enquiry, so our first reply can be specific to your project.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export function ContactForm({ aside }: { aside?: ReactNode }) {
  const router = useRouter();
  const uid = useId();
  const id = (f: string) => `${uid}-${f}`;
  const [data, setData] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const started = useRef(false);
  const honeypot = useRef<HTMLInputElement>(null);
  const alertRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);

  // Pre-fill from goal links, e.g. /contact?type=consultation&services=ai-engineering
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const type = q.get("type");
    const svc = (q.get("services") ?? "").split(",").filter((s): s is ServiceSlug => (SERVICE_SLUGS as readonly string[]).includes(s));
    if (!type && svc.length === 0) return;
    setData((d) => ({
      ...d,
      enquiryType: ENQUIRY_TYPES.some((t) => t.value === type) ? (type as string) : d.enquiryType,
      services: svc.length ? svc : d.services,
    }));
  }, []);

  // Move focus to the step heading when the step changes (not on first render).
  useEffect(() => {
    if (!moved.current) return;
    headingRef.current?.focus();
  }, [step]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setData((d) => ({ ...d, [key]: value }));
    if (errors[key as ContactField]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const onFirstInteract = () => {
    if (!started.current) {
      started.current = true;
      track("contact_form_start");
    }
  };

  const describedBy = (f: ContactField, hint = false) =>
    [hint ? `${id(f)}-hint` : null, errors[f] ? `${id(f)}-error` : null].filter(Boolean).join(" ") || undefined;

  const focusField = (f: ContactField) => {
    requestAnimationFrame(() => {
      const el = document.getElementById(f === "services" ? `${id("services")}-0` : id(f));
      el?.focus();
    });
  };

  const collectErrors = (fields: ContactField[]): Errors => {
    const parsed = contactSchema.safeParse(data);
    if (parsed.success) return {};
    const fe = parsed.error.flatten().fieldErrors as Record<string, string[] | undefined>;
    const out: Errors = {};
    for (const f of fields) if (fe[f]?.[0]) out[f] = fe[f]![0];
    return out;
  };

  const goTo = (n: number) => {
    moved.current = true;
    setFormError(null);
    setStep(n);
  };

  const next = () => {
    const errs = collectErrors(STEPS[step].fields);
    if (Object.keys(errs).length) {
      setErrors((e) => ({ ...e, ...errs }));
      track("contact_form_error", { kind: "validation", step: step + 1 });
      focusField(STEPS[step].fields.find((f) => errs[f])!);
      return;
    }
    goTo(step + 1);
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    if (step < STEPS.length - 1) {
      next();
      return;
    }
    setFormError(null);

    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      const all = collectErrors(FIELD_ORDER);
      setErrors(all);
      const first = FIELD_ORDER.find((f) => all[f]);
      if (first) {
        if (stepOf(first) !== step) goTo(stepOf(first));
        focusField(first);
      }
      track("contact_form_error", { kind: "validation", step: step + 1 });
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, hp: honeypot.current?.value ?? "" }),
      });

      if (res.ok) {
        track("contact_form_submit_success", { enquiryType: parsed.data.enquiryType });
        router.push("/thank-you");
        return;
      }

      const body = (await res.json().catch(() => ({}))) as { fieldErrors?: Record<string, string[]>; message?: string };
      if (res.status === 400 && body.fieldErrors) {
        const errs: Errors = {};
        for (const f of FIELD_ORDER) if (body.fieldErrors[f]?.[0]) errs[f] = body.fieldErrors[f][0];
        setErrors(errs);
        setStatus("idle");
        const first = FIELD_ORDER.find((f) => errs[f]);
        if (first) {
          if (stepOf(first) !== step) goTo(stepOf(first));
          focusField(first);
        }
        track("contact_form_error", { kind: "server_validation" });
        return;
      }

      setFormError(
        res.status === 429
          ? "You’ve sent several enquiries in a short time. Please wait a few minutes and try again."
          : body.message || "We couldn’t send your enquiry just now. Your details are still here — please try again.",
      );
      track("contact_form_error", { kind: `http_${res.status}` });
    } catch {
      setFormError("We couldn’t reach the server. Check your connection and try again — your details are still here.");
      track("contact_form_error", { kind: "network" });
    }
    setStatus("error");
    requestAnimationFrame(() => alertRef.current?.focus());
  }

  const stepErrors = STEPS[step].fields.filter((f) => errors[f]).length;
  const submitting = status === "submitting";
  const last = step === STEPS.length - 1;

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-7">
        <div className="rounded-[1.75rem] border border-line bg-white p-6 shadow-[0_40px_80px_-50px_rgb(16_43_70/0.35)] sm:p-10">
          {/* Progress */}
          <ol aria-label="Form progress" className="grid grid-cols-3 gap-2">
            {STEPS.map((s, n) => {
              const done = n < step;
              const current = n === step;
              return (
                <li key={s.short}>
                  <button
                    type="button"
                    disabled={n > step}
                    onClick={() => goTo(n)}
                    aria-current={current ? "step" : undefined}
                    className="group w-full text-left disabled:cursor-default"
                  >
                    <span className="block h-1 overflow-hidden rounded-full bg-line">
                      <span
                        className="block h-full origin-left bg-gradient-to-r from-action to-accent transition-transform duration-700 ease-[var(--ease-expo)]"
                        style={{ transform: `scaleX(${done || current ? 1 : 0})` }}
                      />
                    </span>
                    <span
                      className={cn(
                        "mt-2.5 flex items-center gap-1.5 font-mono text-[0.7rem] tracking-[0.12em] uppercase",
                        current ? "text-action" : done ? "text-navy group-hover:text-action" : "text-muted",
                      )}
                    >
                      {done ? <CheckIcon size={12} strokeWidth={2.5} /> : <span>{String(n + 1).padStart(2, "0")}</span>}
                      {s.short}
                      <span className="sr-only">{done ? "(completed)" : current ? "(current step)" : ""}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <form noValidate onSubmit={onSubmit} onFocus={onFirstInteract} className="mt-8">
            <h2 ref={headingRef} tabIndex={-1} className="font-display text-[clamp(1.5rem,2.6vw,2rem)] leading-tight font-medium text-navy outline-none">
              <span className="sr-only">
                Step {step + 1} of {STEPS.length}:{" "}
              </span>
              {STEPS[step].title}
            </h2>

            {stepErrors > 0 && (
              <div role="alert" className="mt-5 flex gap-3 rounded-xl border border-error/30 bg-error/5 px-4 py-3 text-[0.95rem] text-error">
                <AlertIcon className="mt-0.5 shrink-0" />
                <span>Please check {stepErrors === 1 ? "the highlighted field" : `the ${stepErrors} highlighted fields`} below.</span>
              </div>
            )}

            {formError && (
              <div ref={alertRef} tabIndex={-1} role="alert" className="mt-5 rounded-xl border border-error/30 bg-error/5 px-4 py-4 text-[0.95rem] text-error outline-none">
                <p className="flex gap-3">
                  <AlertIcon className="mt-0.5 shrink-0" />
                  <span>{formError}</span>
                </p>
                {siteConfig.contact.email && (
                  <p className="mt-2 pl-8 text-navy">
                    You can also email us at{" "}
                    <a className="underline" href={`mailto:${siteConfig.contact.email}`}>
                      {siteConfig.contact.email}
                    </a>
                    .
                  </p>
                )}
              </div>
            )}

            <div key={step} className="animate-rise mt-7 space-y-7">
              {step === 0 && (
                <>
                  <fieldset>
                    <legend className="text-[0.95rem] font-medium text-navy">What kind of enquiry is this?</legend>
                    <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {ENQUIRY_TYPES.map((t, n) => (
                        <label
                          key={t.value}
                          className={cn(
                            "relative flex min-h-12 cursor-pointer items-center justify-center rounded-xl border px-3 py-2.5 text-center text-[0.92rem] transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-accent/25",
                            data.enquiryType === t.value ? "border-navy bg-navy text-white" : "border-line bg-white text-navy hover:border-action/50",
                          )}
                        >
                          <input
                            type="radio"
                            name="enquiryType"
                            id={n === 0 ? id("enquiryType") : undefined}
                            value={t.value}
                            checked={data.enquiryType === t.value}
                            onChange={() => set("enquiryType", t.value)}
                            className="sr-only"
                          />
                          {t.label}
                        </label>
                      ))}
                    </div>
                    {errors.enquiryType && <ErrorText>{errors.enquiryType}</ErrorText>}
                  </fieldset>

                  <fieldset aria-describedby={errors.services ? `${id("services")}-error` : undefined}>
                    <legend className="text-[0.95rem] font-medium text-navy">Which areas are you interested in?</legend>
                    <p className="mt-1 text-[0.88rem] text-muted">Select all that apply — not sure? Pick the closest.</p>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {services.map((s, n) => {
                        const checked = data.services.includes(s.slug);
                        return (
                          <label
                            key={s.slug}
                            className={cn(
                              "flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-[0.95rem] transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-accent/25",
                              checked ? "border-action bg-mist text-navy" : "border-line bg-white text-navy hover:border-action/50",
                            )}
                          >
                            <input
                              type="checkbox"
                              id={`${id("services")}-${n}`}
                              name="services"
                              value={s.slug}
                              checked={checked}
                              onChange={(e) =>
                                set("services", e.target.checked ? [...data.services, s.slug] : data.services.filter((x) => x !== s.slug))
                              }
                              className="sr-only"
                            />
                            <span
                              className={cn(
                                "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                                checked ? "border-action bg-action text-white" : "border-navy/25 bg-white",
                              )}
                              aria-hidden="true"
                            >
                              {checked && <CheckIcon size={13} strokeWidth={2.5} />}
                            </span>
                            <span>
                              <span className="block">{s.title}</span>
                              <span className="block text-[0.78rem] text-muted">{s.kicker}</span>
                            </span>
                          </label>
                        );
                      })}
                    </div>
                    {errors.services && <ErrorText id={`${id("services")}-error`}>{errors.services}</ErrorText>}
                  </fieldset>
                </>
              )}

              {step === 1 && (
                <>
                  <Field
                    id={id("message")}
                    label="Tell us about your project"
                    hint="What are you trying to achieve and for whom? What exists today, and is there a timeline or constraint we should know about?"
                    error={errors.message}
                  >
                    <textarea
                      id={id("message")}
                      name="message"
                      rows={7}
                      maxLength={4000}
                      value={data.message}
                      onChange={(e) => set("message", e.target.value)}
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={describedBy("message", true)}
                      className={cn(inputCls, "min-h-44 resize-y")}
                    />
                    <p className="mt-1.5 text-right font-mono text-[0.75rem] text-muted" aria-hidden="true">
                      {data.message.length} / 4000
                    </p>
                  </Field>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field id={id("budget")} label="Budget range" optional error={errors.budget}>
                      <div className="relative">
                        <select
                          id={id("budget")}
                          name="budget"
                          value={data.budget}
                          onChange={(e) => set("budget", e.target.value)}
                          aria-describedby={describedBy("budget")}
                          className={cn(inputCls, "appearance-none pr-10")}
                        >
                          <option value="">Prefer not to say</option>
                          {BUDGET_RANGES.map((b) => (
                            <option key={b.value} value={b.value}>
                              {b.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown size={16} className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-muted" />
                      </div>
                    </Field>
                    <Field id={id("website")} label="Website or reference link" optional error={errors.website}>
                      <input
                        id={id("website")}
                        name="website"
                        type="url"
                        inputMode="url"
                        placeholder="https://"
                        maxLength={300}
                        value={data.website}
                        onChange={(e) => set("website", e.target.value)}
                        aria-invalid={Boolean(errors.website)}
                        aria-describedby={describedBy("website")}
                        className={inputCls}
                      />
                    </Field>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field id={id("name")} label="Full name" error={errors.name}>
                      <input
                        id={id("name")}
                        name="name"
                        autoComplete="name"
                        maxLength={100}
                        value={data.name}
                        onChange={(e) => set("name", e.target.value)}
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={describedBy("name")}
                        className={inputCls}
                      />
                    </Field>
                    <Field id={id("email")} label="Work email" error={errors.email}>
                      <input
                        id={id("email")}
                        name="email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        maxLength={200}
                        value={data.email}
                        onChange={(e) => set("email", e.target.value)}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={describedBy("email")}
                        className={inputCls}
                      />
                    </Field>
                    <Field id={id("company")} label="Company" optional error={errors.company}>
                      <input
                        id={id("company")}
                        name="company"
                        autoComplete="organization"
                        maxLength={120}
                        value={data.company}
                        onChange={(e) => set("company", e.target.value)}
                        aria-invalid={Boolean(errors.company)}
                        aria-describedby={describedBy("company")}
                        className={inputCls}
                      />
                    </Field>
                    <Field id={id("location")} label="Country / time zone" optional error={errors.location}>
                      <input
                        id={id("location")}
                        name="location"
                        autoComplete="country-name"
                        maxLength={120}
                        placeholder="e.g. United Kingdom, GMT"
                        value={data.location}
                        onChange={(e) => set("location", e.target.value)}
                        aria-invalid={Boolean(errors.location)}
                        aria-describedby={describedBy("location")}
                        className={inputCls}
                      />
                    </Field>
                  </div>

                  <div>
                    <label className="flex cursor-pointer items-start gap-3 text-[0.95rem] leading-relaxed text-navy">
                      <input
                        id={id("consent")}
                        type="checkbox"
                        name="consent"
                        checked={data.consent}
                        onChange={(e) => set("consent", e.target.checked)}
                        aria-invalid={Boolean(errors.consent)}
                        aria-describedby={describedBy("consent")}
                        className="mt-1 h-5 w-5 shrink-0 cursor-pointer rounded accent-[var(--color-action)]"
                      />
                      <span>
                        I’ve read the{" "}
                        <Link href="/privacy" className="text-action underline underline-offset-2">
                          privacy notice
                        </Link>{" "}
                        and agree to {siteConfig.brand.displayName} using these details to respond to my enquiry.
                      </span>
                    </label>
                    {errors.consent && (
                      <p id={`${id("consent")}-error`} className="mt-2 flex items-center gap-1.5 pl-8 text-[0.88rem] text-error">
                        <AlertIcon size={15} />
                        {errors.consent}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Honeypot — hidden from people and assistive tech */}
            <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
              <label>
                Leave this field empty
                <input ref={honeypot} type="text" name="hp" tabIndex={-1} autoComplete="off" defaultValue="" />
              </label>
            </div>

            <div className="mt-9 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
              {step > 0 ? (
                <Button type="button" variant="ghost" onClick={() => goTo(step - 1)}>
                  ← Back
                </Button>
              ) : (
                <p className="text-[0.88rem] text-muted">No budget or phone number required.</p>
              )}
              <div className="flex items-center gap-4">
                <p className="sr-only" aria-live="polite">
                  {submitting ? "Sending your enquiry…" : ""}
                </p>
                {last ? (
                  <Button type="submit" data-cursor="Send" disabled={submitting} arrow={!submitting} className="min-w-48">
                    {submitting ? (
                      <>
                        <Spinner /> <span>Sending…</span>
                      </>
                    ) : (
                      "Send enquiry"
                    )}
                  </Button>
                ) : (
                  <Button type="submit" arrow className="min-w-40">
                    Continue
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      <aside className="lg:col-span-5" aria-label="Your project brief">
        <div className="space-y-6 lg:sticky lg:top-28">
          <LiveBrief data={data} step={step} />
          {aside}
        </div>
      </aside>
    </div>
  );
}
