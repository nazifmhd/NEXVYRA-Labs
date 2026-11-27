import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { ogImagePath } from "@/lib/og/registry";

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
};

export function pageMetadata({ title, description, path, noindex }: PageMetaInput): Metadata {
  const url = `${siteConfig.siteUrl}${path === "/" ? "" : path}`;
  const image = { url: ogImagePath(path), width: 1200, height: 630, alt: `${title} — ${siteConfig.brand.displayName}` };
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url,
      title: `${title} | ${siteConfig.brand.displayName}`,
      description,
      siteName: siteConfig.brand.displayName,
      locale: "en",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.brand.displayName}`,
      description,
      images: [image.url],
    },
    robots: noindex ? { index: false, follow: true } : undefined,
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${siteConfig.siteUrl}${item.path}`,
    })),
  };
}
