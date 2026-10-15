import { Builder, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import assert from "node:assert/strict";

describe("Habit Journal UI", function () {
  let driver;

  before(async function () {
    const options = new chrome.Options().addArguments("--headless=new", "--window-size=1440,900");
    driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build();
  });

  after(async function () {
    if (driver) await driver.quit();
  });

  it("shows sign-in and opens the habit dashboard", async function () {
    await driver.get("http://localhost:5173/");
    const intro = await driver.wait(until.elementLocated(By.css(".auth-story h1")), 10000);
    assert.match(await intro.getText(), /Good habits grow/);
    await driver.findElement(By.css(".auth-mode")).click();
    assert.match(await driver.findElement(By.css(".auth-form h2")).getText(), /Start your journal/);
    await driver.findElement(By.css(".auth-mode")).click();

    await driver.findElement(By.css(".auth-form button[type='submit']")).click();
    const dashboard = await driver.wait(
      until.elementLocated(By.css("[data-testid='habit-tracker-title']")),
      10000
    );
    assert.match(await dashboard.getText(), /demo/i);
    assert.ok((await driver.findElements(By.css(".habit-item"))).length > 0);
    assert.ok((await driver.findElements(By.css(".calendar-cell"))).length > 300);
    await driver.executeScript("document.documentElement.style.scrollBehavior = 'auto'");

    const displayedYear = Number(await driver.findElement(By.css(".calendar-year")).getText());
    await driver.findElement(By.css("[aria-label='Previous year']")).click();
    assert.equal(Number(await driver.findElement(By.css(".calendar-year")).getText()), displayedYear - 1);
    await driver.findElement(By.css("[aria-label='Next year']")).click();
    assert.equal(Number(await driver.findElement(By.css(".calendar-year")).getText()), displayedYear);

    const firstDay = await driver.findElement(By.css(".calendar-cell"));
    const originalLevel = await firstDay.getAttribute("data-level");
    await driver.executeScript("arguments[0].scrollIntoView({ block: 'center', behavior: 'instant' })", firstDay);
    await firstDay.click();
    assert.notEqual(await firstDay.getAttribute("data-level"), originalLevel);
    assert.match(await driver.findElement(By.css(".save-status")).getText(), /waiting to be saved/);

    await driver.findElement(By.xpath("//button[normalize-space()='Undo']")).click();
    assert.equal(await firstDay.getAttribute("data-level"), originalLevel);
    await driver.findElement(By.xpath("//button[normalize-space()='Redo']")).click();
    assert.notEqual(await firstDay.getAttribute("data-level"), originalLevel);
    await driver.findElement(By.xpath("//button[normalize-space()='Undo']")).click();

    await driver.findElement(By.xpath("//button[normalize-space()='Settings']")).click();
    assert.equal((await driver.findElements(By.css(".settings-modal"))).length, 1);
    await driver.findElement(By.css(".close-button")).click();

    const habitCount = (await driver.findElements(By.css(".habit-item"))).length;
    await driver.executeScript("window.prompt = (() => { const answers = ['Stretch', 'Move for ten minutes']; return () => answers.shift(); })()");
    await driver.findElement(By.xpath("//button[normalize-space()='+ Add a habit']")).click();
    assert.equal((await driver.findElements(By.css(".habit-item"))).length, habitCount + 1);
    await driver.findElement(By.xpath("//button[normalize-space()='Undo']")).click();
    assert.equal((await driver.findElements(By.css(".habit-item"))).length, habitCount);
  });
});
