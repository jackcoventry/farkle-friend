import { defineConfig, devices } from '@playwright/test';

const isStaticE2E = process.env.STATIC_E2E === '1';
const port = 3100;
const host = '127.0.0.1';
const baseURL = `http://${host}:${port}`;

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  webServer: {
    command: isStaticE2E
      ? `PORT=${port} HOST=${host} npm run start`
      : `npm run dev -- --hostname ${host} --port ${port}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    url: baseURL,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
