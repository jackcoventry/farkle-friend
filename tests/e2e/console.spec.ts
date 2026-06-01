import { expect, test } from '@playwright/test';
import { collectBrowserConsoleIssues } from '../helpers/console';
import { addTwoPlayers, startGame, waitForTurnSplash } from '../helpers/game';
import { gotoApp } from '../helpers/navigation';

test('core game screens do not emit browser console issues', async ({ page }) => {
  const consoleIssues = collectBrowserConsoleIssues(page);

  await page.setViewportSize({ width: 390, height: 844 });
  await gotoApp(page, '/game/');
  await page.getByRole('button', { name: 'Setup summary' }).click();

  const setupDialog = page.getByRole('dialog', { name: 'Game setup summary' });
  await expect(setupDialog.getByRole('button', { name: 'Close setup summary' })).toBeVisible();

  await page.getByRole('button', { name: 'View rules and scoring' }).click();
  const rulesDialog = page.getByRole('dialog', {
    name: 'Game rules and scoring',
  });
  await expect(rulesDialog.getByRole('button', { name: 'Close rules and scoring' })).toBeVisible();
  await page.getByRole('button', { name: 'Close rules and scoring' }).click();

  await page.getByRole('button', { name: 'Preferences' }).click();
  const preferencesDialog = page.getByRole('dialog', {
    name: 'Game preferences',
  });
  await expect(preferencesDialog.getByRole('button', { name: 'Close preferences' })).toBeVisible();
  await page.getByRole('button', { name: 'Close preferences' }).click();

  await page.getByRole('button', { name: 'Close setup summary' }).click();
  await addTwoPlayers(page);
  await startGame(page);
  await waitForTurnSplash(page, 'Ada');
  await page.getByRole('button', { name: 'Game menu' }).click();
  await page.getByRole('button', { name: 'Close game menu' }).click();

  expect(consoleIssues).toEqual([]);
});
