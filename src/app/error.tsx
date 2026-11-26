"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { Button, ButtonLink } from "@/components/ui/Button";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[app] unhandled error", error.digest ?? "");
  }, [error]);

  return (
    <section className="flex min-h-[80svh] items-center bg-gradient-to-b from-mist to-white pt-[4.5rem]">
      <Container>
        <div className="max-w-2xl py-16">
          <p className="font-mono text-[0.78rem] tracking-[0.14em] text-error uppercase">Error 500 · Something went wrong</p>
          <h1 className="mt-5 font-display text-[clamp(2.2rem,5vw,4rem)] leading-[1.04] font-medium text-navy">We hit an unexpected problem.</h1>
          <p className="mt-6 text-[1.1rem] leading-relaxed text-muted">
            It’s on our side, not yours. Try again, or head back to the homepage. If it keeps happening, please let us know.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button onClick={() => reset()} arrow>
              Try again
            </Button>
            <ButtonLink href="/" variant="secondary">
              Back to home
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
