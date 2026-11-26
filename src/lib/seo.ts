import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
};

export function pageMetadata({ title, description, path, noindex }: PageMetaInput): Metadata {
  const url = `${siteConfig.siteUrl}${path === "/" ? "" : path}`;
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
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.brand.displayName}`,
      description,
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
