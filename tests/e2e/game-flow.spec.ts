import { expect, test } from '@playwright/test';
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

test('players can start a manual game, score turns, and reset for new players', async ({
  page,
}) => {
  await gotoApp(page, '/');

  await page.getByRole('link', { name: 'Start a game' }).click();

  await expect(page.getByRole('button', { name: 'Start', exact: true })).toBeDisabled();

  await page.getByRole('tab', { name: 'Settings' }).click();
  await page.getByRole('radio', { name: 'manual', exact: true }).check();
  await page.getByLabel('Point target').fill('500');
  await expect(page.getByRole('button', { name: 'Save' })).toBeHidden();
  await page.getByRole('tab', { name: 'Players' }).click();

  await addTwoPlayers(page);
  await expect(page.getByRole('button', { name: 'Start', exact: true })).toBeEnabled();
  await startGame(page);

  await expect(page.getByText("Ada's turn")).toBeVisible();
  await waitForTurnSplash(page, 'Ada');

  await page.getByRole('button', { name: 'Manual' }).click();
  const adaScoreDialog = page.getByRole('dialog', { name: 'Enter score for Ada' });
  await expect(adaScoreDialog).toBeVisible();
  await expect(adaScoreDialog.getByText("Enter Ada's total round score")).toBeVisible();
  const adaScoreInput = adaScoreDialog.getByLabel('Turn score');
  await expect(adaScoreInput).toHaveAttribute('type', 'text');
  await expect(adaScoreInput).toHaveAttribute('inputmode', 'numeric');
  await adaScoreInput.fill('50');
  await adaScoreDialog.getByRole('button', { name: 'Submit score' }).click();

  await expectTurnResult(page, 'Grace');
  await startNextTurn(page);

  await waitForTurnSplash(page, 'Grace');

  await enterManualScore(page, '500');
  await expect(page.getByRole('dialog', { name: 'Game finished' })).toBeVisible();
  await expect(page.getByText('Grace wins!')).toBeVisible();

  await page.getByRole('button', { name: 'New players' }).click();
  await expect(page.getByRole('heading', { name: 'Add player' })).toBeVisible();
});

test('mobile manual scoring keeps dice readable and entry tied to the active player', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await gotoApp(page, '/game/');
  await page.getByRole('tab', { name: 'Settings' }).click();
  await page.getByRole('radio', { name: 'manual', exact: true }).check();
  await page.getByRole('tab', { name: 'Players' }).click();

  await addPlayersAndStartGame(page);
  await waitForTurnSplash(page, 'Ada');

  const firstDie = page.getByRole('button', { name: 'Add die showing 1' });
  const firstDieBox = await firstDie.boundingBox();
  expect(firstDieBox?.width).toBeGreaterThanOrEqual(72);
  expect(firstDieBox?.height).toBeGreaterThanOrEqual(72);

  const mobileDiceLayout = await page.locator('.manual-score-panel__scroll').evaluate((panel) => {
    const diceGrid = panel.querySelector('.score-generator__dice-grid');
    return {
      diceGridClientWidth: diceGrid?.clientWidth ?? 0,
      diceGridScrollWidth: diceGrid?.scrollWidth ?? 0,
      panelClientHeight: panel.clientHeight,
      panelClientWidth: panel.clientWidth,
      panelScrollHeight: panel.scrollHeight,
      panelScrollWidth: panel.scrollWidth,
    };
  });
  expect(mobileDiceLayout.diceGridScrollWidth).toBeLessThanOrEqual(
    mobileDiceLayout.diceGridClientWidth
  );
  expect(mobileDiceLayout.panelScrollWidth).toBeLessThanOrEqual(mobileDiceLayout.panelClientWidth);
  expect(mobileDiceLayout.panelScrollHeight).toBeLessThanOrEqual(
    mobileDiceLayout.panelClientHeight
  );

  await page.getByRole('button', { name: 'Manual' }).click();
  const scoreDialog = page.getByRole('dialog', { name: 'Enter score for Ada' });
  await expect(scoreDialog).toBeVisible();
  await expect(scoreDialog.getByText("Enter Ada's total round score")).toBeVisible();
});

test('desktop manual scoring shows all dice without horizontal scrolling', async ({ page }) => {
  await gotoApp(page, '/game/');
  await page.getByRole('tab', { name: 'Settings' }).click();
  await page.getByRole('radio', { name: 'manual', exact: true }).check();
  await page.getByRole('tab', { name: 'Players' }).click();

  await addPlayersAndStartGame(page);
  await waitForTurnSplash(page, 'Ada');

  const diceLayout = await page.locator('.score-generator__dice-grid').evaluate((grid) => {
    const gridBox = grid.getBoundingClientRect();
    const dice = [...grid.querySelectorAll('button')].map((button) => {
      const box = button.getBoundingClientRect();
      return {
        bottom: box.bottom,
        height: box.height,
        left: box.left,
        right: box.right,
        top: box.top,
        width: box.width,
      };
    });

    return {
      dice,
      grid: {
        bottom: gridBox.bottom,
        left: gridBox.left,
        right: gridBox.right,
        top: gridBox.top,
      },
      scrollWidth: grid.scrollWidth,
      width: grid.clientWidth,
    };
  });

  expect(diceLayout.dice).toHaveLength(6);
  expect(diceLayout.scrollWidth).toBeLessThanOrEqual(diceLayout.width);
  const diceByRow = diceLayout.dice.reduce<number[]>((rows, die) => {
    const existingRowIndex = rows.findIndex((rowTop) => Math.abs(rowTop - die.top) < 2);
    if (existingRowIndex === -1) {
      return [...rows, die.top];
    }

    return rows;
  }, []);
  const rowCounts = diceByRow.map(
    (rowTop) => diceLayout.dice.filter((die) => Math.abs(rowTop - die.top) < 2).length
  );
  expect(rowCounts).toEqual(rowCounts.length === 1 ? [6] : [3, 3]);
  for (const die of diceLayout.dice) {
    expect(die.width).toBeGreaterThanOrEqual(72);
    expect(die.height).toBeGreaterThanOrEqual(72);
    expect(die.left).toBeGreaterThanOrEqual(diceLayout.grid.left);
    expect(die.right).toBeLessThanOrEqual(diceLayout.grid.right);
  }
});

test('lobby setup tabs support keyboard navigation', async ({ page }) => {
  await gotoApp(page, '/game/');

  await page.getByRole('tab', { name: 'Players' }).focus();
  await page.keyboard.press('ArrowRight');

  await expect(page.getByRole('tab', { name: 'Settings' })).toBeFocused();
  await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();

  await page.keyboard.press('ArrowLeft');

  await expect(page.getByRole('tab', { name: 'Players' })).toBeFocused();
  await expect(page.getByRole('heading', { name: 'Add player' })).toBeVisible();
});

test('auto-advance setting moves to the next player after a turn result', async ({ page }) => {
  await gotoApp(page, '/game/');
  await page.getByRole('tab', { name: 'Settings' }).click();
  await page.getByRole('radio', { name: 'manual', exact: true }).check();
  await page.getByLabel('Auto').check();
  await page.getByRole('tab', { name: 'Players' }).click();

  await addPlayersAndStartGame(page);
  await waitForTurnSplash(page, 'Ada');

  await enterManualScore(page, '50');
  await expect(page.getByText('Advancing automatically in')).toBeVisible();
  await expect(page.getByRole('dialog', { name: "Grace's turn" })).toBeVisible({ timeout: 5000 });
});

test('sound and animation preferences can be changed during a game', async ({ page }) => {
  await gotoApp(page, '/game/');
  await page.getByRole('tab', { name: 'Settings' }).click();
  await page.getByRole('radio', { name: 'manual', exact: true }).check();
  await page.getByRole('tab', { name: 'Players' }).click();

  await addPlayersAndStartGame(page);
  await waitForTurnSplash(page, 'Ada');

  await page.getByRole('button', { name: 'Preferences' }).click();
  const dialog = page.getByRole('dialog', { name: 'Game preferences' });
  await expect(dialog).toBeVisible();

  await dialog.locator('#preferenceSound_off').check();
  await dialog.locator('#preferenceMotion_off').check();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'off');

  await dialog.getByRole('button', { name: 'Close preferences' }).click();
  await expect(page.getByRole('button', { name: 'Manual' })).toBeVisible();
});

test('mobile setup sidebar opens in a modal', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await gotoApp(page, '/game/');

  await expect(page.getByRole('dialog', { name: 'Game setup summary' })).toBeHidden();

  await page.getByRole('button', { name: 'Setup summary' }).click();
  const dialog = page.getByRole('dialog', { name: 'Game setup summary' });

  await expect(dialog).toBeVisible();
  await expect(dialog.getByText('No players yet')).toBeVisible();
  await dialog.getByRole('button', { name: 'Close setup summary' }).click();
  await expect(dialog).toBeHidden();
});

test('short mobile dice layout keeps dice inside a larger board', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 692 });
  await page.addInitScript(() => {
    const rolls = [0, 0.18, 0.36, 0.54, 0.72, 0.9];
    let index = 0;
    window.__FARKLE_DICE_RANDOM__ = () => {
      const value = rolls[index % rolls.length];
      index += 1;
      return value;
    };
  });

  await gotoApp(page, '/game/');
  await addTwoPlayers(page);
  await startGame(page);
  await waitForTurnSplash(page, 'Ada');
  await page.getByRole('button', { name: 'Roll dice' }).click();

  const boardBox = await page.locator('.dice-turn-table').boundingBox();
  expect(boardBox?.height).toBeGreaterThan(240);

  const dice = await page.getByRole('button', { name: /Select die/ }).all();
  for (const die of dice) {
    const dieBox = await die.boundingBox();
    expect(dieBox?.y).toBeGreaterThanOrEqual(boardBox!.y);
    expect((dieBox!.y ?? 0) + (dieBox!.height ?? 0)).toBeLessThanOrEqual(
      boardBox!.y + boardBox!.height
    );
  }
});

test('short tablet dice layout keeps controls below the board', async ({ page }) => {
  await page.setViewportSize({ width: 820, height: 550 });
  await page.addInitScript(() => {
    const rolls = [0, 0.18, 0.36, 0.54, 0.72, 0.9];
    let index = 0;
    window.__FARKLE_DICE_RANDOM__ = () => {
      const value = rolls[index % rolls.length];
      index += 1;
      return value;
    };
  });

  await gotoApp(page, '/game/');
  await addTwoPlayers(page);
  await startGame(page);
  await waitForTurnSplash(page, 'Ada');
  await page.getByRole('button', { name: 'Roll dice' }).click();

  const boardBox = await page.locator('.dice-turn-table').boundingBox();
  const controlsBox = await page.locator('.turn-action-cluster').boundingBox();
  expect(boardBox?.height).toBeGreaterThanOrEqual(300);
  expect(controlsBox?.height).toBeGreaterThanOrEqual(56);
  expect(controlsBox?.y).toBeGreaterThanOrEqual((boardBox?.y ?? 0) + (boardBox?.height ?? 0));

  const dice = await page.getByRole('button', { name: /Select die/ }).all();
  for (const die of dice) {
    const dieBox = await die.boundingBox();
    expect(dieBox?.y).toBeGreaterThanOrEqual(boardBox!.y);
    expect((dieBox!.y ?? 0) + (dieBox!.height ?? 0)).toBeLessThanOrEqual(
      boardBox!.y + boardBox!.height
    );
  }
});

test('mid-height tablet dice layout keeps full controls visible', async ({ page }) => {
  await page.setViewportSize({ width: 1200, height: 750 });
  await page.addInitScript(() => {
    const rolls = [0, 0.18, 0.36, 0.54, 0.72, 0.9];
    let index = 0;
    window.__FARKLE_DICE_RANDOM__ = () => {
      const value = rolls[index % rolls.length];
      index += 1;
      return value;
    };
  });

  await gotoApp(page, '/game/');
  await addTwoPlayers(page);
  await startGame(page);
  await waitForTurnSplash(page, 'Ada');
  await page.getByRole('button', { name: 'Roll dice' }).click();

  const bodyBox = await page.locator('.game-shell__body').boundingBox();
  const controlsBox = await page.locator('.turn-action-cluster').boundingBox();
  const endTurnBox = await page.getByRole('button', { name: 'End' }).boundingBox();

  expect(controlsBox?.height).toBeGreaterThanOrEqual(56);
  expect(endTurnBox?.height).toBeGreaterThanOrEqual(48);
  expect((endTurnBox?.y ?? 0) + (endTurnBox?.height ?? 0)).toBeLessThanOrEqual(
    (bodyBox?.y ?? 0) + (bodyBox?.height ?? 0)
  );
});

test('active game menu modal fits within a short viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 692 });
  await gotoApp(page, '/game/');
  await addTwoPlayers(page);
  await startGame(page);
  await waitForTurnSplash(page, 'Ada');

  await page.getByRole('button', { name: 'Game menu' }).click();
  const dialog = page.getByRole('dialog', { name: 'Game menu' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Close game menu' })).toBeVisible();

  const dialogBox = await dialog.boundingBox();
  expect(dialogBox?.y).toBeGreaterThanOrEqual(0);
  expect((dialogBox?.y ?? 0) + (dialogBox?.height ?? 0)).toBeLessThanOrEqual(692);
});
