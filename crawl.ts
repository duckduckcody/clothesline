import Apify from 'apify';
import { configs } from './configs';
import { addRequests } from './utils/add-requests';

const crawlerBaseConfig = {
  maxRequestRetries: 1,
  maxRequestsPerCrawl: 1000,
  minConcurrency: 10,
  maxConcurrency: 500,
};

configs.map((config) => {
  Apify.main(async () => {
    const requestQueue = await Apify.openRequestQueue();
    await addRequests(requestQueue, config.categoryUrls);

    const crawler = new Apify.BasicCrawler({
      ...crawlerBaseConfig,
      requestQueue,
      handleRequestFunction: async ({ request }) => {
        const data = await config.scrape(request.url);

        if (data && data.length) {
          await Apify.pushData({
            name: config.name,
            url: request.url,
            gender: config.getGender(request.url),
            numberOfItems: data.length,
            data,
          });
        } else if (!data || (data.length === 0 && request.retryCount === 0)) {
          throw new Error(`No data found on ${request.url}, retrying...`);
        }

        if (
          data.length >=
          config.maximumProductsOnPage - (config.fuckyTolerance ?? 0)
        ) {
          await requestQueue.addRequest({
            url: config.getNextPageUrl(request.url),
          });
          console.log(`finished scraping ${request.url}...`);
        } else {
          console.log(`category ${request.url} finished...`);
        }
      },
      handleFailedRequestFunction: async ({ request }) => {
        console.log(`Request ${request.url} failed.`);
      },
    });
    await crawler.run();
  });
});
