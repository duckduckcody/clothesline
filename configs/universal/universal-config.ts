import { utils } from 'apify';
import { Config } from '../../types/Config';
import { productSchema } from '../../types/Product';
import { incrementPageParam } from '../../utils/incrementPageParam';
import { logBadProduct } from '../../utils/logging';
import { stringToPrice } from '../../utils/stringToPrice';
import { urlToCheerio } from '../../utils/urlToCheerio';
import { getSizes } from './getSizes';

export const universalConfig: Config = {
  name: 'Universal',
  baseUrl: 'https://www.universalstore.com',
  maximumProductsOnPage: 60,
  fuckyTolerance: 5,
  categoryUrls: [
    // 'https://www.universalstore.com/mens/t-shirts.html',
    // 'https://www.universalstore.com/mens/jeans.html',
    // 'https://www.universalstore.com/mens/hoodies-sweaters.html',
    // 'https://www.universalstore.com/mens/jackets-coats.html',
    // 'https://www.universalstore.com/mens/overshirts.html',
    // 'https://www.universalstore.com/mens/shirts-polos.html',
    // 'https://www.universalstore.com/mens/pants.html',
    // 'https://www.universalstore.com/mens/shorts.html',
    // 'https://www.universalstore.com/mens/muscle-shirts-singlets.html',
    // 'https://www.universalstore.com/mens/underwear.html',
    // 'https://www.universalstore.com/womens/tops.html',
    // 'https://www.universalstore.com/womens/overshirts.html',
    // 'https://www.universalstore.com/womens/tshirts-tanktops.html',
    // 'https://www.universalstore.com/womens/jeans.html',
    // 'https://www.universalstore.com/womens/dresses.html',
    // 'https://www.universalstore.com/womens/sets-coordinates.html',
    // 'https://www.universalstore.com/womens/jumpers-knits.html',
    // 'https://www.universalstore.com/womens/coats-jackets.html',
    // 'https://www.universalstore.com/womens/pants.html',
    // 'https://www.universalstore.com/womens/skirts.html',
    // 'https://www.universalstore.com/womens/shorts.html',
    // 'https://www.universalstore.com/womens/underwear.html',
    // 'https://www.universalstore.com/womens/swimwear.html',
    'https://www.universalstore.com/lee-z-one-roller-jean-raven-damage-black.html',
  ],
  scrape: async (url: string) => {
    const $ = await urlToCheerio(url);

    const product = $('#maincontent');

    const name = product
      .find('h1.product-name')
      .text()
      .trim()
      .replaceAll('\n', '');
    const brand = product.find('meta').attr('content');

    const images: string[] = [];
    product.find('img.swiper-lazy').each((i, p) => {
      const image = $(p).attr('data-src');
      if (image) {
        images.push(image);
      }
    });

    const price = stringToPrice(
      $(product.find('span.normal-price').first()).text()
    );
    const oldPrice = stringToPrice(
      $($(product.find('span.old-price').first()))
        .text()
        .replaceAll('Regular Price', '')
    );

    const sizes = await getSizes($, price, oldPrice);

    const parseRes = productSchema.safeParse({
      name,
      brand,
      link: url,
      details: '',
      images,
      sizes,
    });

    if (parseRes.success) {
      return parseRes.data;
    } else {
      logBadProduct(parseRes, { url });
    }
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
