import { PlaywrightCrawler, Dataset } from "crawlee";

// PlaywrightCrawler crawls the web using a headless
// browser controlled by the Playwright library.
const crawler = new PlaywrightCrawler({
  // Use the requestHandler to process each of the crawled pages.
  async requestHandler({ request, page, log }) {
    const description =
      (await page.locator("#description").nth(1).textContent()) ||
      "no description";
    const title = await page.title();

    for (const li of await page
      .locator("#link-list-container")
      .getByRole("link")
      .all()) {
      const link = await li.getAttribute("href");
      const text = await li.textContent();
      log.info(`${text} ${link}`);
    }

    log.info(`Title of ${request.loadedUrl} is '${title}'`);
    log.info(description);

    // Save results as JSON to ./storage/datasets/default
    await Dataset.pushData({ title, url: request.loadedUrl });
  },
  // headless: false,
});

// Add first URL to the queue and start the crawl.
await crawler.run(["https://www.youtube.com/@lexfridman/about"]);
