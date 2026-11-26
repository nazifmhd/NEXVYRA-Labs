import { expect, test } from "@playwright/test";
import { prepare } from "./helpers";

/** The assistant API is mocked here, so these tests cost nothing. Quality is covered by `npm run eval:assistant`. */
test.beforeEach(async ({ page }) => {
  await prepare(page);
  await page.route("**/api/assistant", (route) =>
    route.fulfill({
      status: 200,
      contentType: "text/plain; charset=utf-8",
      body: "We offer four services:\n\n- AI Engineering (/services/ai-engineering)\n- Software Engineering (/services/software-engineering)\n\nFor a specific project, use /contact.",
    }),
  );
});

test("assistant opens, answers, shows sources, handoff and follow-ups", async ({ page }) => {
  await page.goto("/");
  const launcher = page.getByRole("button", { name: "Open the NEXVYRA assistant" });
  test.skip((await launcher.count()) === 0, "Assistant disabled (no ANTHROPIC_API_KEY on the server)");

  await launcher.click();
  const panel = page.getByRole("dialog", { name: "NEXVYRA website assistant" });
  await expect(panel).toBeVisible();
  await expect(panel.getByRole("textbox", { name: "Your question" })).toBeFocused();

  await panel.getByRole("button", { name: /Services/ }).first().click();
  await expect(panel.getByText("We offer four services:")).toBeVisible();
  await expect(panel.getByText("Referenced pages")).toBeVisible();
  await expect(panel.getByRole("link", { name: /^AI Engineering$/ }).last()).toHaveAttribute("href", "/services/ai-engineering");
  await expect(panel.getByRole("link", { name: /Talk to a person/ }).first()).toBeVisible();
  await expect(panel.getByText("Ask next")).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
  await expect(launcher).toBeFocused();
});
