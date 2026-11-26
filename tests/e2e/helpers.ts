import type { Page } from "@playwright/test";

/** Every public route that should exist. Keep in sync with the sitemap. */
export const ROUTES = [
  "/",
  "/about",
  "/services",
  "/services/ai-engineering",
  "/services/software-engineering",
  "/services/intelligent-automation",
  "/services/digital-innovation",
  "/solutions",
  "/industries",
  "/industries/healthcare",
  "/industries/retail-ecommerce",
  "/industries/finance-professional-services",
  "/projects",
  "/process",
  "/insights",
  "/insights/evaluate-llm-features-before-shipping",
  "/insights/rag-that-holds-up-in-production",
  "/insights/automations-that-fail-loudly",
  "/ai-readiness",
  "/careers",
  "/contact",
  "/privacy",
  "/terms",
  "/accessibility",
  "/thank-you",
];

/** Skip the first-visit boot intro and the assistant hint so pages are testable immediately. */
export async function prepare(page: Page) {
  await page.addInitScript(() => {
    try {
      sessionStorage.setItem("nx-boot", "1");
      sessionStorage.setItem("nx-ast-hint", "1");
    } catch {}
  });
}

/** Collect uncaught page errors and console errors during a test. */
export function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const t = m.text();
    // Ignore dev-only noise unrelated to the app itself.
    if (/Download the React DevTools|favicon|webpack-hmr|Fast Refresh/i.test(t)) return;
    errors.push(`console: ${t}`);
  });
  return errors;
}
