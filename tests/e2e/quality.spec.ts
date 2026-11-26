import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { ROUTES, prepare } from "./helpers";

test.beforeEach(async ({ page }) => prepare(page));

const A11Y_PAGES = ["/", "/about", "/services", "/services/ai-engineering", "/solutions", "/industries/healthcare", "/process", "/insights/rag-that-holds-up-in-production", "/ai-readiness", "/careers", "/contact"];

for (const route of A11Y_PAGES) {
  test(`accessibility (WCAG 2.2 AA) ${route}`, async ({ page }) => {
    await page.goto(route);
    await page.waitForLoadState("networkidle");
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    const report = serious.map((v) => `${v.impact}: ${v.id} — ${v.help}\n  ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join("\n  ")}`).join("\n");
    expect(serious, report).toEqual([]);
  });
}

test("no broken internal links", async ({ page, request }) => {
  test.setTimeout(240_000);
  const seen = new Set<string>();
  for (const route of ROUTES) {
    await page.goto(route);
    const hrefs = await page.$$eval("a[href^='/']", (as) => as.map((a) => (a as HTMLAnchorElement).getAttribute("href") ?? ""));
    for (const h of hrefs) seen.add(h.split("#")[0].split("?")[0] || "/");
  }
  const broken: string[] = [];
  for (const href of seen) {
    const res = await request.get(href);
    if (res.status() >= 400) broken.push(`${href} → ${res.status()}`);
  }
  expect(broken, broken.join("\n")).toEqual([]);
});

test("security headers are present", async ({ request }) => {
  const res = await request.get("/");
  const h = res.headers();
  expect(h["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(h["x-content-type-options"]).toBe("nosniff");
  expect(h["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(h["x-powered-by"]).toBeUndefined();
});
