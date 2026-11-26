import { test } from "@playwright/test";
import { ROUTES, prepare } from "./helpers";

/** Full-page screenshots of every route at three sizes, saved to ./screenshots for visual review. */
const SIZES = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 820, height: 1180 },
  { name: "desktop", width: 1440, height: 900 },
];

for (const size of SIZES) {
  for (const route of ROUTES) {
    test(`screenshot ${size.name} ${route} @screens`, async ({ page }) => {
      await prepare(page);
      await page.setViewportSize({ width: size.width, height: size.height });
      await page.goto(route);
      await page.waitForLoadState("networkidle");
      // Let reveal-on-scroll content appear: scroll through the page once.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(400);
      const file = route === "/" ? "home" : route.slice(1).replace(/\//g, "__");
      await page.screenshot({ path: `screenshots/${size.name}/${file}.png`, fullPage: true });
    });
  }
}
