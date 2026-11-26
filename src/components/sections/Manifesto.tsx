import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/motion/Reveal";

const notes = [
  { k: "Understand", v: "We start with the business problem, the people involved and the constraints — not the technology." },
  { k: "Engineer", v: "We design systems that are tested, documented and measurable, whether they use AI or not." },
  { k: "Support", v: "We stay accountable after launch, monitoring and improving what we deliver." },
];

export function Manifesto() {
  return (
    <section className="relative bg-white py-24 sm:py-32" aria-labelledby="manifesto-title">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <SectionLabel index="01">Our philosophy</SectionLabel>
          </div>
          <div className="lg:col-span-9">
            <Reveal>
              <h2 id="manifesto-title" className="font-display text-[clamp(1.85rem,3.6vw,3.1rem)] leading-[1.14] font-normal tracking-[-0.025em] text-navy">
                We turn complex challenges into <span className="text-action">intelligent possibilities</span> — engineering partners who
                understand the business problem, <span className="text-muted">choose the right approach,</span> build it properly and
                support it beyond launch.
              </h2>
            </Reveal>
            <ol className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
              {notes.map((n, i) => (
                <Reveal as="li" key={n.k} delay={i * 90} className="bg-white p-6 sm:p-7">
                  <span className="font-mono text-[0.72rem] tracking-[0.14em] text-muted">0{i + 1}</span>
                  <h3 className="mt-3 text-[1.2rem] font-medium text-navy">{n.k}</h3>
                  <p className="mt-2 text-[0.98rem] leading-relaxed text-muted">{n.v}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  );
}
