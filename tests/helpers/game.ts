import { type Page, expect } from '@playwright/test';

export async function addTwoPlayers(page: Page) {
  await page.getByLabel('Player name').fill('Ada');
  await page.getByRole('button', { name: 'Add' }).click();
  await page.getByLabel('Player name').fill('Grace');
  await page.getByLabel('Avatar Hot dog').check();
  await page.getByRole('button', { name: 'Add' }).click();
}

export async function openSidebarIfNeeded(page: Page) {
  const toggle = page.getByRole('button', { name: 'Open sidebar' });
  if (await toggle.isVisible()) {
    await toggle.click();
  }
}

export async function startGame(page: Page) {
  await page.getByRole('button', { name: 'Start game' }).click();
}

export async function addPlayersAndStartGame(page: Page) {
  await addTwoPlayers(page);
  await startGame(page);
}

export async function enterManualScore(page: Page, score: string) {
  await page.getByRole('button', { name: 'Manual' }).click();
  await page.getByLabel('Turn score').fill(score);
  await page.getByRole('button', { name: 'Submit score' }).click();
}

export async function expectTurnResult(page: Page, nextPlayerName: string) {
  await expect(page.getByText('New total')).toBeVisible();
  await expect(page.getByText(`${nextPlayerName} is up next!`)).toBeVisible();
}

export async function startNextTurn(page: Page) {
  await page.getByRole('button', { name: 'Start turn' }).click();
}

export async function waitForTurnSplash(page: Page, playerName: string) {
  await expect(page.getByRole('dialog', { name: `${playerName}'s turn` })).toBeVisible();
  await page.waitForTimeout(2100);
}
