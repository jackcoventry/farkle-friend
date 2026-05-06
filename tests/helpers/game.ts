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

export async function waitForTurnSplash(page: Page, playerName: string) {
  await expect(page.getByRole('dialog', { name: `${playerName}'s turn` })).toBeVisible();
  await page.waitForTimeout(2100);
}
