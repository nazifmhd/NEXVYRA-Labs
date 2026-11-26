import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { siteConfig } from "@/config/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { ScrollSignal } from "@/components/motion/ScrollSignal";
import "./globals.css";

// Self-hosted variable fonts (no build-time network dependency, no third-party font requests).
const inter = localFont({
  src: "../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});
const space = localFont({
  src: "../../node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2",
  variable: "--font-space",
  weight: "300 700",
  display: "swap",
});
const mono = localFont({
  src: "../../node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2",
  variable: "--font-jb",
  weight: "100 800",
  display: "swap",
  preload: false,
});

const { brand } = siteConfig;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: { default: `${brand.displayName} — ${brand.tagline}`, template: `%s | ${brand.displayName}` },
  description: brand.description,
  applicationName: brand.displayName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: brand.displayName,
    title: `${brand.displayName} — ${brand.tagline}`,
    description: brand.description,
    url: siteConfig.siteUrl,
    locale: "en",
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${space.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* Enables reveal animations only when JS runs; content stays visible otherwise. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="min-h-dvh overflow-x-clip">
        <a
          href="#main"
          className="fixed top-3 left-3 z-[100] -translate-y-24 rounded-full bg-navy px-5 py-3 text-white transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <ScrollSignal />
        <Header />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": `${siteConfig.siteUrl}/#organization`,
                name: brand.legalName ?? brand.displayName,
                url: siteConfig.siteUrl,
                logo: `${siteConfig.siteUrl}${brand.logoMark}`,
                slogan: brand.tagline,
                description: brand.description,
              },
              {
                "@type": "WebSite",
                "@id": `${siteConfig.siteUrl}/#website`,
                url: siteConfig.siteUrl,
                name: brand.displayName,
                publisher: { "@id": `${siteConfig.siteUrl}/#organization` },
                inLanguage: "en",
              },
            ],
          }}
        />
      </body>
    </html>
  );
}
