import { utils } from 'apify';
import { Config } from '../types/Config';
import { Product, productSchema } from '../types/Product';
import { absoluteUrl } from '../utils/absoluteUrl';
import { incrementPageParam } from '../utils/incrementPageParam';
import { logBadProduct } from '../utils/logging';
import { stringToPrice } from '../utils/stringToPrice';
import { urlToCheerio } from '../utils/urlToCheerio';

export const universalConfig: Config = {
  name: 'Universal',
  baseUrl: 'https://www.universalstore.com',
  maximumProductsOnPage: 60,
  fuckyTolerance: 5,
  categoryUrls: [
    'https://www.universalstore.com/mens/t-shirts.html',
    'https://www.universalstore.com/mens/jeans.html',
    'https://www.universalstore.com/mens/hoodies-sweaters.html',
    'https://www.universalstore.com/mens/jackets-coats.html',
    'https://www.universalstore.com/mens/overshirts.html',
    'https://www.universalstore.com/mens/shirts-polos.html',
    'https://www.universalstore.com/mens/pants.html',
    'https://www.universalstore.com/mens/shorts.html',
    'https://www.universalstore.com/mens/muscle-shirts-singlets.html',
    'https://www.universalstore.com/mens/underwear.html',
    'https://www.universalstore.com/womens/tops.html',
    'https://www.universalstore.com/womens/overshirts.html',
    'https://www.universalstore.com/womens/tshirts-tanktops.html',
    'https://www.universalstore.com/womens/jeans.html',
    'https://www.universalstore.com/womens/dresses.html',
    'https://www.universalstore.com/womens/sets-coordinates.html',
    'https://www.universalstore.com/womens/jumpers-knits.html',
    'https://www.universalstore.com/womens/coats-jackets.html',
    'https://www.universalstore.com/womens/pants.html',
    'https://www.universalstore.com/womens/skirts.html',
    'https://www.universalstore.com/womens/shorts.html',
    'https://www.universalstore.com/womens/underwear.html',
    'https://www.universalstore.com/womens/swimwear.html',
  ],
  scrape: async (url: string) => {
    const $ = await urlToCheerio(url);
    const collectedProducts: Product[] = [];

    $('.product-item').each((i, element) => {
      const product = $(element);

      const anchor = product.find('a.product-item-info');
      const link = anchor.attr('href');
      const name = anchor.text().trim();

      const image = absoluteUrl($(product.find('img')[0]).attr('src'));

      const priceContainer = $(product.find('.price-box')[0]);
      const price = stringToPrice(
        $(priceContainer.find('.normal-price')[0]).text()
      );
      const oldPrice = stringToPrice(
        $(priceContainer.find('.old-price')[0])
          .text()
          .replace('Regular Price', '')
      );

      const parseRes = productSchema.safeParse({
        link,
        name,
        image,
        price,
        oldPrice,
      });

      if (parseRes.success) {
        collectedProducts.push(parseRes.data);
      } else {
        logBadProduct(parseRes, { url });
      }
    });

    return collectedProducts;
  },
  shouldEnqueueLinks: (url: string) => {
    return url.includes('mens') || url.includes('womens');
  },
  enqueueLinks: async (url, requestQueue) => {
    const $ = await urlToCheerio(url);
    const res = await utils.enqueueLinks({
      $,
      requestQueue,
      limit: universalConfig.maximumProductsOnPage,
      selector: 'a.product-item-info',
      baseUrl: universalConfig.baseUrl,
    });
    return Boolean(res.length);
  },
  getNextPageUrl: (url: string) => incrementPageParam(url, 'p'),
  getGender: (url: string) => {
    if (url.includes('womens')) {
      return ['Womens'];
    } else if (url.includes('mens')) {
      return ['Mens'];
    } else {
      return ['Mens', 'Womens'];
    }
  },
};
