import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { LegalPage } from "@/components/sections/LegalPage";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How NEXVYRA Labs collects, uses and protects personal information submitted through this website.",
  path: "/privacy",
});

export default function PrivacyPage() {
  const { brand, contact } = siteConfig;
  const who = brand.legalName ?? brand.displayName;
  return (
    <LegalPage label="Legal" title="Privacy Policy" path="/privacy" intro="Plain-language information about the personal data this website collects and how it is used.">
      <h2>Who we are</h2>
      <p>
        This website is operated by {who} (“we”, “us”). {contact.locationLine}.
      </p>

      <h2>What we collect</h2>
      <p>We collect personal information only when you choose to send it to us. Through our enquiry form:</p>
      <ul>
        <li>
          <strong>Required:</strong> your name, email address, enquiry type, areas of interest and project description.
        </li>
        <li>
          <strong>Optional:</strong> company, country or time zone, budget range and a website or reference link.
        </li>
        <li>
          <strong>Technical:</strong> your IP address is processed briefly to protect the form from abuse (rate limiting). It is not stored with your enquiry.
        </li>
      </ul>
      <p>
        Through our <Link href="/careers">talent pool</Link> form: your name, email address, area of work, a profile link, a short description of
        yourself and, optionally, your location.
      </p>
      <p>
        If you use the <strong>website assistant</strong>, the questions you type are sent to our AI provider to generate an answer. We do not store
        assistant conversations on this website, and we do not use them to identify you. Please don’t enter personal or confidential information
        into the assistant.
      </p>
      <p>This website does not currently use advertising or tracking cookies.</p>

      <h2>How we use it</h2>
      <ul>
        <li>To read, respond to and follow up on your enquiry.</li>
        <li>To contact talent-pool members about relevant roles.</li>
        <li>To answer questions asked through the website assistant.</li>
        <li>To protect the website and form from spam and misuse.</li>
      </ul>
      <p>We do not sell your personal information or use it for unrelated marketing without your consent.</p>

      <h2>Who receives it</h2>
      <p>
        Enquiries are delivered to our team by a transactional email provider acting on our behalf, and the website is run on a hosting provider. These
        providers process data only to provide their services to us. Website assistant questions are processed by Anthropic, our AI provider,
        to generate answers.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep enquiry emails only as long as needed to handle the enquiry and any resulting business relationship, then delete them unless we are
        required to retain them. Talent-pool details are kept until you ask us to remove them, or until they are no longer relevant to our
        recruitment.
      </p>

      <h2>Your rights</h2>
      <p>
        Depending on where you live, you may have rights to access, correct, delete or object to our use of your personal information. To make a
        request, contact us{contact.email ? (
          <>
            {" "}at <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </>
        ) : (
          <>
            {" "}through our <Link href="/contact">contact form</Link>
          </>
        )}
        .
      </p>

      <h2>Changes</h2>
      <p>We will update this page if the way we process personal information changes, and revise the “last updated” date above.</p>
    </LegalPage>
  );
}
