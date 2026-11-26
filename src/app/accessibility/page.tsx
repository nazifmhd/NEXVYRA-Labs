import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { LegalPage } from "@/components/sections/LegalPage";

export const metadata = pageMetadata({
  title: "Accessibility Statement",
  description: "Our commitment to making the NEXVYRA Labs website accessible to everyone.",
  path: "/accessibility",
});

export default function AccessibilityPage() {
  const { contact } = siteConfig;
  return (
    <LegalPage label="Accessibility" title="Accessibility Statement" path="/accessibility" showDraftNotice={false}>
      <p>
        We want everyone to be able to use this website, regardless of device, ability or assistive technology. We aim to meet the Web Content
        Accessibility Guidelines (WCAG) 2.2 at level AA where practical.
      </p>

      <h2>What we’ve done</h2>
      <ul>
        <li>Full keyboard navigation with visible focus states and a skip-to-content link.</li>
        <li>Semantic headings, landmarks and labelled form controls with clear error messages.</li>
        <li>Colour contrast checked for text and controls; status is never shown by colour alone.</li>
        <li>Animation respects your “reduce motion” setting, and all content is readable without animation or JavaScript.</li>
        <li>Decorative visuals are hidden from assistive technology.</li>
      </ul>

      <h2>Known limitations</h2>
      <p>We test regularly but may not catch every issue. If something doesn’t work for you, we want to know.</p>

      <h2>Feedback</h2>
      <p>
        Please tell us about any accessibility barrier{" "}
        {contact.email ? (
          <>
            at <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </>
        ) : (
          <>
            through our <Link href="/contact">contact form</Link>
          </>
        )}
        . Describe the page and the problem, and we’ll do our best to fix it or provide the information another way.
      </p>
    </LegalPage>
  );
}
