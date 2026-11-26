import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { IntelligenceCore } from "@/components/visuals/IntelligenceCore";

export const metadata = pageMetadata({
  title: "Thank you",
  description: "Your enquiry has been received.",
  path: "/thank-you",
  noindex: true,
});

export default function ThankYouPage() {
  return (
    <section className="relative isolate flex min-h-[80svh] items-center overflow-hidden bg-gradient-to-b from-mist to-white pt-[4.5rem]">
      <div className="bp-grid fade-mask pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />
      <Container>
        <div className="grid items-center gap-10 py-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="font-mono text-[0.75rem] tracking-[0.14em] text-success uppercase">● Enquiry received</p>
            <h1 className="mt-5 font-display text-[clamp(2.4rem,5.5vw,4.5rem)] leading-[1.02] font-medium text-navy">
              Thank you — we’ve got your message.
            </h1>
            <p className="mt-6 max-w-xl text-[1.1rem] leading-relaxed text-muted">
              A member of our team will read your enquiry and reply by email. If we need more detail, we’ll ask specific questions so we can give you a
              useful answer.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/services" arrow>
                Explore our services
              </ButtonLink>
              <ButtonLink href="/" variant="secondary">
                Back to home
              </ButtonLink>
            </div>
          </div>
          <div className="mx-auto w-full max-w-sm lg:col-span-5">
            <IntelligenceCore readout={false} />
          </div>
        </div>
      </Container>
    </section>
  );
}
