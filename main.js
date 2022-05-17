const Apify = require('apify');

const { log } = Apify.utils;
log.setLevel(log.LEVELS.DEBUG);

const configs = [
  {
    name: 'Cool Shirtz',
    url: 'https://shirtz.cool/collections/t-shirts',
    scraper: ($) => {
      const collectedProducts = [];

      $('.prod-container').each((i, element) => {
        const collectedProduct = {
          website: 'Cool Shirtz',
        };

        const product = $(element);

        if (product.find('.so')[0]) return;

        const linkElement = $(product.find('.grid-view-item__link')[0]);

        if (!linkElement.attr('href')) {
          return console.log(`bad href: ${linkElement.attr('href')}`);
        }

        collectedProduct.link = `https://shirtz.cool${linkElement.attr(
          'href'
        )}`;

        collectedProduct.name = $(linkElement.find('h3')[0])?.text();

        collectedProduct.image = $(product.find('.product-grid-view-item')[0])
          .attr('data-bgset')
          ?.split(',')
          .pop()
          ?.split(' ')[0];

        const moneyElements = product.find('.money');
        collectedProduct.oldPrice = $(moneyElements[1]).text();
        collectedProduct.price = $(moneyElements[0]).text();

        collectedProducts.push(collectedProduct);
      });

      return collectedProducts;
    },
  },
];

const urls = configs.map((config) => config.url);

Apify.main(async () => {
  const requestList = await Apify.openRequestList('start-urls', urls);

  const crawler = new Apify.PlaywrightCrawler({
    requestList,
    maxRequestRetries: 1,
    handlePageTimeoutSecs: 30,
    maxRequestsPerCrawl: 10,
    // handlePageFunction: async ({ request, $ }) => {
    //   const config = configs.find((c) => c.url === request.url);
    //   const data = config.scraper($);

    //   log.debug('data', data);

    //   // stored as JSON files in ./apify_storage/datasets/default
    //   await Apify.pushData({
    //     name: config.name,
    //     url: config.url,
    //     numberOfItems: data.length,
    //     data,
    //   });
    // },
    handlePageFunction: async ({ page, request }) => {
      // This function is called to extract data from a single web page
      // 'page' is an instance of Playwright.Page with page.goto(request.url) already called
      // 'request' is an instance of Request class with information about the page to load
      await Apify.pushData({
        title: await page.title(),
        url: request.url,
        succeeded: true,
      });
    },

    // This function is called if the page processing failed more than maxRequestRetries+1 times.
    handleFailedRequestFunction: async ({ request }) => {
      log.debug(`Request ${request.url} failed twice.`);

      // This function is called when the crawling of a request failed too many times
      await Apify.pushData({
        url: request.url,
        succeeded: false,
        errors: request.errorMessages,
      });
    },
  });

  await crawler.run();
});
