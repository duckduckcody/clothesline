import Apify from 'apify';
import { coolShirtzProductConfig } from './configs/cool-shirtz-config';
import { addRequests } from './utils/add-requests';

Apify.main(async () => {
  const requestQueue = await Apify.openRequestQueue();
  await addRequests(requestQueue, coolShirtzProductConfig.categoryUrls);

  const crawler = new Apify.CheerioCrawler({
    requestQueue,
    maxRequestRetries: 1,
    handlePageTimeoutSecs: 30,
    maxRequestsPerCrawl: 10,
    handlePageFunction: async ({ request, $ }) => {
      const data = coolShirtzProductConfig.scraper($);

      if (data.length !== 0) {
        await requestQueue.addRequest({
          url: coolShirtzProductConfig.getNextPageUrl(request.url),
        });

        // stored as JSON files in ./apify_storage/datasets/default
        await Apify.pushData({
          name: coolShirtzProductConfig.name,
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
