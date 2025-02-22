const chromium = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");

async function scrapeGoogleShopping(query) {
  let browser = null;

  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();
    
    // Google Shopping search with location-specific parameter
    await page.goto(`https://www.google.com/search?q=${query}&tbm=shop&uule=w+CAIQICIbQWxpZ2FyaCwgVXR0YXIgUHJhZGVzaCwgSW5kaWE`, {
      waitUntil: "domcontentloaded",
    });

    // Extract product details
    const results = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".sh-dgr__grid-result")).map(
        (el) => ({
          title: el.querySelector(".tAxDx")?.textContent.trim() || "No Title",
          price: el.querySelector(".a8Pemb")?.textContent.trim() || "No Price",
          link: el.querySelector("a")?.href || "No Link",
          image: el.querySelector("img")?.src || "No Image",
          source: el.querySelector(".b5ycib")?.textContent.trim() || "Unknown",
        })
      );
    });

    return results;
  } catch (error) {
    console.error("Scraping failed:", error);
    return [];
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
}

module.exports = { scrapeGoogleShopping };
