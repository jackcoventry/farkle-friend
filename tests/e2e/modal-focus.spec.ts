import { type Locator, expect, test } from '@playwright/test';
import { gotoApp } from '../helpers/navigation';

async function expectFocusedWithin(locator: Locator) {
  await expect
    .poll(async () => locator.evaluate((element) => element.contains(document.activeElement)), {
      message: 'expected focus to remain inside the dialog',
    })
    .toBe(true);
}

test('setup modal manages focus and returns it to the trigger', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await gotoApp(page, '/game/');

  const trigger = page.getByRole('button', { name: 'Setup summary' });
  await trigger.focus();
  await expect(trigger).toBeFocused();

  await trigger.click();

  const dialog = page.getByRole('dialog', { name: 'Game setup summary' });
  const closeButton = dialog.getByRole('button', {
    name: 'Close setup summary',
  });

  await expect(dialog).toBeVisible();
  await expect(closeButton).toBeFocused();

  for (let index = 0; index < 8; index += 1) {
    await page.keyboard.press('Tab');
    await expectFocusedWithin(dialog);
  }

  await closeButton.click();
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('escape closes only the top-most nested modal', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await gotoApp(page, '/game/');

  await page.getByRole('button', { name: 'Setup summary' }).click();
  const setupDialog = page.getByRole('dialog', { name: 'Game setup summary' });
  await expect(setupDialog).toBeVisible();

  await page.getByRole('button', { name: 'Preferences' }).click();
  const preferencesDialog = page.getByRole('dialog', {
    name: 'Game preferences',
  });
  await expect(preferencesDialog).toBeVisible();

  await page.keyboard.press('Escape');

  await expect(preferencesDialog).toBeHidden();
  await expect(setupDialog).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(setupDialog).toBeHidden();
});
