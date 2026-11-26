import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end tests run in the locally installed Microsoft Edge (no browser
 * download needed). Start the app first (`npm run dev`) or let Playwright do it.
 *
 *   npm test                 # functional + accessibility + links
 *   npm run test:screens     # full-page screenshots into ./screenshots
 */
const BASE = process.env.E2E_BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 90_000,
  expect: { timeout: 15_000 },
  fullyParallel: true,
  workers: 3,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: BASE,
    channel: "msedge",
    trace: "retain-on-failure",
    reducedMotion: "reduce",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Edge"], channel: "msedge", viewport: { width: 1440, height: 900 } }, grepInvert: /@screens|@mobile/ },
    { name: "mobile", use: { channel: "msedge", viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }, grep: /@mobile/ },
    { name: "screens", use: { channel: "msedge" }, grep: /@screens/ },
  ],
  webServer: {
    command: "npm run dev",
    url: BASE,
    reuseExistingServer: true,
    timeout: 180_000,
  },
});
