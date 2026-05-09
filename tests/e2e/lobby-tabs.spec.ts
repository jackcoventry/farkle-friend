import { expect, test } from '@playwright/test';

test('lobby tabs support roving tabindex + arrow/Home/End navigation', async ({ page }) => {
  await page.goto('/game/');

  const tablist = page.getByRole('tablist', { name: 'Game setup' });
  const playersTab = tablist.getByRole('tab', { name: 'Players' });
  const settingsTab = tablist.getByRole('tab', { name: 'Settings' });

  await expect(playersTab).toHaveAttribute('aria-selected', 'true');
  await expect(playersTab).toHaveAttribute('tabindex', '0');
  await expect(settingsTab).toHaveAttribute('aria-selected', 'false');
  await expect(settingsTab).toHaveAttribute('tabindex', '-1');

  await playersTab.focus();
  await expect(playersTab).toBeFocused();

  await page.keyboard.press('ArrowRight');
  await expect(settingsTab).toBeFocused();
  await expect(settingsTab).toHaveAttribute('aria-selected', 'true');
  await expect(settingsTab).toHaveAttribute('tabindex', '0');
  await expect(playersTab).toHaveAttribute('aria-selected', 'false');
  await expect(playersTab).toHaveAttribute('tabindex', '-1');

  await page.keyboard.press('Home');
  await expect(playersTab).toBeFocused();
  await expect(playersTab).toHaveAttribute('aria-selected', 'true');

  await page.keyboard.press('End');
  await expect(settingsTab).toBeFocused();
  await expect(settingsTab).toHaveAttribute('aria-selected', 'true');

  // Panel wiring stays consistent with aria-controls
  const settingsPanelId = await settingsTab.getAttribute('aria-controls');
  expect(settingsPanelId).toBeTruthy();
  await expect(page.locator(`#${settingsPanelId}`)).toBeVisible();

  const playersPanelId = await playersTab.getAttribute('aria-controls');
  expect(playersPanelId).toBeTruthy();
  await page.keyboard.press('ArrowLeft');
  await expect(playersTab).toBeFocused();
  await expect(page.locator(`#${playersPanelId}`)).toBeVisible();
});

