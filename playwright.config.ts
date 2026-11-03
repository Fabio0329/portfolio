import { defineConfig, devices } from "@playwright/test";

const port = 3100;
const isCI = Boolean(process.env.CI);

// Page-level accessibility tests against a real production build.
// See e2e/ for the specs.
export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  reporter: isCI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${port}`,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    // WCAG 2.1 Reflow (1.4.10): content must work at 320 CSS px wide.
    {
      name: "reflow",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 320, height: 640 },
      },
    },
    {
      name: "mobile",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 375, height: 812 },
      },
    },
  ],
  webServer: {
    // SHOW_DRAFTS puts draft posts and case studies in the build, so they're
    // checked before they're published.
    command: `npm run build && npx next start -p ${port}`,
    env: { SHOW_DRAFTS: "true" },
    url: `http://localhost:${port}`,
    reuseExistingServer: !isCI,
    timeout: 180_000,
  },
});
