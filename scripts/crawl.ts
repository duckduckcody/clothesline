import {
  BasicCrawler,
  CheerioCrawler,
  Dataset,
  EnqueueLinksOptions,
  KeyValueStore,
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
      requestHandler: async ({ request, enqueueLinks, $, sendRequest }) => {
        utils.sleep(1000);
        // url is a list, enqueue all products on page and next page
        if (config.shouldEnqueueLinks(request.url)) {
          const enqueueConfig: EnqueueLinksOptions = {
            selector: config.enqueueSelector,
            limit: config.maximumProductsOnPage,
            baseUrl: config.baseUrl,
            requestQueue,
            transformRequestFunction: (enqueuedRequest) => {
              if (config.transformRequestFunction) {
                return config.transformRequestFunction(
                  enqueuedRequest,
                  request.url
                );
              }

              return enqueuedRequest;
            },
          };

          if (config.getEnqueueUrls) {
            enqueueConfig.urls = config.getEnqueueUrls($);
          } else if (config.enqueueSelector) {
            enqueueConfig.selector = config.enqueueSelector;
          }

          const enqueued = await enqueueLinks(enqueueConfig);

          console.log('enqueued products on page', request.url);

          // add next page if minimum amount of products are found
          if (enqueued.processedRequests.length > 0) {
            await requestQueue.addRequest({
              url: config.getNextPageUrl(request.url),
            });
          }
        } else {
          // its a product details page, scrape it
          let data = await config.scrape($, request.url, sendRequest);
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

  const badCategories = await KeyValueStore.getValue(DatasetName.badCategory);
  if (badCategories) {
    console.log(`bad categories found ${badCategories}`);
  }

  const badProduct = await Dataset.open(DatasetName.badProduct);
  await badProduct.getInfo().then((i) => {
    if (i?.itemCount && i?.itemCount > 0) {
      console.log(`${i?.itemCount} bad product(s)`);
    }
  });

  const badRequest = await Dataset.open(DatasetName.badRequest);
  await badRequest.getInfo().then((i) => {
    if (i?.itemCount && i?.itemCount > 0) {
      console.log(`${i?.itemCount} bad request(s)`);
    }
  });

  const badResponse = await Dataset.open(DatasetName.badResponse);
  await badResponse.getInfo().then((i) => {
    if (i?.itemCount && i?.itemCount > 0) {
      console.log(`${i?.itemCount} bad response(s)`);
    }
  });

  const badEnqueue = await Dataset.open(DatasetName.badEnqueue);
  await badEnqueue.getInfo().then((i) => {
    if (i?.itemCount && i?.itemCount > 0) {
      console.log(`${i?.itemCount} bad enqueue(s)`);
    }
  });
});
