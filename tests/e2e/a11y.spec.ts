import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

async function expectNoA11yViolations(page: Parameters<typeof AxeBuilder>[0]) {
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
}

async function addTwoPlayers(page: Parameters<typeof AxeBuilder>[0]) {
  await page.getByLabel("Player name").fill("Ada");
  await page.getByRole("button", { name: "Add" }).click();
  await page.getByLabel("Player name").fill("Grace");
  await page.getByLabel("Avatar Hot dog").check();
  await page.getByRole("button", { name: "Add" }).click();
}

test("lobby has no detectable accessibility violations", async ({ page }) => {
  await page.goto("/game/");
  await expect(page.getByRole("heading", { name: "Add player" })).toBeVisible();

  await expectNoA11yViolations(page);
});

test("active dice turn has no detectable accessibility violations", async ({
  page,
}) => {
  await page.goto("/game/");
  await addTwoPlayers(page);
  await page.getByRole("button", { name: "Start game" }).click();
  await page.waitForTimeout(2100);

  await expectNoA11yViolations(page);
});

test("turn result and finished modal have no detectable accessibility violations", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Settings" }).click();
  await page.getByLabel("manual").check();
  await page.getByLabel("Point target").fill("500");
  await page.getByRole("button", { name: "Save" }).click();
  await page.getByRole("link", { name: "Start Game" }).click();

  await addTwoPlayers(page);
  await page.getByRole("button", { name: "Start game" }).click();
  await page.waitForTimeout(2100);

  await page.getByLabel("Turn score").fill("50");
  await page.getByRole("button", { name: "Submit score" }).click();
  await expect(page.getByText("Next up: Grace.")).toBeVisible();
  await expectNoA11yViolations(page);

  await page.getByRole("button", { name: "Next player" }).click();
  await page.waitForTimeout(2100);
  await page.getByLabel("Turn score").fill("500");
  await page.getByRole("button", { name: "Submit score" }).click();
  await expect(page.getByRole("dialog", { name: "Game finished" })).toBeVisible();
  await expectNoA11yViolations(page);
});

test("confirmation modal has no detectable accessibility violations", async ({
  page,
}) => {
  await page.goto("/game/");
  await addTwoPlayers(page);
  await page.getByRole("button", { name: "Start game" }).click();
  await page.waitForTimeout(2100);

  await page.getByRole("button", { name: "Quit to setup" }).click();
  await expect(page.getByRole("dialog", { name: "Quit this game?" })).toBeVisible();

  await expectNoA11yViolations(page);
});
