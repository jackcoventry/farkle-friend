import { expect, test } from "@playwright/test";
import { addTwoPlayers, startGame, waitForTurnSplash } from "../helpers/game";

test("core game screens do not emit browser console errors", async ({
  page,
}) => {
  const errors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(message.text());
    }
  });
  page.on("pageerror", (error) => {
    errors.push(error.message);
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/game/");
  await page.getByRole("button", { name: "Setup summary" }).click();

  const setupDialog = page.getByRole("dialog", { name: "Game setup summary" });
  await expect(setupDialog.getByRole("button", { name: "Close setup summary" })).toBeVisible();

  await page.getByRole("button", { name: "View rules and scoring" }).click();
  const rulesDialog = page.getByRole("dialog", {
    name: "Game rules and scoring",
  });
  await expect(rulesDialog.getByRole("button", { name: "Close rules and scoring" })).toBeVisible();
  await page.getByRole("button", { name: "Close rules and scoring" }).click();

  await page.getByRole("button", { name: "Preferences" }).click();
  const preferencesDialog = page.getByRole("dialog", {
    name: "Game preferences",
  });
  await expect(preferencesDialog.getByRole("button", { name: "Close preferences" })).toBeVisible();
  await page.getByRole("button", { name: "Close preferences" }).click();

  await page.getByRole("button", { name: "Close setup summary" }).click();
  await addTwoPlayers(page);
  await startGame(page);
  await waitForTurnSplash(page, "Ada");
  await page.getByRole("button", { name: "Game menu" }).click();
  await page.getByRole("button", { name: "Close game menu" }).click();

  expect(errors).toEqual([]);
});
