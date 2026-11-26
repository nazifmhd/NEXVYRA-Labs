import { z } from "zod";

const areaValues = ["ai-engineering", "software-engineering", "automation", "design", "cloud-devops", "other"] as const;

const httpUrl = (msg: string) =>
  z
    .string()
    .trim()
    .max(300, "Please keep this under 300 characters")
    .refine((v) => v === "" || /^https?:\/\/[^\s<>"']+\.[^\s<>"']+$/i.test(v), msg);

/** Talent-pool registration (careers page). Shared by client and server. */
export const talentSchema = z
  .object({
    name: z.string().trim().min(2, "Please enter your name").max(100),
    email: z.string().trim().max(200).email("Please enter a valid email address"),
    location: z.string().trim().max(120).optional().default(""),
    area: z.enum(areaValues, { errorMap: () => ({ message: "Choose the area closest to your work" }) }),
    profile: httpUrl("Enter a full link starting with https://").refine((v) => v !== "", "Add a link to your LinkedIn, GitHub or portfolio"),
    message: z.string().trim().min(20, "Tell us a little about yourself — at least 20 characters").max(2000),
    consent: z.literal(true, { errorMap: () => ({ message: "Please confirm you have read the privacy notice" }) }),
  })
  .strict();

export type TalentInput = z.input<typeof talentSchema>;
export type TalentData = z.output<typeof talentSchema>;
export type TalentField = keyof TalentInput;
