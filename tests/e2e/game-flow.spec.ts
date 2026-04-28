import { expect, test } from "@playwright/test";

test("players can start a manual game, score turns, and reset for new players", async ({
  page,
}) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Settings" }).click();
  await page.getByLabel("manual").check();
  await page.getByLabel("Point target").fill("100");
  await page.getByRole("button", { name: "Save" }).click();

  await page.getByRole("link", { name: "Start Game" }).click();

  await page.getByLabel("Player name").fill("Ada");
  await page.getByRole("button", { name: "Add" }).click();
  await page.getByLabel("Player name").fill("Grace");
  await page.getByLabel("Avatar Hot dog").check();
  await page.getByRole("button", { name: "Add" }).click();
  await page.getByRole("button", { name: "Start game" }).click();

  await expect(page.getByRole("dialog", { name: "Ada's turn" })).toBeVisible();
  await expect(page.getByText("Ada's turn")).toBeVisible();
  await page.waitForTimeout(2100);

  await page.getByLabel("Turn score").fill("50");
  await page.getByRole("button", { name: "Submit score" }).click();

  await expect(
    page.getByRole("dialog", { name: "Grace's turn" })
  ).toBeVisible();
  await page.waitForTimeout(2100);

  await page.getByLabel("Turn score").fill("100");
  await page.getByRole("button", { name: "Submit score" }).click();

  await expect(page.getByRole("dialog", { name: "Game finished" })).toBeVisible();
  await expect(page.getByText("Grace wins!")).toBeVisible();

  await page.getByRole("button", { name: "New players" }).click();
  await expect(page.getByRole("heading", { name: "Add player" })).toBeVisible();
});
