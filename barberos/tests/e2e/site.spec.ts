import { expect, test } from "@playwright/test";

test("document is Hebrew, right-to-left, with a single h1", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "he");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.locator("h1")).toHaveCount(1);
});

test("skip link is the first tab stop and moves focus to main", async ({ page, isMobile }) => {
  test.skip(isMobile, "keyboard flow tested on desktop");
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "דילוג לתוכן הראשי" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press("Enter");
  await expect(page.locator("main#main")).toBeFocused();
});

test("services and prices come from the database", async ({ page }) => {
  await page.goto("/services");
  await expect(page.getByRole("heading", { level: 3, name: "תספורת גבר" })).toBeVisible();
  await expect(page.getByText(/50\s*.?₪/).first()).toBeVisible();
});

test("every page offers a booking path", async ({ page }) => {
  for (const route of ["/", "/services", "/about", "/visit"]) {
    await page.goto(route);
    await expect(page.getByRole("link", { name: "קביעת תור" }).first()).toBeVisible();
  }
});

test("mobile menu opens, closes with Escape and returns focus", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile-only control");
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "תפריט" });
  await toggle.click();
  await expect(page.getByRole("button", { name: "סגירה" })).toHaveAttribute(
    "aria-expanded",
    "true",
  );
  const menu = page.getByRole("navigation", { name: "ראשי" });
  await expect(menu.getByRole("link", { name: "הסיפור" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "תפריט" })).toBeFocused();
  await expect(page.getByRole("button", { name: "תפריט" })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
});

test("unknown routes return 404 with a way home", async ({ page }) => {
  const res = await page.goto("/does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("link", { name: "חזרה לדף הבית" })).toBeVisible();
});

test("security headers are present", async ({ request }) => {
  const res = await request.get("/");
  const h = res.headers();
  expect(h["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(h["x-content-type-options"]).toBe("nosniff");
  expect(h["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(h["x-powered-by"]).toBeUndefined();
});

test("health endpoint reports database status", async ({ request }) => {
  const res = await request.get("/api/health");
  expect(res.status()).toBe(200);
  expect(await res.json()).toEqual({ status: "ok" });
});
