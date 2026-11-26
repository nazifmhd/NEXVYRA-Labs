import { expect, test } from "@playwright/test";
import { prepare } from "./helpers";

/**
 * Runs with animations ON (the rest of the suite uses reduced motion).
 * Guards against reveal effects that leave content hidden for real visitors.
 */
test.use({ reducedMotion: "no-preference" });
test.beforeEach(async ({ page }) => prepare(page));

for (const route of ["/", "/services", "/about", "/industries/healthcare", "/process"]) {
  test(`every animated reveal completes on ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: "networkidle" });
    // Scroll through the page like a visitor.
    await page.evaluate(async () => {
      for (let y = 0; y <= document.documentElement.scrollHeight; y += 400) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 80));
      }
    });
    await page.waitForTimeout(1500);
    const hidden = await page.$$eval("[data-reveal]", (els) =>
      els
        .filter((el) => !(el as HTMLElement).dataset.visible && (el as HTMLElement).offsetParent !== null)
        .map((el) => (el.textContent ?? "").trim().slice(0, 60)),
    );
    expect(hidden, `Elements never revealed:\n${hidden.join("\n")}`).toEqual([]);

    // Section headings must be readable (not clipped away).
    const clipped = await page.$$eval(".scan-reveal > *", (els) =>
      els.filter((el) => getComputedStyle(el).clipPath.includes("100%")).map((el) => (el.textContent ?? "").trim().slice(0, 60)),
    );
    expect(clipped, `Headings still clipped:\n${clipped.join("\n")}`).toEqual([]);
  });
}
