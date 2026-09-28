import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 2,
  // The target is a single shared public demo, not a per-run environment: at 4
  // workers the suite was DoS-ing itself and login navigations timed out at 45s
  // even though the site answers in well under a second when left alone.
  workers: process.env.CI ? 1 : 2,
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],
  // The public demo answers in ~5s per request, and every test logs in from
  // scratch first, which alone eats 30-40s. Tests that then walk through
  // several pages need the rest of this budget.
  timeout: 120000,
  expect: {
    timeout: 10000,
  },
  use: {
    baseURL: process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15000,
    // The shared demo intermittently stalls well past 30s on a cold page load.
    navigationTimeout: 45000,


    
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Uncomment to run on additional browsers:
    // npx playwright test --project=firefox --project=webkit
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
});
