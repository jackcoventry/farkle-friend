import { expect, test } from "@playwright/test";
import { startGame, waitForTurnSplash } from "../helpers/game";

test("dice keyboard shortcuts work without hijacking form typing", async ({
  page,
}) => {
  await page.goto("/game/");

  const nameInput = page.getByLabel("Player name");
  await nameInput.focus();
  await page.keyboard.press("R");
  await expect(nameInput).toHaveValue("R");

  await nameInput.fill("Ada");
  await page.getByRole("button", { name: "Add" }).click();
  await page.getByLabel("Player name").fill("Grace");
  await page.getByLabel("Avatar Hot dog").check();
  await page.getByRole("button", { name: "Add" }).click();
  await startGame(page);
  await waitForTurnSplash(page, "Ada");

  await page.keyboard.press("R");
  await expect(page.getByRole("button", { name: /Select die 1/ })).toBeVisible();

  await page.keyboard.press("1");
  await expect(
    page.getByRole("button", { name: /Deselect die 1/ })
  ).toBeVisible();
});
