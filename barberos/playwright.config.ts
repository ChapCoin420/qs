import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.E2E_PORT ?? 3100);
// The sandbox ships a pinned Chromium; CI can leave this unset to use Playwright's own.
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${port}`,
    locale: "he-IL",
    launchOptions: { executablePath },
  },
  projects: [
    { name: "mobile", use: { ...devices["Pixel 7"], launchOptions: { executablePath } } },
    { name: "desktop", use: { ...devices["Desktop Chrome"], launchOptions: { executablePath } } },
  ],
  webServer: {
    command: `pnpm start -p ${port}`,
    port,
    reuseExistingServer: !process.env.CI,
  },
});
