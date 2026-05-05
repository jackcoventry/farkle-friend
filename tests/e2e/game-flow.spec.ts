import { expect, test } from "@playwright/test";
import {
  addPlayersAndStartGame,
  addTwoPlayers,
  startGame,
  waitForTurnSplash,
} from "../helpers/game";

test("players can start a manual game, score turns, and reset for new players", async ({
  page,
}) => {
  await page.goto("/");

  await page.getByRole("link", { name: "Start Game" }).click();

  await expect(page.getByRole("button", { name: "Start game" })).toBeDisabled();
  await expect(
    page
      .locator(".lobby-start-panel")
      .getByText("Add at least two players to start."),
  ).toBeVisible();

  await page.getByRole("tab", { name: "Settings" }).click();
  await page.getByRole("radio", { name: "manual", exact: true }).check();
  await page.getByLabel("Point target").fill("500");
  await page.getByRole("button", { name: "Save" }).click();

  await addTwoPlayers(page);
  await expect(
    page.locator(".lobby-start-panel").getByText("2 players · Manual scoring"),
  ).toBeVisible();
  await startGame(page);

  await expect(page.getByText("Ada's turn")).toBeVisible();
  await waitForTurnSplash(page, "Ada");

  await page.getByLabel("Turn score").fill("50");
  await page.getByRole("button", { name: "Submit score" }).click();
  await expect(page.getByText("New total")).toBeVisible();
  await expect(page.getByText("Next up: Grace.")).toBeVisible();
  await page.getByRole("button", { name: "Next player" }).click();

  await waitForTurnSplash(page, "Grace");

  await page.getByLabel("Turn score").fill("500");
  await page.getByRole("button", { name: "Submit score" }).click();
  await expect(page.getByRole("dialog", { name: "Game finished" })).toBeVisible();
  await expect(page.getByText("Grace wins!")).toBeVisible();

  await page.getByRole("button", { name: "New players" }).click();
  await expect(page.getByRole("heading", { name: "Add player" })).toBeVisible();
});

test("lobby setup tabs support keyboard navigation", async ({ page }) => {
  await page.goto("/game/");

  await page.getByRole("tab", { name: "Players" }).focus();
  await page.keyboard.press("ArrowRight");

  await expect(page.getByRole("tab", { name: "Settings" })).toBeFocused();
  await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();

  await page.keyboard.press("ArrowLeft");

  await expect(page.getByRole("tab", { name: "Players" })).toBeFocused();
  await expect(page.getByRole("heading", { name: "Add player" })).toBeVisible();
});

test("auto-advance setting moves to the next player after a turn result", async ({
  page,
}) => {
  await page.goto("/game/");
  await page.getByRole("tab", { name: "Settings" }).click();
  await page.getByRole("radio", { name: "manual", exact: true }).check();
  await page.getByLabel("Auto").check();
  await page.getByRole("button", { name: "Save" }).click();

  await addPlayersAndStartGame(page);
  await waitForTurnSplash(page, "Ada");

  await page.getByLabel("Turn score").fill("50");
  await page.getByRole("button", { name: "Submit score" }).click();
  await expect(page.getByText("Advancing automatically in")).toBeVisible();
  await expect(
    page.getByRole("dialog", { name: "Grace's turn" })
  ).toBeVisible({ timeout: 5000 });
});

test("sound and animation preferences can be changed during a game", async ({
  page,
}) => {
  await page.goto("/game/");
  await page.getByRole("tab", { name: "Settings" }).click();
  await page.getByRole("radio", { name: "manual", exact: true }).check();
  await page.getByRole("button", { name: "Save" }).click();

  await addPlayersAndStartGame(page);
  await waitForTurnSplash(page, "Ada");

  await page.getByRole("button", { name: "Preferences" }).click();
  const dialog = page.getByRole("dialog", { name: "Game preferences" });
  await expect(dialog).toBeVisible();

  await dialog.locator("#preferenceSound_off").check();
  await dialog.locator("#preferenceMotion_off").check();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "off");

  await dialog.getByRole("button", { name: "Close preferences" }).click();
  await expect(page.getByLabel("Turn score")).toBeVisible();
});

test("mobile setup sidebar opens in a modal", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/game/");

  await expect(page.getByRole("dialog", { name: "Game setup summary" })).toBeHidden();

  await page.getByRole("button", { name: "Setup summary" }).click();
  const dialog = page.getByRole("dialog", { name: "Game setup summary" });

  await expect(dialog).toBeVisible();
  await expect(dialog.getByText("No players yet")).toBeVisible();
  await dialog.getByRole("button", { name: "Close setup summary" }).click();
  await expect(dialog).toBeHidden();
});

test("short mobile dice layout keeps dice inside a larger board", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 692 });
  await page.addInitScript(() => {
    const rolls = [0, 0.18, 0.36, 0.54, 0.72, 0.9];
    let index = 0;
    Math.random = () => {
      const value = rolls[index % rolls.length];
      index += 1;
      return value;
    };
  });

  await page.goto("/game/");
  await addTwoPlayers(page);
  await startGame(page);
  await waitForTurnSplash(page, "Ada");
  await page.getByRole("button", { name: "Roll dice" }).click();

  const boardBox = await page.locator(".dice-turn-table").boundingBox();
  expect(boardBox?.height).toBeGreaterThan(240);

  const dice = await page.getByRole("button", { name: /Select die/ }).all();
  for (const die of dice) {
    const dieBox = await die.boundingBox();
    expect(dieBox?.y).toBeGreaterThanOrEqual(boardBox!.y);
    expect((dieBox!.y ?? 0) + (dieBox!.height ?? 0)).toBeLessThanOrEqual(
      boardBox!.y + boardBox!.height,
    );
  }
});

test("short tablet dice layout keeps controls below the board", async ({
  page,
}) => {
  await page.setViewportSize({ width: 820, height: 550 });
  await page.addInitScript(() => {
    const rolls = [0, 0.18, 0.36, 0.54, 0.72, 0.9];
    let index = 0;
    Math.random = () => {
      const value = rolls[index % rolls.length];
      index += 1;
      return value;
    };
  });

  await page.goto("/game/");
  await addTwoPlayers(page);
  await startGame(page);
  await waitForTurnSplash(page, "Ada");
  await page.getByRole("button", { name: "Roll dice" }).click();

  const boardBox = await page.locator(".dice-turn-table").boundingBox();
  const controlsBox = await page.locator(".turn-action-cluster").boundingBox();
  expect(boardBox?.height).toBeGreaterThanOrEqual(300);
  expect(controlsBox?.height).toBeGreaterThanOrEqual(56);
  expect(controlsBox?.y).toBeGreaterThanOrEqual(
    (boardBox?.y ?? 0) + (boardBox?.height ?? 0),
  );

  const dice = await page.getByRole("button", { name: /Select die/ }).all();
  for (const die of dice) {
    const dieBox = await die.boundingBox();
    expect(dieBox?.y).toBeGreaterThanOrEqual(boardBox!.y);
    expect((dieBox!.y ?? 0) + (dieBox!.height ?? 0)).toBeLessThanOrEqual(
      boardBox!.y + boardBox!.height,
    );
  }
});

test("mid-height tablet dice layout keeps full controls visible", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1200, height: 750 });
  await page.addInitScript(() => {
    const rolls = [0, 0.18, 0.36, 0.54, 0.72, 0.9];
    let index = 0;
    Math.random = () => {
      const value = rolls[index % rolls.length];
      index += 1;
      return value;
    };
  });

  await page.goto("/game/");
  await addTwoPlayers(page);
  await startGame(page);
  await waitForTurnSplash(page, "Ada");
  await page.getByRole("button", { name: "Roll dice" }).click();

  const bodyBox = await page.locator(".game-shell__body").boundingBox();
  const controlsBox = await page.locator(".turn-action-cluster").boundingBox();
  const endTurnBox = await page
    .getByRole("button", { name: "End turn" })
    .boundingBox();

  expect(controlsBox?.height).toBeGreaterThanOrEqual(56);
  expect(endTurnBox?.height).toBeGreaterThanOrEqual(48);
  expect((endTurnBox?.y ?? 0) + (endTurnBox?.height ?? 0)).toBeLessThanOrEqual(
    (bodyBox?.y ?? 0) + (bodyBox?.height ?? 0),
  );
});

test("active game menu modal fits within a short viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 692 });
  await page.goto("/game/");
  await addTwoPlayers(page);
  await startGame(page);
  await waitForTurnSplash(page, "Ada");

  await page.getByRole("button", { name: "Game menu" }).click();
  const dialog = page.getByRole("dialog", { name: "Game menu" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Close game menu" })).toBeVisible();

  const dialogBox = await dialog.boundingBox();
  expect(dialogBox?.y).toBeGreaterThanOrEqual(0);
  expect((dialogBox?.y ?? 0) + (dialogBox?.height ?? 0)).toBeLessThanOrEqual(
    692,
  );
});
