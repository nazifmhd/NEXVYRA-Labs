import { expect, test } from "@playwright/test";
import { prepare } from "./helpers";

test.beforeEach(async ({ page }) => prepare(page));

test.describe("contact form", () => {
  test("validates each step before continuing", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByText("Select at least one area of interest")).toBeVisible();
    await page.locator("form label", { hasText: "AI Engineering" }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByRole("heading", { name: /Tell us about the project/ })).toBeVisible();
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByText(/at least 20 characters/)).toBeVisible();
  });

  test("live brief updates as the visitor answers", async ({ page }) => {
    await page.goto("/contact");
    const brief = page.getByRole("complementary", { name: "Your project brief" });
    await expect(brief).toContainText("Choose in step 1");
    await page.locator("form label", { hasText: "Intelligent Automation" }).click();
    await expect(brief).toContainText("Intelligent Automation");
  });

  test("pre-fills from goal and readiness links", async ({ page }) => {
    await page.goto("/contact?type=consultation&services=digital-innovation&brief=" + encodeURIComponent("AI readiness check: Ready (70/100)."));
    await expect(page.getByRole("radio", { name: "Consultation" })).toBeChecked();
    await expect(page.getByRole("checkbox", { name: /Digital Innovation/ })).toBeChecked();
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByLabel("Tell us about your project")).toHaveValue(/AI readiness check: Ready/);
  });

  test("submits a complete enquiry and lands on the thank-you page", async ({ page }) => {
    await page.goto("/contact");
    await page.locator("form label", { hasText: "Software Engineering" }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByLabel("Tell us about your project").fill("We need a customer portal connected to our existing CRM, launching next quarter.");
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByLabel("Full name").fill("Playwright Test");
    await page.getByLabel("Work email").fill("test@example.com");
    await page.getByRole("checkbox", { name: /privacy notice/ }).check();
    await page.getByRole("button", { name: "Send enquiry" }).click();
    await expect(page).toHaveURL(/\/thank-you$/, { timeout: 45_000 }); // first visit compiles the page in dev
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Thank you");
  });

  test("shows a recoverable error when the server fails", async ({ page }) => {
    await page.route("**/api/contact", (r) => r.fulfill({ status: 502, contentType: "application/json", body: JSON.stringify({ message: "Delivery failed (test)." }) }));
    await page.goto("/contact");
    await page.locator("form label", { hasText: "AI Engineering" }).click();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByLabel("Tell us about your project").fill("Testing the failure path of the enquiry form properly.");
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByLabel("Full name").fill("Playwright Test");
    await page.getByLabel("Work email").fill("test@example.com");
    await page.getByRole("checkbox", { name: /privacy notice/ }).check();
    await page.getByRole("button", { name: "Send enquiry" }).click();
    await expect(page.locator("form").getByRole("alert")).toContainText("Delivery failed (test).");
    await expect(page.getByLabel("Full name")).toHaveValue("Playwright Test"); // nothing lost
  });
});

test("talent pool form submits", async ({ page }) => {
  await page.goto("/careers");
  await expect(page.getByRole("heading", { name: "No open roles right now." })).toBeVisible();
  await page.getByLabel("Full name").fill("Playwright Test");
  await page.getByLabel("Email").fill("test@example.com");
  await page.getByLabel("Area of work").selectOption("software-engineering");
  await page.getByLabel(/LinkedIn, GitHub or portfolio/).fill("https://github.com/example");
  await page.getByLabel("About you").fill("I build web platforms and care about testing and documentation.");
  await page.getByRole("checkbox", { name: /privacy notice/ }).check();
  await page.getByRole("button", { name: "Join the talent pool" }).click();
  await expect(page.getByRole("status")).toContainText("You’re in the talent pool.");
});

test("readiness check produces a result and a pre-filled enquiry link", async ({ page }) => {
  await page.goto("/ai-readiness");
  for (let i = 0; i < 8; i++) {
    await page.locator("fieldset label").nth(2).click(); // third option on each question
    if (i < 7) await expect(page.getByText(`Question ${String(i + 2).padStart(2, "0")} / 08`)).toBeVisible();
  }
  await expect(page.getByText("Your readiness level")).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Ready" })).toBeVisible(); // all "C" answers = 67/100
  const cta = page.getByRole("link", { name: "Discuss my results" });
  await expect(cta).toHaveAttribute("href", /brief=AI%20readiness%20check/);
});
