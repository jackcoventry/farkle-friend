import { expect, test } from "@playwright/test";

test("players can start a manual game, score turns, and reset for new players", async ({
  page,
}) => {
  await page.goto("/");

  await page.getByRole("link", { name: "Start Game" }).click();

  await expect(page.getByRole("button", { name: "Start game" })).toBeDisabled();
  await expect(page.getByText("Add at least two players to start.")).toBeVisible();

  await page.getByRole("tab", { name: "Settings" }).click();
  await page.getByRole("radio", { name: "manual", exact: true }).check();
  await page.getByLabel("Point target").fill("500");
  await page.getByRole("button", { name: "Save" }).click();

  await page.getByLabel("Player name").fill("Ada");
  await page.getByRole("button", { name: "Add" }).click();
  await page.getByLabel("Player name").fill("Grace");
  await page.getByLabel("Avatar Hot dog").check();
  await page.getByRole("button", { name: "Add" }).click();
  await expect(page.getByText("2 players · Manual scoring")).toBeVisible();
  await page.getByRole("button", { name: "Start game" }).click();

  await expect(page.getByRole("dialog", { name: "Ada's turn" })).toBeVisible();
  await expect(page.getByText("Ada's turn")).toBeVisible();
  await page.waitForTimeout(2100);

  await page.getByLabel("Turn score").fill("50");
  await page.getByRole("button", { name: "Submit score" }).click();
  await expect(page.getByText("New total")).toBeVisible();
  await expect(page.getByText("Next up: Grace.")).toBeVisible();
  await page.getByRole("button", { name: "Next player" }).click();

  await expect(
    page.getByRole("dialog", { name: "Grace's turn" })
  ).toBeVisible();
  await page.waitForTimeout(2100);

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

  await page.getByLabel("Player name").fill("Ada");
  await page.getByRole("button", { name: "Add" }).click();
  await page.getByLabel("Player name").fill("Grace");
  await page.getByLabel("Avatar Hot dog").check();
  await page.getByRole("button", { name: "Add" }).click();
  await page.getByRole("button", { name: "Start game" }).click();
  await page.waitForTimeout(2100);

  await page.getByLabel("Turn score").fill("50");
  await page.getByRole("button", { name: "Submit score" }).click();
  await expect(page.getByText("Advancing automatically in")).toBeVisible();
  await expect(
    page.getByRole("dialog", { name: "Grace's turn" })
  ).toBeVisible({ timeout: 5000 });
});
