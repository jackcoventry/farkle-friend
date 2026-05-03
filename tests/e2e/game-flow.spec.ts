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

test("mobile setup sidebar opens with a toggle", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/game/");

  const sidebar = page.locator(".game-shell__sidebar");
  const closedBox = await sidebar.boundingBox();
  expect(closedBox?.x).toBeLessThan(0);

  await page.getByRole("button", { name: "Open sidebar" }).click();
  await expect(
    page.getByRole("button", { name: "Close sidebar" })
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Preferences" })).toBeVisible();

  await expect
    .poll(async () => {
      const openBox = await sidebar.boundingBox();
      return openBox?.x ?? -1;
    })
    .toBeGreaterThanOrEqual(0);
});
