const Apify = require('apify');

const { log } = Apify.utils;
log.setLevel(log.LEVELS.DEBUG);

Apify.main(async () => {
  const requestList = await Apify.openRequestList('start-urls', [
    { url: 'https://www.google.com' },
  ]);

  const crawler = new Apify.CheerioCrawler({
    requestList,
    maxRequestRetries: 1,
    handlePageTimeoutSecs: 30,
    maxRequestsPerCrawl: 10,
    handlePageFunction: async ({ request, $ }) => {
      log.debug(`Processing ${request.url}...`);

      const title = $('title').text();
      const h1texts = [];
      $('h1').each((index, el) => {
        h1texts.push({
          text: $(el).text(),
        });
      });

      // stored as JSON files in ./apify_storage/datasets/default
      await Apify.pushData({
        url: request.url,
        title,
        h1texts,
      });
    },

    // This function is called if the page processing failed more than maxRequestRetries+1 times.
    handleFailedRequestFunction: async ({ request }) => {
      log.debug(`Request ${request.url} failed twice.`);
    },
  });

  await crawler.run();
  log.debug('Crawler finished.');
});
