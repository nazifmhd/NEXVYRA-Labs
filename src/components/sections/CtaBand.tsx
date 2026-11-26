import { siteConfig } from "@/config/site";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CoreFallback } from "@/components/visuals/CoreFallback";
import { Magnetic } from "@/components/motion/Magnetic";
import { InView } from "@/components/motion/InView";

export function CtaBand({
  title = "Your next big idea starts here.",
  body = "Tell us what you’re trying to achieve. We’ll help you work out what to build, how to build it and what it will take.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="bg-white py-20 sm:py-24" aria-labelledby="cta-title">
      <Container>
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-ice via-mist to-white px-6 py-16 ring-1 ring-line sm:px-12 sm:py-20 lg:px-16">
          <div className="bp-grid pointer-events-none absolute inset-0 -z-10 opacity-80" aria-hidden="true" />
          <InView className="pointer-events-none absolute top-1/2 right-[-6rem] -z-10 hidden w-[28rem] -translate-y-1/2 opacity-90 md:block">
            <CoreFallback className="spin-slow" />
          </InView>
          <div className="max-w-2xl">
            <p className="font-mono text-[0.75rem] tracking-[0.14em] text-action uppercase">Start a conversation</p>
            <h2 id="cta-title" className="mt-5 font-display text-[clamp(2.1rem,5vw,4rem)] leading-[1.02] font-medium text-navy">
              {title}
            </h2>
            <p className="mt-5 max-w-lg text-[1.08rem] leading-relaxed text-muted">{body}</p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Magnetic>
                <ButtonLink href="/contact" arrow>
                  Discuss a Project
                </ButtonLink>
              </Magnetic>
              {siteConfig.contact.email && (
                <a href={`mailto:${siteConfig.contact.email}`} className="px-3 py-3 text-[0.95rem] text-navy underline-offset-4 hover:text-action hover:underline">
                  {siteConfig.contact.email}
                </a>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
