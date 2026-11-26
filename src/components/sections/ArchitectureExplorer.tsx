import { referenceArchitecture } from "@/content/architecture";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionLabel";
import { ArchitectureDiagram } from "@/components/visuals/ArchitectureDiagram";
import { InView } from "@/components/motion/InView";

export function ArchitectureExplorer({ index }: { index?: string }) {
  return (
    <section className="bg-white py-24 sm:py-32" aria-labelledby="arch-title">
      <Container>
        <SectionHeader
          index={index}
          label="Architecture explorer"
          title={<span id="arch-title">Look inside an intelligent system.</span>}
          intro="A reference architecture for the kind of AI system we engineer. Select any component to see what it does and which discipline delivers it."
        />
        <InView className="mt-14">
          <ArchitectureDiagram
            diagram={referenceArchitecture}
            initial="model"
            caption="Reference architecture · adapted to each client’s systems and constraints"
          />
        </InView>
      </Container>
    </section>
  );
}
