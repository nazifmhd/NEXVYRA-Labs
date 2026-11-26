import { pageMetadata } from "@/lib/seo";
import { values } from "@/content/principles";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeader, SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/motion/Reveal";
import { Principles } from "@/components/sections/Principles";
import { CtaBand } from "@/components/sections/CtaBand";
import { Commitments } from "@/components/sections/Commitments";
import { IntelligenceCore } from "@/components/visuals/IntelligenceCore";

export const metadata = pageMetadata({
  title: "About",
  description:
    "NEXVYRA Labs is an engineering-led technology company combining AI engineering, software engineering, intelligent automation and digital innovation.",
  path: "/about",
});

const responsible = [
  { title: "Human oversight", body: "Consequential decisions stay with accountable people. AI systems we build include review, override and escalation paths." },
  { title: "Security by design", body: "Least-privilege access, secrets kept server-side, validated inputs and dependency hygiene are defaults, not extras." },
  { title: "Privacy & data care", body: "We collect and process only the data a system needs, and design retention and access controls with you." },
  { title: "Maintainability", body: "Readable code, tests and documentation mean the systems we deliver can be owned and evolved by your team." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        label="About"
        crumbs={[{ name: "About", path: "/about" }]}
        title={
          <>
            An engineering partner for <span className="ink-gradient">what’s next.</span>
          </>
        }
        intro="We engineer intelligent technology that helps businesses solve complex problems, operate smarter and build what’s next — combining AI, software, automation and modernisation under one disciplined practice."
        aside={
          <div className="frame-marks mx-auto hidden max-w-xs p-5 lg:block">
            <IntelligenceCore readout={false} />
          </div>
        }
      />

      <section className="bg-white py-24 sm:py-28" aria-labelledby="mission-title">
        <Container>
          <h2 id="mission-title" className="sr-only">
            Mission and vision
          </h2>
          <div className="grid gap-px overflow-hidden rounded-[1.75rem] border border-line bg-line md:grid-cols-2">
            <Reveal className="bg-white p-8 sm:p-12">
              <SectionLabel index="M">Mission</SectionLabel>
              <p className="mt-6 font-display text-[clamp(1.5rem,2.6vw,2.15rem)] leading-snug text-navy">
                To help organisations turn complex problems into dependable, intelligent systems — engineered properly, explained clearly and supported after launch.
              </p>
            </Reveal>
            <Reveal delay={100} className="bg-mist p-8 sm:p-12">
              <SectionLabel index="V">Vision</SectionLabel>
              <p className="mt-6 font-display text-[clamp(1.5rem,2.6vw,2.15rem)] leading-snug text-navy">
                A future where businesses of every size can use AI and modern software with confidence — because it is built responsibly and works as promised.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="bg-mist py-24 sm:py-28" aria-labelledby="values-title">
        <Container>
          <SectionHeader index="01" label="Values" title={<span id="values-title">What we hold ourselves to.</span>} />
          <ol className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {values.map((v, i) => (
              <Reveal as="li" key={v.title} delay={i * 70} className="border-t border-navy/20 pt-6">
                <span className="font-mono text-[0.72rem] tracking-[0.14em] text-muted">0{i + 1}</span>
                <h3 className="mt-3 text-[1.2rem] font-medium text-navy">{v.title}</h3>
                <p className="mt-2 text-[0.96rem] leading-relaxed text-muted">{v.body}</p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      <section className="bg-white py-24 sm:py-28" aria-labelledby="responsible-title">
        <Container>
          <SectionHeader
            index="02"
            label="Responsible engineering"
            title={<span id="responsible-title">Powerful systems, built responsibly.</span>}
            intro="AI and automation change how decisions get made. We treat that as an engineering responsibility, not a disclaimer."
          />
          <ul className="mt-14 grid gap-4 md:grid-cols-2">
            {responsible.map((r, i) => (
              <Reveal as="li" key={r.title} delay={(i % 2) * 90} className="rounded-2xl border border-line p-7 sm:p-8">
                <h3 className="font-display text-[1.3rem] font-medium text-navy">{r.title}</h3>
                <p className="mt-3 text-[1rem] leading-relaxed text-muted">{r.body}</p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <Commitments index="03" />
      <Principles index="04" />
      <CtaBand />
    </>
  );
}
