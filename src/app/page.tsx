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
import { services } from "@/content/services";
import { VelocityMarquee } from "@/components/motion/VelocityMarquee";
import { GoalRouter } from "@/components/sections/GoalRouter";
import { FollowSystem } from "@/components/sections/FollowSystem";
import { ArchitectureExplorer } from "@/components/sections/ArchitectureExplorer";
import { Commitments } from "@/components/sections/Commitments";
import { InsightsPreview } from "@/components/sections/InsightsPreview";
import { insights } from "@/content/insights";

export default function HomePage() {
  // Section indices stay sequential whatever sections are shown.
  const hasWork = projects.length > 0;
  let i = 1; // [01] is the philosophy section
  const n = () => String(++i).padStart(2, "0");

  return (
    <>
      <Hero />
      <GoalRouter />
      <Manifesto />
      <Capabilities index={n()} />
      <section className="border-y border-line bg-white py-10 sm:py-14" aria-label="Capabilities in motion">
        <VelocityMarquee items={services.map((s) => s.title)} />
      </section>
      <FollowSystem index={n()} />
      <ArchitectureExplorer index={n()} />
      {hasWork && <SelectedWork index={n()} />}
      <SolutionsPreview index={n()} />
      <ProcessPath index={n()} />
      <Principles index={n()} />
      <Commitments index={n()} />
      <TechStack index={n()} />
      {insights.length > 0 && <InsightsPreview index={n()} />}
      <CtaBand />
    </>
  );
}
