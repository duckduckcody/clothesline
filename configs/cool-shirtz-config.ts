import { CheerioAPI } from 'cheerio/lib/load';
import { Config } from '../types/Config';
import { Product } from '../types/Product';
import { stringToPrice } from '../utils/stringToPrice';

export const coolShirtzProductConfig: Config = {
  name: 'Cool Shirtz',
  baseUrl: 'https://shirtz.cool',
  categoryUrls: [
    'https://shirtz.cool/collections/t-shirts',
    'https://shirtz.cool/collections/button-up-shirts',
    'https://shirtz.cool/collections/longsleeve',
    'https://shirtz.cool/collections/jumpers',
    'https://shirtz.cool/collections/crop-tops',
    'https://shirtz.cool/collections/jackets',
    'https://shirtz.cool/collections/pants',
  ],
  crawlerType: 'cheerio',
  scraper: ($: CheerioAPI) => {
    const collectedProducts: Product[] = [];

    $('.prod-container').each((i, element) => {
      const product = $(element);

      if (product.find('.so')[0]) return;

      const linkElement = $(product.find('.grid-view-item__link')[0]);

      if (!linkElement.attr('href')) {
        return console.log(`bad href: ${linkElement.attr('href')}`);
      }

      const link = `https://shirtz.cool${linkElement.attr('href')}`;

      const name = $(linkElement.find('h3')[0])?.text();

      const image = $(product.find('.product-grid-view-item')[0])
        .attr('data-bgset')
        ?.split(',')
        .pop()
        ?.split(' ')[0];

      const moneyElements = product.find('.money');
      const oldPrice = stringToPrice($(moneyElements[1]).text());
      const price = stringToPrice($(moneyElements[0]).text());

      collectedProducts.push({
        link,
        name,
        image: image ?? '',
        price: price ?? 0,
        oldPrice: oldPrice ?? 0,
        website: 'Cool Shirtz',
      });
    });

    return collectedProducts;
  },
  getNextPageUrl: (url: string) => {
    const splitUrl = url.split('?');
    let pageNumber = Number(splitUrl[1]?.split('=')?.[1] ?? 1);

    return `${splitUrl[0]}?page=${pageNumber + 1}`;
  },
};
