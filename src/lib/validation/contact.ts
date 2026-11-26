import { z } from "zod";

/** Shared by the client form (usability) and the API route (security boundary). */

export const SERVICE_SLUGS = [
  "ai-engineering",
  "software-engineering",
  "intelligent-automation",
  "digital-innovation",
] as const;
export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

export const ENQUIRY_TYPES = [
  { value: "project", label: "New project" },
  { value: "consultation", label: "Consultation" },
  { value: "partnership", label: "Partnership" },
  { value: "general", label: "General enquiry" },
] as const;

export const BUDGET_RANGES = [
  { value: "under-5k", label: "Under USD 5k" },
  { value: "5k-15k", label: "USD 5k – 15k" },
  { value: "15k-50k", label: "USD 15k – 50k" },
  { value: "50k-plus", label: "USD 50k+" },
  { value: "not-sure", label: "Not sure yet" },
] as const;

const enquiryValues = ["project", "consultation", "partnership", "general"] as const;
const budgetValues = ["under-5k", "5k-15k", "15k-50k", "50k-plus", "not-sure"] as const;

const optionalText = (max: number) => z.string().trim().max(max, `Please keep this under ${max} characters`).optional().default("");

export const contactSchema = z
  .object({
    name: z.string().trim().min(2, "Please enter your name").max(100, "Please keep this under 100 characters"),
    email: z.string().trim().max(200).email("Please enter a valid email address"),
    company: optionalText(120),
    location: optionalText(120),
    enquiryType: z.enum(enquiryValues, { errorMap: () => ({ message: "Choose an enquiry type" }) }),
    services: z
      .array(z.enum(SERVICE_SLUGS))
      .min(1, "Select at least one area of interest")
      .max(SERVICE_SLUGS.length),
    budget: z.union([z.enum(budgetValues), z.literal("")]).optional().default(""),
    message: z
      .string()
      .trim()
      .min(20, "Tell us a little more — at least 20 characters")
      .max(4000, "Please keep this under 4,000 characters"),
    website: z
      .string()
      .trim()
      .max(300, "Please keep this under 300 characters")
      .refine((v) => v === "" || /^https?:\/\/[^\s<>"']+\.[^\s<>"']+$/i.test(v), "Enter a full URL starting with https://")
      .optional()
      .default(""),
    consent: z.literal(true, { errorMap: () => ({ message: "Please confirm you have read the privacy notice" }) }),
  })
  .strict();

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;
export type ContactField = keyof ContactInput;
