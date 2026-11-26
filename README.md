# NEXVYRA Labs — corporate website

Engineering Intelligence. Building Tomorrow.

Built to the *Website Master Development Blueprint v2.0*: Next.js (App Router) + React + TypeScript + Tailwind CSS v4, with a dependency-free canvas "Intelligence Core" signature visual.

## Getting started

Requires **Node.js 20.9+** (LTS recommended).

```bash
npm install
cp .env.example .env.local   # then fill in values
npm run dev                  # http://localhost:3000
```

Other scripts: `npm run build`, `npm start`, `npm run typecheck`.

## Where things live

```
src/
  app/                 routes, layouts, metadata, sitemap/robots, /api/contact
  components/
    layout/            Header (dropdown + mobile drawer), Footer, Logo
    sections/          Hero, Capabilities, ProcessPath, Principles, CtaBand, …
    visuals/           IntelligenceCore (canvas), CoreFallback (SVG), ServiceGlyph
    forms/             ContactForm
    projects/          ProjectCard, ProjectsIndex (filters)
    ui/ motion/ seo/   primitives, Reveal, JSON-LD
  config/site.ts       brand name, contact details, socials, nav (single source of truth)
  content/             services, solutions, process, principles, technologies, projects, insights
  lib/                 validation (zod), email delivery, rate limit, SEO, analytics shim
public/brand/          logo mark
```

## Editing content

- **Brand / contact / socials**: `src/config/site.ts`. Values set to `null` are hidden until you fill them in, so unverified details never show.
- **Services**: `src/content/services.ts`. Each one generates `/services/<slug>`.
- **Projects**: add entries to `src/content/projects.ts` and set `publishApproved: true`. Until at least one exists, the homepage "Selected work" section is hidden and `/projects` shows a "being prepared" state. Put images in `public/projects/<slug>/`.
- **Insights**: `src/content/insights.ts`. The nav link and sitemap entry stay hidden while it's empty.
- **Technology list**: `src/content/technologies.ts`. Verify it before launch.
- **Legal**: privacy and terms are drafts. Set `legal.reviewed = true` in `site.ts` after legal review to remove the draft notice.

## Contact form

Client and server share one zod schema (`src/lib/validation/contact.ts`). The API route enforces the following:

- same-origin check, JSON-only, 16 KB size cap
- honeypot field and per-IP rate limit (5 requests per 10 minutes, in memory)
- delivery through Resend (`RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`)

Behaviour by environment:

- **Development without keys:** submissions are accepted and logged without personal data.
- **Production without keys:** the form shows a recoverable error. Enquiries are never silently discarded.

To add a CRM later, put an adapter next to `src/lib/email.ts`.

## Before launch (blueprint §21–22)

- [ ] Name, domain and trademark clearance; set `legalName`
- [ ] Verified contact email and socials in `site.ts`
- [ ] Resend domain verified (SPF, DKIM, DMARC) and env vars set
- [ ] Approved projects added
- [ ] Technology list verified
- [ ] Legal review of privacy and terms
- [ ] Analytics provider chosen (`src/lib/analytics.ts`), then update the CSP in `next.config.ts`
- [ ] OG share image designed
- [ ] Lighthouse and accessibility pass on mid-range mobile
