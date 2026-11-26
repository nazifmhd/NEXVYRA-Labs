import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { LegalPage } from "@/components/sections/LegalPage";

export const metadata = pageMetadata({
  title: "Terms of Use",
  description: "Terms governing the use of the NEXVYRA Labs website.",
  path: "/terms",
});

export default function TermsPage() {
  const who = siteConfig.brand.legalName ?? siteConfig.brand.displayName;
  return (
    <LegalPage label="Legal" title="Terms of Use" path="/terms">
      <h2>Using this website</h2>
      <p>
        By using this website you agree to these terms. If you do not agree, please do not use the site. The website is provided for general
        information about {who} and its services.
      </p>

      <h2>Information on this site</h2>
      <p>
        We aim to keep content accurate and current, but it is provided “as is” for general information and does not constitute professional advice or
        an offer. Solution descriptions are illustrative. Any engagement is governed by a separate written agreement.
      </p>

      <h2>Intellectual property</h2>
      <p>
        Unless stated otherwise, the content, design, text, graphics and brand assets on this website belong to {who} or its licensors. You may view and
        share pages for personal, non-commercial reference, but may not copy, modify or republish material without permission.
      </p>

      <h2>Acceptable use</h2>
      <ul>
        <li>Do not attempt to disrupt, overload or gain unauthorised access to the website or its systems.</li>
        <li>Do not submit false, misleading, unlawful or malicious content through our forms.</li>
      </ul>

      <h2>External links</h2>
      <p>Links to third-party websites are provided for convenience. We are not responsible for their content or practices.</p>

      <h2>Limitation of liability</h2>
      <p>
        To the extent permitted by law, {who} is not liable for any loss arising from use of, or reliance on, this website. Nothing in these terms
        excludes liability that cannot be excluded by law.
      </p>

      <h2>Changes</h2>
      <p>We may update these terms from time to time. The “last updated” date above shows when they last changed.</p>
    </LegalPage>
  );
}
