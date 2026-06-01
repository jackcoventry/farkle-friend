import type { Page } from '@playwright/test';

export async function gotoApp(page: Page, url: string) {
  await page.goto(url);
  await page.locator('html[data-app-ready="true"]').waitFor();
}
