import { Builder, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import assert from "node:assert/strict";

describe("hamster wheel UI", function () {
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
    assert.equal(await driver.getTitle(), "hamster wheel — Keep your momentum");
    assert.equal(await driver.findElement(By.css(".auth-story .brand-name")).getText(), "hamster wheel");
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
    assert.equal(await driver.findElement(By.css(".topbar .brand-name")).getText(), "hamster wheel");
    assert.ok((await driver.findElements(By.css(".habit-item"))).length > 0);
    assert.ok((await driver.findElements(By.css(".calendar-cell"))).length > 300);
    await driver.executeScript("document.documentElement.style.scrollBehavior = 'auto'");

    const dailyTracker = await driver.findElement(By.css("[data-testid='daily-tracker']"));
    const initialProgress = await dailyTracker.findElement(By.css(".daily-level.is-selected strong")).getText();
    const targetProgress = initialProgress === "100%" ? "75%" : "100%";
    await dailyTracker.findElement(By.xpath(`.//button[contains(@class,'daily-level')][strong[normalize-space()='${targetProgress}']]`)).click();
    await driver.wait(async () => (await dailyTracker.findElement(By.css(".daily-level.is-selected strong")).getText()) === targetProgress, 3000);
    assert.equal(await dailyTracker.findElement(By.css(".daily-level.is-selected strong")).getText(), targetProgress);
    assert.match(await driver.findElement(By.css(".save-status")).getText(), /waiting to be saved/);
    const undoButton = await driver.findElement(By.xpath("//button[normalize-space()='Undo']"));
    await driver.wait(until.elementIsEnabled(undoButton), 3000);
    await undoButton.click();
    await driver.wait(async () => (await dailyTracker.findElement(By.css(".daily-level.is-selected strong")).getText()) === initialProgress, 3000);
    assert.equal(await dailyTracker.findElement(By.css(".daily-level.is-selected strong")).getText(), initialProgress);

    await dailyTracker.findElement(By.css("[aria-label='Previous week']")).click();
    await driver.wait(async () => (await dailyTracker.findElements(By.css(".daily-today-button"))).length === 1, 3000);
    await dailyTracker.findElement(By.css(".daily-today-button")).click();
    await driver.wait(async () => (await dailyTracker.findElements(By.css(".daily-today-button"))).length === 0, 3000);

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
    await driver.findElement(By.xpath("//button[normalize-space()='+ Add a habit']")).click();
    assert.equal((await driver.findElements(By.css(".create-modal"))).length, 1);
    assert.equal(await driver.findElement(By.css("#new-habit-name")).getAttribute("required"), "true");
    assert.equal(await driver.findElement(By.css("#new-habit-goal")).getAttribute("required"), "true");
    await driver.findElement(By.css(".create-modal button[type='submit']")).click();
    assert.equal((await driver.findElements(By.css(".create-field-error"))).length, 2);
    assert.equal((await driver.findElements(By.css(".habit-item"))).length, habitCount);
    await driver.findElement(By.css("#new-habit-name")).sendKeys("Stretch");
    await driver.findElement(By.css("#new-habit-goal")).sendKeys("Move for ten minutes");
    await driver.findElement(By.css(".create-modal button[type='submit']")).click();
    assert.equal((await driver.findElements(By.css(".create-modal"))).length, 0);
    assert.equal((await driver.findElements(By.css(".habit-item"))).length, habitCount + 1);
    await driver.findElement(By.xpath("//button[normalize-space()='Undo']")).click();
    assert.equal((await driver.findElements(By.css(".habit-item"))).length, habitCount);

    await driver.findElement(By.xpath("//button[normalize-space()='+ Add a habit']")).click();
    await driver.findElement(By.xpath("//button[normalize-space()='Cancel']")).click();
    assert.equal((await driver.findElements(By.css(".create-modal"))).length, 0);

    await driver.findElement(By.xpath("//button[normalize-space()='+ New journal']")).click();
    assert.equal((await driver.findElements(By.css(".create-journal-modal"))).length, 1);
    assert.equal(await driver.findElement(By.css("#new-journal-name")).getAttribute("required"), "true");
    await driver.findElement(By.css(".create-journal-modal button[type='submit']")).click();
    assert.match(await driver.findElement(By.css("#new-journal-name-error")).getText(), /Please add a name/);
    await driver.findElement(By.xpath("//button[normalize-space()='Cancel']")).click();
    assert.equal((await driver.findElements(By.css(".create-journal-modal"))).length, 0);

    await driver.executeScript(
      "const originalFetch = window.fetch; window.fetch = (url, options) => { if (String(url).endsWith('/journals') && options?.method === 'POST') { const body = JSON.parse(options.body); window.__createdJournalPayload = body; return Promise.resolve({ ok: true, json: async () => ({ id: 999999, ...body }) }); } return originalFetch(url, options); };"
    );
    await driver.findElement(By.xpath("//button[normalize-space()='+ New journal']")).click();
    await driver.findElement(By.css("#new-journal-name")).sendKeys("  Weekend reset  ");
    await driver.findElement(By.css(".create-journal-modal button[type='submit']")).click();
    await driver.wait(async () => (await driver.findElements(By.css(".create-journal-modal"))).length === 0, 3000);
    assert.equal(await driver.executeScript("return window.__createdJournalPayload.name"), "Weekend reset");
    assert.equal(await driver.findElement(By.css("#journal-select")).getAttribute("value"), "999999");
  });
});
