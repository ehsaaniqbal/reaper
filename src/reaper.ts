import { PlaywrightCrawler } from "crawlee";

type channel = {
  id?: string;
  name?: string;
  description?: string;
  links?: { name?: string; url?: string }[];
};

export async function reaper(urls: string[]) {
  const channels: channel[] = [];

  const crawler = new PlaywrightCrawler({
    async requestHandler({ page, log }) {
      const channel: channel = { links: [] };

      // Extract channel info
      const title = await page.title();
      const id = page.url().match(/@([^/]+)/)?.[0];
      const name = (
        await page
          .locator("#channel-name")
          .nth(0)
          .locator("#text")
          .textContent()
      )?.trim();
      const description = (
        await page.locator("#description").nth(1).textContent()
      )?.trim();

      // Extract all channel links
      for (const li of await page
        .locator("#link-list-container")
        .getByRole("link")
        .all()) {
        let url = (await li.getAttribute("href"))?.trim();
        const name = (await li.textContent())?.trim() || "";

        if (url) {
          const urlObject = new URL(url);
          url =
            urlObject.pathname === "/redirect"
              ? urlObject.searchParams.get("q") || ""
              : urlObject.href;
        }

        channel.links?.push({
          name,
          url,
        });
      }

      channel.id = id;
      channel.name = name;
      channel.description = description;
      channels.push(channel);

      log.info(`Reaped ${title}`);
    },
    headless: true,
  });

  await crawler.run(urls);
  await crawler.requestQueue?.drop();

  return channels;
}
