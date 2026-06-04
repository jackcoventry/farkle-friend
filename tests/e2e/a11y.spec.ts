import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import {
  addPlayersAndStartGame,
  addTwoPlayers,
  enterManualScore,
  expectTurnResult,
  startGame,
  startNextTurn,
  waitForTurnSplash,
} from '../helpers/game';
import { gotoApp } from '../helpers/navigation';

async function expectNoA11yViolations(page: Page) {
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
}

test('lobby has no detectable accessibility violations', async ({ page }) => {
  await gotoApp(page, '/game/');
  await expect(page.getByRole('heading', { name: 'Add player' })).toBeVisible();

  await expectNoA11yViolations(page);
});

test('active dice turn has no detectable accessibility violations', async ({ page }) => {
  await gotoApp(page, '/game/');
  await addPlayersAndStartGame(page);
  await waitForTurnSplash(page, 'Ada');

  await page.getByRole('button', { name: 'Roll dice' }).click();
  await expect(page.getByRole('status')).toContainText('Rolled');

  await expectNoA11yViolations(page);
});

test('turn result and finished modal have no detectable accessibility violations', async ({
  page,
}) => {
  await gotoApp(page, '/game/');
  await page.getByRole('tab', { name: 'Settings' }).click();
  await page.getByRole('radio', { name: 'manual', exact: true }).check();
  await page.getByLabel('Point target').fill('500');
  await page.getByRole('button', { name: 'Save' }).click();

  await addTwoPlayers(page);
  await startGame(page);
  await waitForTurnSplash(page, 'Ada');

  await enterManualScore(page, '50');
  await expectTurnResult(page, 'Grace');
  const resultPanel = page.getByRole('region', { name: 'Turn complete' });

  await expect(resultPanel).toBeFocused();
  await expect(resultPanel).not.toHaveAttribute('aria-live');
  await expectNoA11yViolations(page);

  await startNextTurn(page);
  await waitForTurnSplash(page, 'Grace');
  await enterManualScore(page, '500');
  await expect(page.getByRole('dialog', { name: 'Game finished' })).toBeVisible();
  await expectNoA11yViolations(page);
});

test('confirmation modal has no detectable accessibility violations', async ({ page }) => {
  await gotoApp(page, '/game/');
  await addPlayersAndStartGame(page);
  await waitForTurnSplash(page, 'Ada');

  await page.getByRole('button', { name: 'Quit to setup' }).click();
  await expect(page.getByRole('dialog', { name: 'Quit this game?' })).toBeVisible();

  await expectNoA11yViolations(page);
});
