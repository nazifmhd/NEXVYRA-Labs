/**
 * Business commitments confirmed by the founder (27 Nov 2026).
 * Publish only commitments the business genuinely keeps; edit here to change them everywhere.
 */
export const commitments = [
  {
    code: "C-01",
    title: "You own the code",
    body: "Code we write for you belongs to you. No lock-in, no licence to keep your own system running.",
  },
  {
    code: "C-02",
    title: "Your data never trains models",
    body: "Client data is never used to train AI models — ours or anyone else’s. We configure providers accordingly.",
  },
  {
    code: "C-03",
    title: "NDAs on request",
    body: "Need confidentiality before sharing details? We’ll sign an NDA before the conversation goes further.",
  },
  {
    code: "C-04",
    title: "Documentation & handover",
    body: "Every engagement ends with documentation, runbooks and knowledge transfer, so your team can own what we build.",
  },
] as const;
