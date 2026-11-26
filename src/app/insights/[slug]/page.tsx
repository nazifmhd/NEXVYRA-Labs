import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { formatDate, getInsight, insights, readingTime, type Block } from "@/content/insights";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { InsightCard } from "@/components/insights/InsightCard";
import { CtaBand } from "@/components/sections/CtaBand";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return insights.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = getInsight(slug);
  if (!a) return {};
  const base = pageMetadata({ title: a.title, description: a.excerpt, path: `/insights/${a.slug}` });
  return {
    ...base,
    openGraph: { ...base.openGraph, type: "article", publishedTime: a.publishDate, modifiedTime: a.updatedDate ?? a.publishDate, authors: [a.author] },
  };
}

function renderBlock(b: Block, i: number) {
  switch (b.type) {
    case "p":
      return <p key={i}>{b.text}</p>;
    case "h2":
      return (
        <h2 key={i} id={b.id} className="scroll-mt-28">
          {b.text}
        </h2>
      );
    case "ul":
      return (
        <ul key={i}>
          {b.items.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol key={i}>
          {b.items.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ol>
      );
    case "code":
      return (
        <figure key={i} className="not-prose overflow-hidden rounded-2xl bg-navy-950">
          <figcaption className="flex items-center justify-between border-b border-white/10 px-4 py-2 font-mono text-[0.68rem] tracking-[0.12em] text-sky/60 uppercase">
            <span>{b.lang}</span>
            <span aria-hidden="true">● ● ●</span>
          </figcaption>
          <pre tabIndex={0} aria-label={`Code example (${b.lang})`} className="overflow-x-auto p-5 text-[0.86rem] leading-relaxed text-sky focus-visible:outline-2 focus-visible:outline-accent">
            <code>{b.code}</code>
          </pre>
        </figure>
      );
    case "callout":
      return (
        <aside key={i} className="rounded-2xl border-l-2 border-accent bg-mist px-6 py-5 text-navy">
          {b.text}
        </aside>
      );
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const a = getInsight(slug);
  if (!a) notFound();

  const toc = a.body.filter((b): b is Extract<Block, { type: "h2" }> => b.type === "h2");
  const related = (a.related ?? []).map(getInsight).filter((x): x is NonNullable<typeof x> => Boolean(x));
  const url = `${siteConfig.siteUrl}/insights/${a.slug}`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: a.title,
          description: a.excerpt,
          datePublished: a.publishDate,
          dateModified: a.updatedDate ?? a.publishDate,
          author: { "@type": "Organization", name: a.author },
          publisher: { "@id": `${siteConfig.siteUrl}/#organization` },
          mainEntityOfPage: url,
        }}
      />
      <article>
        <header className="relative isolate overflow-hidden bg-gradient-to-b from-mist to-white pt-[4.5rem]">
          <div className="bp-grid fade-mask pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
          <Container>
            <div className="max-w-3xl pt-10 pb-14 sm:pt-14">
              <Breadcrumbs
                items={[
                  { name: "Insights", path: "/insights" },
                  { name: a.title, path: `/insights/${a.slug}` },
                ]}
              />
              <p className="mt-12 font-mono text-[0.75rem] tracking-[0.14em] text-action uppercase">{a.category}</p>
              <h1 className="animate-rise mt-4 font-display text-[clamp(2.2rem,5vw,4rem)] leading-[1.04] font-medium tracking-[-0.03em] text-navy">{a.title}</h1>
              <p className="mt-6 text-[1.15rem] leading-relaxed text-muted">{a.excerpt}</p>
              <p className="mt-8 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[0.75rem] tracking-[0.08em] text-muted uppercase">
                <span>{a.author}</span>
                <span aria-hidden="true">·</span>
                <time dateTime={a.publishDate}>{formatDate(a.publishDate)}</time>
                <span aria-hidden="true">·</span>
                <span>{readingTime(a.body)}</span>
              </p>
            </div>
          </Container>
        </header>

        <Container>
          <div className="grid gap-12 pb-24 lg:grid-cols-12">
            {toc.length > 2 && (
              <nav aria-label="On this page" className="lg:order-2 lg:col-span-3 lg:col-start-10">
                <div className="lg:sticky lg:top-28">
                  <p className="font-mono text-[0.72rem] tracking-[0.14em] text-muted uppercase">On this page</p>
                  <ol className="mt-4 space-y-2 border-l border-line">
                    {toc.map((h) => (
                      <li key={h.id}>
                        <a href={`#${h.id}`} className="-ml-px block border-l border-transparent py-1 pl-4 text-[0.92rem] text-muted transition-colors hover:border-action hover:text-action">
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ol>
                </div>
              </nav>
            )}
            <div className="min-w-0 max-w-[44rem] space-y-6 text-[1.08rem] leading-[1.75] text-navy/85 lg:col-span-8 [&_h2]:pt-6 [&_h2]:font-display [&_h2]:text-[1.75rem] [&_h2]:leading-tight [&_h2]:font-medium [&_h2]:text-navy [&_li]:pl-1 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
              {a.body.map(renderBlock)}
              <p className="border-t border-line pt-8 text-[0.95rem] text-muted">
                Written by the {siteConfig.brand.displayName} engineering team.{" "}
                <Link href="/contact" className="text-action underline underline-offset-2">
                  Talk to us
                </Link>{" "}
                about applying this to your systems.
              </p>
            </div>
          </div>
        </Container>
      </article>

      {related.length > 0 && (
        <section className="border-t border-line bg-mist py-20" aria-labelledby="related-title">
          <Container>
            <h2 id="related-title" className="font-display text-[1.75rem] font-medium text-navy">
              Related reading
            </h2>
            <ul className="mt-8 grid gap-4 md:grid-cols-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <InsightCard article={r} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}
      <CtaBand />
    </>
  );
}
