"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { services } from "@/content/services";
import { siteConfig } from "@/config/site";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import {
  BUDGET_RANGES,
  ENQUIRY_TYPES,
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

const FIELD_ORDER: ContactField[] = ["name", "email", "company", "location", "enquiryType", "services", "budget", "message", "website", "consent"];

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
  "block w-full rounded-xl border bg-white px-4 py-3 text-[1rem] text-navy placeholder:text-muted/70 transition-[border-color,box-shadow] outline-none focus:border-action focus:ring-4 focus:ring-accent/15 aria-[invalid=true]:border-error";

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
      {error && (
        <p id={`${id}-error`} className="mt-2 flex items-center gap-1.5 text-[0.88rem] text-error">
          <AlertIcon size={15} />
          {error}
        </p>
      )}
    </div>
  );
}

export function ContactForm() {
  const router = useRouter();
  const uid = useId();
  const id = (f: string) => `${uid}-${f}`;
  const [data, setData] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const started = useRef(false);
  const honeypot = useRef<HTMLInputElement>(null);
  const alertRef = useRef<HTMLDivElement>(null);

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

  const focusFirstError = (errs: Errors) => {
    const first = FIELD_ORDER.find((f) => errs[f]);
    if (!first) return;
    const el = document.getElementById(first === "services" ? `${id("services")}-0` : id(first));
    el?.focus();
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    setFormError(null);

    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      const fe = parsed.error.flatten().fieldErrors as Record<string, string[] | undefined>;
      const next: Errors = {};
      for (const f of FIELD_ORDER) if (fe[f]?.[0]) next[f] = fe[f]![0];
      setErrors(next);
      track("contact_form_error", { kind: "validation" });
      focusFirstError(next);
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
        const next: Errors = {};
        for (const f of FIELD_ORDER) if (body.fieldErrors[f]?.[0]) next[f] = body.fieldErrors[f][0];
        setErrors(next);
        setStatus("idle");
        focusFirstError(next);
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

  const errorCount = Object.values(errors).filter(Boolean).length;
  const submitting = status === "submitting";

  return (
    <form noValidate onSubmit={onSubmit} onFocus={onFirstInteract} className="space-y-7" aria-describedby={`${uid}-required-note`}>
      <p id={`${uid}-required-note`} className="text-[0.9rem] text-muted">
        Fields are required unless marked optional.
      </p>

      {errorCount > 0 && (
        <div role="alert" className="flex gap-3 rounded-xl border border-error/30 bg-error/5 px-4 py-3 text-[0.95rem] text-error">
          <AlertIcon className="mt-0.5 shrink-0" />
          <span>
            Please check {errorCount === 1 ? "the highlighted field" : `the ${errorCount} highlighted fields`} below.
          </span>
        </div>
      )}

      {formError && (
        <div ref={alertRef} tabIndex={-1} role="alert" className="rounded-xl border border-error/30 bg-error/5 px-4 py-4 text-[0.95rem] text-error outline-none">
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

      {/* Enquiry type */}
      <fieldset>
        <legend className="text-[0.95rem] font-medium text-navy">What kind of enquiry is this?</legend>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {ENQUIRY_TYPES.map((t) => (
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
                id={t.value === ENQUIRY_TYPES[0].value ? id("enquiryType") : undefined}
                value={t.value}
                checked={data.enquiryType === t.value}
                onChange={() => set("enquiryType", t.value)}
                className="sr-only"
              />
              {t.label}
            </label>
          ))}
        </div>
        {errors.enquiryType && <p className="mt-2 text-[0.88rem] text-error">{errors.enquiryType}</p>}
      </fieldset>

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
            className={cn(inputCls, "border-line")}
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
            className={cn(inputCls, "border-line")}
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
            className={cn(inputCls, "border-line")}
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
            className={cn(inputCls, "border-line")}
          />
        </Field>
      </div>

      {/* Services */}
      <fieldset aria-describedby={errors.services ? `${id("services")}-error` : undefined}>
        <legend className="text-[0.95rem] font-medium text-navy">Which areas are you interested in?</legend>
        <p className="mt-1 text-[0.88rem] text-muted">Select all that apply.</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {services.map((s, i) => {
            const checked = data.services.includes(s.slug);
            return (
              <label
                key={s.slug}
                className={cn(
                  "flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-[0.95rem] transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-accent/25",
                  checked ? "border-action bg-mist text-navy" : "border-line bg-white text-navy hover:border-action/50",
                )}
              >
                <input
                  type="checkbox"
                  id={`${id("services")}-${i}`}
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
                {s.title}
              </label>
            );
          })}
        </div>
        {errors.services && (
          <p id={`${id("services")}-error`} className="mt-2 flex items-center gap-1.5 text-[0.88rem] text-error">
            <AlertIcon size={15} />
            {errors.services}
          </p>
        )}
      </fieldset>

      <Field
        id={id("message")}
        label="Tell us about your project"
        hint="What are you trying to achieve, who is it for, and is there a timeline or constraint we should know about?"
        error={errors.message}
      >
        <textarea
          id={id("message")}
          name="message"
          rows={6}
          maxLength={4000}
          value={data.message}
          onChange={(e) => set("message", e.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={describedBy("message", true)}
          className={cn(inputCls, "min-h-40 resize-y border-line")}
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
              className={cn(inputCls, "appearance-none border-line pr-10")}
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
            className={cn(inputCls, "border-line")}
          />
        </Field>
      </div>

      {/* Honeypot — hidden from people and assistive tech */}
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label>
          Leave this field empty
          <input ref={honeypot} type="text" name="hp" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
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

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <Button type="submit" disabled={submitting} aria-disabled={submitting} arrow={!submitting} className="min-w-52">
          {submitting ? (
            <>
              <Spinner /> <span>Sending…</span>
            </>
          ) : (
            <span>Send enquiry</span>
          )}
        </Button>
        <p className="text-[0.88rem] text-muted" aria-live="polite">
          {submitting ? "Sending your enquiry…" : "No budget or phone number required."}
        </p>
      </div>
    </form>
  );
}
