import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import {
  addPlayersAndStartGame,
  addTwoPlayers,
  startGame,
  waitForTurnSplash,
} from '../helpers/game';

async function expectNoA11yViolations(page: Parameters<typeof AxeBuilder>[0]) {
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
}

test('lobby has no detectable accessibility violations', async ({ page }) => {
  await page.goto('/game/');
  await expect(page.getByRole('heading', { name: 'Add player' })).toBeVisible();

  await expectNoA11yViolations(page);
});

test('active dice turn has no detectable accessibility violations', async ({ page }) => {
  await page.goto('/game/');
  await addPlayersAndStartGame(page);
  await waitForTurnSplash(page, 'Ada');

  await expectNoA11yViolations(page);
});

test('turn result and finished modal have no detectable accessibility violations', async ({
  page,
}) => {
  await page.goto('/game/');
  await page.getByRole('tab', { name: 'Settings' }).click();
  await page.getByRole('radio', { name: 'manual', exact: true }).check();
  await page.getByLabel('Point target').fill('500');
  await page.getByRole('button', { name: 'Save' }).click();

  await addTwoPlayers(page);
  await startGame(page);
  await waitForTurnSplash(page, 'Ada');

  await page.getByLabel('Turn score').fill('50');
  await page.getByRole('button', { name: 'Submit score' }).click();
  await expect(page.getByText('Next up: Grace.')).toBeVisible();
  await expectNoA11yViolations(page);

  await page.getByRole('button', { name: 'Next player' }).click();
  await waitForTurnSplash(page, 'Grace');
  await page.getByLabel('Turn score').fill('500');
  await page.getByRole('button', { name: 'Submit score' }).click();
  await expect(page.getByRole('dialog', { name: 'Game finished' })).toBeVisible();
  await expectNoA11yViolations(page);
});

test('confirmation modal has no detectable accessibility violations', async ({ page }) => {
  await page.goto('/game/');
  await addPlayersAndStartGame(page);
  await waitForTurnSplash(page, 'Ada');

  await page.getByRole('button', { name: 'Quit to setup' }).click();
  await expect(page.getByRole('dialog', { name: 'Quit this game?' })).toBeVisible();

  await expectNoA11yViolations(page);
});
