import {
  BasicCrawler,
  CheerioCrawler,
  Dataset,
  RequestQueue,
  utils,
} from 'crawlee';
import { crawlerConfigs } from '../configs/crawler-configs';
import { DatasetName } from '../types/DatasetName';
import { Product } from '../types/Product';

const progress = crawlerConfigs.map(async (config) => {
  let crawler = undefined;
  let products: Product[] = [];
  const requestQueue = await RequestQueue.open(config.baseUrl);

  if (config.type === 'cheerio') {
    crawler = new CheerioCrawler({
      ...config.options,
      requestQueue,
      requestHandler: async ({ request, enqueueLinks, $ }) => {
        utils.sleep(1000);
        const test = () => request;
        // url is a list, enqueue all products on page and next page
        if (config.shouldEnqueueLinks(request.url)) {
          const enqueued = await enqueueLinks({
            selector: config.enqueueSelector,
            limit: config.maximumProductsOnPage,
            baseUrl: config.baseUrl,
            requestQueue,
          });

          console.log('enqueued products on page', request.url);

          // add next page if at least one product found
          if (enqueued.processedRequests.length > 0) {
            await requestQueue.addRequest({
              url: config.getNextPageUrl(request.url),
            });
          }
        } else {
          // its a product details page, scrape it
          let data = await config.scrape($, request.url);
          if (data) {
            products.push(data);
            console.log('scraped product', data.name);
          }
        }
      },
    });
  } else if (config.type === 'basic') {
    crawler = new BasicCrawler({
      ...config.options,
      requestQueue,
      requestHandler: async ({ request }) => {
        let data: Product[] | undefined = [];

        data = await config.scrape(request.url);

        // push data and enqueue next page if array
        if (data && data.length !== 0) {
          products = products.concat(data);

          // max products returned, add next page to queue
          if (
            config.getNextPageUrl &&
            data.length >= config.maximumProductsOnPage
          ) {
            await requestQueue.addRequest({
              url: config.getNextPageUrl(request.url),
            });
          }
        }
      },
      failedRequestHandler: async ({ request }) => {
        console.log(`Request ${request.url} failed.`);
      },
    });
  }

  if (crawler) {
    requestQueue.addRequests(config.categoryUrls.map((url) => ({ url })));
    await crawler.run();

    const dataset = await Dataset.open(DatasetName.products);
    await dataset.pushData(products);
  }
});

Promise.all(progress).then(async () => {
  const dataset = await Dataset.open(DatasetName.products);
  console.log(
    `scraped ${await dataset.reduce((prev, c) => (prev += 1), 0)} products`
  );
});
