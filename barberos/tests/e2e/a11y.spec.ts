import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/services",
  "/about",
  "/visit",
  "/accessibility",
  "/privacy",
  "/does-not-exist",
];

for (const route of routes) {
  test(`no axe violations (WCAG 2.x A/AA) on ${route}`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"])
      .analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });
}

test("FAQ open state has no violations", async ({ page }) => {
  await page.goto("/services");
  await page.locator("summary").first().click();
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});
