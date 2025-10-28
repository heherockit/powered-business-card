import { defineConfig, devices } from '@playwright/test'

const baseURL = process.env.WEBAPP_URL || 'http://localhost:5174'

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
})