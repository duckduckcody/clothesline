import { CheerioAPI } from 'cheerio/lib/load';
import { Config } from '../types/Config';
import { Product, productSchema } from '../types/Product';
import { stringToPrice } from '../utils/stringToPrice';

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
  crawlerType: 'cheerio',
  scraper: ($: CheerioAPI, url) => {
    const collectedProducts: Product[] = [];

    $('.product-item').each((i, element) => {
      const product = $(element);

      const anchor = product.find('a.product-item-info');

      const link = anchor.attr('href');
      const name = anchor.text().trim();

      const image = $(product.find('img')[0]).attr('src');

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
        console.log('bad product...');
      }
    });

    return collectedProducts;
  },
  getNextPageUrl: (url: string) => {
    const splitUrl = url.split('?');
    let pageNumber = Number(splitUrl[1]?.split('=')?.[1] ?? 1);

    return `${splitUrl[0]}?p=${pageNumber + 1}`;
  },
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
