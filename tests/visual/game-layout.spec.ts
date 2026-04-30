import { expect, test } from "@playwright/test";
import { addTwoPlayers, startGame, waitForTurnSplash } from "../helpers/game";

test("dice turn layout remains stable", async ({ page }) => {
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
  await page.waitForTimeout(600);

  await expect(page.locator(".game-shell__body")).toHaveScreenshot(
    "dice-turn-layout.png"
  );
});

test("winner modal layout remains stable", async ({ page }) => {
  await page.goto("/game/");
  await page.getByRole("tab", { name: "Settings" }).click();
  await page.getByRole("radio", { name: "manual", exact: true }).check();
  await page.getByLabel("Point target").fill("500");
  await page.getByRole("button", { name: "Save" }).click();

  await addTwoPlayers(page);
  await startGame(page);
  await waitForTurnSplash(page, "Ada");
  await page.getByLabel("Turn score").fill("500");
  await page.getByRole("button", { name: "Submit score" }).click();

  const dialog = page.getByRole("dialog", { name: "Game finished" });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveScreenshot("winner-modal-layout.png");
});
