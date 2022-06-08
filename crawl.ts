import Apify, { openDataset } from 'apify';
import { configs } from './configs';
import { Product } from './types/Product';
import { addRequests } from './utils/add-requests';

const crawlerBaseConfig = {
  maxRequestRetries: 1,
  maxRequestsPerCrawl: 1000,
  minConcurrency: 50,
  maxConcurrency: 50,
};

configs.map((config) => {
  Apify.main(async () => {
    const requestQueue = await Apify.openRequestQueue();
    await addRequests(requestQueue, config.categoryUrls);

    const crawler = new Apify.BasicCrawler({
      ...crawlerBaseConfig,
      ...config.crawlerOptions,
      requestQueue,
      handleRequestFunction: async ({ request }) => {
        if (config.enqueueLinks && config.shouldEnqueueLinks(request.url)) {
          const shouldQueueNextPage = await config.enqueueLinks(
            request.url,
            requestQueue
          );

          if (shouldQueueNextPage && config.getNextPageUrl) {
            await requestQueue.addRequest({
              url: config.getNextPageUrl(request.url),
            });
          }
        } else {
          let data: Product[] | Product | undefined = [];

          data = await config.scrape(request.url);

          if (data && !Array.isArray(data)) {
            const dataset = await openDataset();
            await dataset.pushData({
              name: config.name,
              url: request.url,
              length: 1,
              data,
            });
          } else if (!data && request.retryCount === 0) {
            throw new Error(`No data found for ${request.url}, retrying...`);
          }

          if (Array.isArray(data)) {
            if (data.length !== 0) {
              const dataset = await openDataset();
              await dataset.pushData({
                name: config.name,
                url: request.url,
                length: data.length,
                data,
              });

              if (
                config.getNextPageUrl &&
                data.length >=
                  config.maximumProductsOnPage - (config.fuckyTolerance ?? 0)
              ) {
                await requestQueue.addRequest({
                  url: config.getNextPageUrl(request.url),
                });
              }
            } else if (data.length === 0 && request.retryCount === 0) {
              throw new Error(`No data found for ${request.url}, retrying...`);
            }
          }
        }
      },
      handleFailedRequestFunction: async ({ request }) => {
        console.log(`Request ${request.url} failed.`);
      },
    });

    await crawler.run();

    const dataSet = await openDataset();
    const length = await dataSet.reduce(
      (memo, value) => {
        // @ts-ignore
        memo.length += value.length;
        return memo;
      },
      { length: 0 }
    );
    console.log('number of hits', length);
  });
});
