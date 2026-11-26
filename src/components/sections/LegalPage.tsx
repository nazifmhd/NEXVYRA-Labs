import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { PageHero } from "./PageHero";
import { Container } from "@/components/ui/Container";

export function LegalPage({
  label,
  title,
  path,
  intro,
  children,
  showDraftNotice = true,
}: {
  label: string;
  title: string;
  path: string;
  intro?: string;
  children: ReactNode;
  showDraftNotice?: boolean;
}) {
  return (
    <>
      <PageHero label={label} title={title} intro={intro} crumbs={[{ name: title, path }]} />
      <section className="bg-white pb-24 sm:pb-32">
        <Container>
          <div className="max-w-3xl">
            <p className="font-mono text-[0.75rem] tracking-[0.12em] text-muted uppercase">Last updated: {siteConfig.legal.lastUpdated}</p>
            {showDraftNotice && !siteConfig.legal.reviewed && (
              <p role="note" className="mt-5 rounded-xl border border-warning/30 bg-warning/5 px-4 py-3 text-[0.92rem] text-warning">
                This document is a working draft based on how this website currently processes data. It is pending qualified legal review.
              </p>
            )}
            <div className="mt-10 space-y-5 text-[1.02rem] leading-relaxed text-muted [&_a]:text-action [&_a]:underline [&_h2]:mt-12 [&_h2]:font-display [&_h2]:text-[1.5rem] [&_h2]:font-medium [&_h2]:text-navy [&_li]:pl-1 [&_strong]:text-navy [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
              {children}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
