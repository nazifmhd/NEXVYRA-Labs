import { pageMetadata } from "@/lib/seo";
import { siteConfig, socialLinks } from "@/config/site";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/forms/ContactForm";
import { ArrowUpRight } from "@/components/ui/Icons";

export const metadata = pageMetadata({
  title: "Contact",
  description: "Start a conversation with NEXVYRA Labs about a project, consultation or partnership.",
  path: "/contact",
});

const helpful = [
  "What you’re trying to achieve, and for whom",
  "What exists today — systems, data, previous attempts",
  "Any timeline, constraint or decision date",
  "How you’ll know the project has succeeded",
];

export default function ContactPage() {
  const { contact } = siteConfig;
  const socials = socialLinks();

  return (
    <>
      <PageHero
        label="Contact"
        crumbs={[{ name: "Contact", path: "/contact" }]}
        title={
          <>
            Let’s start a <span className="ink-gradient">conversation.</span>
          </>
        }
        intro="Tell us about your project, idea or challenge. A short description is enough to begin — we’ll ask the right questions from there."
      />

      <section className="bg-white pb-24 sm:pb-32" aria-label="Project enquiry">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <h2 className="font-display text-[1.35rem] font-medium text-navy">What helps us respond well</h2>
                <ul className="mt-5 space-y-3">
                  {helpful.map((h, i) => (
                    <li key={h} className="flex gap-4 text-[0.98rem] leading-relaxed text-muted">
                      <span className="font-mono text-[0.75rem] text-action">{String(i + 1).padStart(2, "0")}</span>
                      {h}
                    </li>
                  ))}
                </ul>

                <div className="mt-10 rounded-2xl border border-line bg-mist p-6">
                  <p className="font-mono text-[0.72rem] tracking-[0.14em] text-muted uppercase">Where we work</p>
                  <p className="mt-2 text-[1rem] text-navy">{contact.locationLine}</p>
                  {contact.email && (
                    <>
                      <p className="mt-5 font-mono text-[0.72rem] tracking-[0.14em] text-muted uppercase">Email</p>
                      <a href={`mailto:${contact.email}`} className="mt-1 block text-[1rem] text-action underline underline-offset-2">
                        {contact.email}
                      </a>
                    </>
                  )}
                  {contact.phone && (
                    <>
                      <p className="mt-5 font-mono text-[0.72rem] tracking-[0.14em] text-muted uppercase">Phone</p>
                      <a href={`tel:${contact.phone.replace(/\s+/g, "")}`} className="mt-1 block text-[1rem] text-navy">
                        {contact.phone}
                      </a>
                    </>
                  )}
                  {socials.length > 0 && (
                    <ul className="mt-5 flex flex-wrap gap-4">
                      {socials.map((s) => (
                        <li key={s.href}>
                          <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[0.95rem] text-action">
                            {s.label} <ArrowUpRight size={14} />
                            <span className="sr-only">(opens in a new tab)</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <p className="mt-6 text-[0.88rem] leading-relaxed text-muted">
                  We use the details you send only to respond to your enquiry. See our privacy notice for how we handle and retain them.
                </p>
              </div>
            </aside>

            <div className="lg:col-span-8">
              <div className="rounded-[1.75rem] border border-line bg-white p-6 shadow-[0_40px_80px_-50px_rgb(16_43_70/0.35)] sm:p-10">
                <ContactForm />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
