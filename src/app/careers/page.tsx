import { pageMetadata } from "@/lib/seo";
import { howWeWork, openRoles } from "@/content/careers";
import { values } from "@/content/principles";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/motion/Reveal";
import { TalentForm } from "@/components/forms/TalentForm";

export const metadata = pageMetadata({
  title: "Careers",
  description: "Engineering at NEXVYRA Labs: how we work, current openings and our talent pool.",
  path: "/careers",
});

export default function CareersPage() {
  return (
    <>
      <PageHero
        label="Careers"
        crumbs={[{ name: "Careers", path: "/careers" }]}
        title={<>Build meaningful technology with a focused team.</>}
        intro="We’re engineers who care about doing the work properly — and about the people who use what we build."
      />

      <section className="bg-white pb-20" aria-labelledby="how-title">
        <Container>
          <h2 id="how-title" className="sr-only">
            How we work
          </h2>
          <ul className="grid gap-px overflow-hidden rounded-[1.5rem] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {howWeWork.map((h, n) => (
              <Reveal as="li" key={h.title} delay={n * 70} className="bg-white p-7">
                <span className="font-mono text-[0.72rem] tracking-[0.14em] text-muted">0{n + 1}</span>
                <h3 className="mt-4 font-display text-[1.2rem] font-medium text-navy">{h.title}</h3>
                <p className="mt-2 text-[0.96rem] leading-relaxed text-muted">{h.body}</p>
              </Reveal>
            ))}
          </ul>
          <p className="mt-6 text-[0.95rem] text-muted">
            Our values: {values.map((v) => v.title.toLowerCase()).join(", ")}.
          </p>
        </Container>
      </section>

      <section className="bg-mist py-24 sm:py-28" aria-labelledby="roles-title">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionLabel index="01">Open roles</SectionLabel>
              <h2 id="roles-title" className="mt-5 font-display text-[clamp(1.9rem,3.6vw,3rem)] leading-[1.08] font-medium text-navy">
                {openRoles.length > 0 ? "Current openings." : "No open roles right now."}
              </h2>
              {openRoles.length > 0 ? (
                <ul className="mt-8 space-y-3">
                  {openRoles.map((r) => (
                    <li key={r.slug} className="rounded-2xl border border-line bg-white p-5">
                      <p className="font-display text-[1.15rem] text-navy">{r.title}</p>
                      <p className="mt-1 font-mono text-[0.72rem] tracking-[0.08em] text-muted uppercase">
                        {r.type} · {r.location}
                      </p>
                      <p className="mt-2 text-[0.95rem] text-muted">{r.summary}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-5 text-[1.05rem] leading-relaxed text-muted">
                  We’re not hiring at the moment, but we’re always glad to hear from good engineers and designers. Join our talent pool and we’ll contact
                  you when a role opens that fits your experience.
                </p>
              )}
              <p className="mt-6 text-[0.9rem] leading-relaxed text-muted">
                We keep talent-pool details only for recruitment and delete them on request. See our privacy notice for details.
              </p>
            </div>
            <div className="lg:col-span-7">
              <div className="rounded-[1.75rem] border border-line bg-white p-6 sm:p-10">
                <h3 className="font-display text-[1.5rem] font-medium text-navy">Join the talent pool</h3>
                <div className="mt-7">
                  <TalentForm />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
