import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Capabilities } from "@/components/sections/Capabilities";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { SolutionsPreview } from "@/components/sections/SolutionsPreview";
import { ProcessPath } from "@/components/sections/ProcessPath";
import { Principles } from "@/components/sections/Principles";
import { TechStack } from "@/components/sections/TechStack";
import { CtaBand } from "@/components/sections/CtaBand";
import { projects } from "@/content/projects";

export default function HomePage() {
  // Section indices stay sequential whether or not Selected Work is shown.
  const hasWork = projects.length > 0;
  const n = (i: number) => String(hasWork ? i + 1 : i).padStart(2, "0");

  return (
    <>
      <Hero />
      <Manifesto />
      <Capabilities index="02" />
      {hasWork && <SelectedWork index="03" />}
      <SolutionsPreview index={n(3)} />
      <ProcessPath index={n(4)} />
      <Principles index={n(5)} />
      <TechStack index={n(6)} />
      <CtaBand />
    </>
  );
}
