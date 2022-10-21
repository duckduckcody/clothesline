import { BasicCrawler, BasicCrawlerOptions, CheerioCrawler } from 'crawlee';
import { configs } from '../configs/scraper-config';
import { Product } from '../types/Product';

const crawlerBaseConfig: Omit<BasicCrawlerOptions, 'requestHandler'> = {
  maxConcurrency: 50,
};

let dataset = [];
configs.map(async (config) => {
  let crawler = undefined;
  if (config.type === 'cheerio') {
    crawler = new CheerioCrawler({});
  } else {
    crawler = new BasicCrawler({
      ...crawlerBaseConfig,
      ...config.crawlerOptions,
      requestHandler: async ({
        request,
        crawler,
        enqueueLinks,
        sendRequest,
      }) => {
        if (config.getEnqueueLinks && config.shouldEnqueueLinks(request.url)) {
          const response = await sendRequest();

          const links = config.getEnqueueLinks(response.body);

          const enqueued = await enqueueLinks({ urls: links });

          if (enqueued.processedRequests.length > 0 && config.getNextPageUrl) {
            await crawler.requestQueue?.addRequest({
              url: config.getNextPageUrl(request.url),
            });
          }
        } else {
          let data: Product[] | Product | undefined = [];

          data = await config.scrape(request.url);

          // push if single product
          if (data && !Array.isArray(data)) {
            dataset.push(data);
          }

          // push data and enqueue next page if array
          if (Array.isArray(data)) {
            if (data.length !== 0) {
              dataset.push(data);

              // max products returned, add next page to queue
              if (
                config.getNextPageUrl &&
                data.length >=
                  config.maximumProductsOnPage - (config.fuckyTolerance ?? 0)
              ) {
                await crawler.requestQueue?.addRequest({
                  url: config.getNextPageUrl(request.url),
                });
              }
            } else if (data.length === 0 && request.retryCount === 0) {
              throw new Error(`No data found for ${request.url}, retrying...`);
            }
          }
        }
      },
      failedRequestHandler: async ({ request }) => {
        console.log(`Request ${request.url} failed.`);
      },
    });
  }

  if (crawler) {
    crawler.addRequests(config.categoryUrls);
    await crawler.run();
  }

  console.log(`scraped ${dataset.length} products`);
});
