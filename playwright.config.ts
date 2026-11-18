import { defineConfig, devices } from "@playwright/test";

const PORT = 3211;

export default defineConfig({
  testDir: "./e2e",
  // Admin edits mutate shared data, so run serially against one fresh database.
  fullyParallel: false,
  workers: 1,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // *.localhost already resolves to loopback; map *.test so custom domains work too.
        launchOptions: { args: ["--host-resolver-rules=MAP *.test 127.0.0.1"] },
      },
    },
  ],
  webServer: {
    // Production build against a throwaway database: also proves `next build` works.
    command: `rm -f data/e2e.db* && next build && next start --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    env: { DATABASE_PATH: "data/e2e.db" },
    reuseExistingServer: false,
    timeout: 240_000,
  },
});
