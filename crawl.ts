import Apify, { openDataset, utils } from 'apify';
import { configs } from './configs';
import { Product } from './types/Product';
import { addRequests } from './utils/add-requests';

const crawlerBaseConfig = {
  maxRequestRetries: 1,
  maxRequestsPerCrawl: 1000,
  minConcurrency: 1,
  maxConcurrency: 1,
};

configs.map((config) => {
  Apify.main(async () => {
    const requestQueue = await Apify.openRequestQueue();
    await addRequests(requestQueue, config.categoryUrls);

    const crawler = new Apify.BasicCrawler({
      ...crawlerBaseConfig,
      requestQueue,
      handleRequestFunction: async ({ request }) => {
        if (config.enqueueLinks && config.shouldEnqueueLinks(request.url)) {
          await config.enqueueLinks(request.url, requestQueue);
          console.log('queued');
        } else {
          // randomly delay requests
          await utils.sleep(1000);

          let data: Product[] | Product | undefined = [];

          data = await config.scrape(request.url);

          if (data) {
            const dataset = await openDataset(config.name);
            await dataset.pushData({
              name: config.name,
              url: request.url,
              data,
            });
          } else if (!data && request.retryCount === 0) {
            throw new Error(`No data found for ${request.url}, retrying...`);
          }

          // if array its a list, add next page to queue.
          if (
            Array.isArray(data) &&
            config.getNextPageUrl &&
            data.length >=
              config.maximumProductsOnPage - (config.fuckyTolerance ?? 0)
          ) {
            await requestQueue.addRequest({
              url: config.getNextPageUrl(request.url),
            });
          }
        }
      },
      handleFailedRequestFunction: async ({ request }) => {
        console.log(`Request ${request.url} failed.`);
      },
    });
    await crawler.run();

    const dataSet = await Apify.openDataset('Asos');
    const results = await dataSet.reduce(
      (memo, item) => {
        // @ts-ignore
        memo.length += item.data.length;
        return memo;
      },
      { length: 0 }
    );
    console.log('items scraped: ', results);
  });
});
