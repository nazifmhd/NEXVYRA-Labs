import { expect, test } from "@playwright/test";
import { ROUTES, prepare, watchErrors } from "./helpers";

test.beforeEach(async ({ page }) => prepare(page));

for (const route of ROUTES) {
  test(`renders ${route}`, async ({ page }) => {
    const errors = watchErrors(page);
    const res = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(res?.status(), "HTTP status").toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toBeVisible();
    expect(await page.title()).toMatch(/NEXVYRA Labs/);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(route === "/thank-you" ? 1 : 1);
    await page.waitForLoadState("networkidle");
    expect(errors, errors.join("\n")).toEqual([]);
  });
}

test("unknown routes return the custom 404", async ({ page }) => {
  const res = await page.goto("/this-page-does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("isn’t part of the system");
});

test("no horizontal overflow on key pages @mobile", async ({ page }) => {
  await prepare(page);
  for (const route of ["/", "/contact", "/services/ai-engineering", "/ai-readiness", "/insights/rag-that-holds-up-in-production"]) {
    await page.goto(route);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `${route} overflows horizontally by ${overflow}px`).toBeLessThanOrEqual(1);
  }
});
