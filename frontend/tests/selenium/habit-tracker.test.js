import { Builder, By, until } from "selenium-webdriver";
import assert from "assert";

describe("Habit Tracker UI", function () {
  let driver;

  before(async function () {
    driver = await new Builder().forBrowser("chrome").build();
  });

  after(async function () {
    await driver.quit();
  });

  it("loads the habit tracker page", async function () {
  await driver.get("http://localhost:5173");

  const heading = await driver.wait(
  until.elementLocated(
    By.css('[data-testid="habit-tracker-title"]')
  ),
  10000
);

const text = await heading.getText();

assert.ok(
  text.includes("Habit Tracker"),
  `Expected heading to include "Habit Tracker", but got "${text}"`
);
});
});