import Apify from 'apify';
import { configs } from './configs';
import { addRequests } from './utils/add-requests';

const crawlerBaseConfig = {
  maxRequestRetries: 1,
  handlePageTimeoutSecs: 30,
  maxRequestsPerCrawl: 10,
};

configs.map((config) => {
  Apify.main(async () => {
    const requestQueue = await Apify.openRequestQueue();
    await addRequests(requestQueue, config.categoryUrls);

    const crawler = new Apify.CheerioCrawler({
      ...crawlerBaseConfig,
      requestQueue,
      handlePageFunction: async ({ request, $ }) => {
        const data = config.scraper($);

        if (data.length !== 0) {
          await requestQueue.addRequest({
            url: config.getNextPageUrl(request.url),
          });

          // stored as JSON files in ./apify_storage/datasets/default
          await Apify.pushData({
            name: config.name,
            url: request.url,
            numberOfItems: data.length,
            data,
          });
        }
      },
      handleFailedRequestFunction: async ({ request }) => {
        console.log(`Request ${request.url} failed.`);
      },
    });

    await crawler.run();
  });
});
