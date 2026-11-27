import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { getProject, projects } from "@/content/projects";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ArrowUpRight } from "@/components/ui/Icons";
import { CtaBand } from "@/components/sections/CtaBand";
import { ProjectViewTracker } from "./ProjectViewTracker";
import { ArchitectureDiagram } from "@/components/visuals/ArchitectureDiagram";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return pageMetadata({ title: p.title, description: p.summary, path: `/projects/${p.slug}` });
}

function Block({ index, label, children }: { index: string; label: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-6 border-t border-line py-12 lg:grid-cols-12 lg:gap-12" aria-label={label}>
      <div className="lg:col-span-3">
        <SectionLabel index={index}>{label}</SectionLabel>
      </div>
      <div className="max-w-3xl text-[1.04rem] leading-relaxed text-muted lg:col-span-9">{children}</div>
    </section>
  );
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const i = projects.findIndex((x) => x.slug === p.slug);
  const next = projects.length > 1 ? projects[(i + 1) % projects.length] : undefined;
  let n = 0;
  const idx = () => String(++n).padStart(2, "0");

  return (
    <>
      <ProjectViewTracker slug={p.slug} />
      <PageHero
        label={`${p.projectType}${p.year ? ` · ${p.year}` : ""}`}
        crumbs={[
          { name: "Projects", path: "/projects" },
          { name: p.title, path: `/projects/${p.slug}` },
        ]}
        title={p.title}
        intro={p.summary}
        aside={
          <dl className="grid grid-cols-2 gap-x-6 gap-y-5 rounded-2xl border border-line bg-white/80 p-6 text-[0.95rem] backdrop-blur">
            <div className="col-span-2">
              <dt className="font-mono text-[0.7rem] tracking-[0.14em] text-muted uppercase">Context</dt>
              <dd className="mt-1 text-navy">{p.context}</dd>
              {p.projectType === "Client delivery" && <dd className="mt-1 text-[0.82rem] text-muted">Client details are kept confidential.</dd>}
            </div>
            <div>
              <dt className="font-mono text-[0.7rem] tracking-[0.14em] text-muted uppercase">Type</dt>
              <dd className="mt-1 text-navy">{p.projectType}</dd>
            </div>
            <div>
              <dt className="font-mono text-[0.7rem] tracking-[0.14em] text-muted uppercase">Category</dt>
              <dd className="mt-1 text-navy">{p.categories.join(", ")}</dd>
            </div>
          </dl>
        }
      />

      {p.cover && (
        <Container>
          <div className="overflow-hidden rounded-[1.75rem] ring-1 ring-line">
            <Image src={p.cover.src} alt={p.cover.alt} width={p.cover.width} height={p.cover.height} sizes="100vw" priority className="h-auto w-full" />
          </div>
        </Container>
      )}

      <article className="bg-white py-16 sm:py-20">
        <Container>
          <Block index={idx()} label="Problem">
            <p className="text-navy">{p.problem}</p>
            {p.constraints.length > 0 && (
              <>
                <p className="mt-6 font-mono text-[0.72rem] tracking-[0.14em] text-action uppercase">Constraints</p>
                <ul className="mt-3 space-y-2">
                  {p.constraints.map((c) => (
                    <li key={c} className="flex gap-3">
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                      {c}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </Block>

          <Block index={idx()} label="Our role">
            <p className="text-navy">{p.role}</p>
          </Block>

          <Block index={idx()} label="Approach">
            <ol className="space-y-4">
              {p.approach.map((a, k) => (
                <li key={a} className="flex gap-4">
                  <span className="font-mono text-[0.8rem] text-action">{String(k + 1).padStart(2, "0")}</span>
                  <span>{a}</span>
                </li>
              ))}
            </ol>
          </Block>

          {p.capabilities.length > 0 && (
            <Block index={idx()} label="Capabilities">
              <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {p.capabilities.map((c) => (
                  <li key={c} className="flex gap-3 text-navy">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                    {c}
                  </li>
                ))}
              </ul>
            </Block>
          )}

          <Block index={idx()} label="Architecture">
            <p>{p.architecture.summary}</p>
            {p.architecture.components.length > 0 && (
              <dl className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
                {p.architecture.components.map((c) => (
                  <div key={c.name} className="bg-mist p-5">
                    <dt className="font-display text-[1.05rem] text-navy">{c.name}</dt>
                    <dd className="mt-1 text-[0.95rem]">{c.detail}</dd>
                  </div>
                ))}
              </dl>
            )}
          </Block>
          {p.architecture.diagram && (
            <div className="pb-12">
              <p className="mb-4 font-mono text-[0.72rem] tracking-[0.14em] text-muted uppercase">Explore the architecture — select a component</p>
              <ArchitectureDiagram diagram={p.architecture.diagram} initial={p.architecture.diagram.nodes.find((x) => x.tone === "core")?.id} caption={`System architecture · ${p.title}`} />
            </div>
          )}

          <Block index={idx()} label="Technology">
            <ul className="flex flex-wrap gap-2">
              {p.stack.map((t) => (
                <li key={t} className="rounded-full border border-line px-3.5 py-1.5 text-[0.9rem] text-navy">
                  {t}
                </li>
              ))}
            </ul>
          </Block>

          {p.outcomes.length > 0 && (
            <Block index={idx()} label="What was delivered">
              <ul className="grid gap-4 sm:grid-cols-2">
                {p.outcomes.map((o) => (
                  <li key={o.detail} className="rounded-2xl border border-line p-6">
                    {o.value && <p className="font-display text-[2.2rem] leading-none text-navy">{o.value}</p>}
                    <p className={o.value ? "mt-3 text-navy" : "text-navy"}>{o.detail}</p>
                    {o.method && <p className="mt-2 text-[0.85rem]">Measured: {o.method}</p>}
                  </li>
                ))}
              </ul>
            </Block>
          )}

          {p.lessons.length > 0 && (
            <Block index={idx()} label="Boundaries & notes">
              <ul className="space-y-3">
                {p.lessons.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </Block>
          )}

          {p.links && p.links.length > 0 && (
            <Block index={idx()} label="Links">
              <ul className="flex flex-wrap gap-4">
                {p.links.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-action underline underline-offset-2">
                      {l.label} <ArrowUpRight size={14} />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </Block>
          )}

          {next && (
            <div className="border-t border-line pt-12">
              <p className="font-mono text-[0.75rem] tracking-[0.14em] text-muted uppercase">Next project</p>
              <Link href={`/projects/${next.slug}`} className="group mt-3 inline-flex items-center gap-3 font-display text-[clamp(1.6rem,3vw,2.4rem)] text-navy hover:text-action">
                {next.title}
                <ArrowUpRight size={24} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            </div>
          )}
        </Container>
      </article>

      <CtaBand title="Have a similar challenge?" />
    </>
  );
}
