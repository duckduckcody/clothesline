import { CheerioAPI } from 'cheerio/lib/load';
import { Config } from '../types/Config';
import { Product } from '../types/Product';

export const coolShirtzProductConfig: Config = {
  name: 'Cool Shirtz',
  baseUrl: 'https://shirtz.cool/collections/t-shirts',
  categoryUrls: [
    'https://shirtz.cool/collections/t-shirts',
    'https://shirtz.cool/collections/button-up-shirts',
    'https://shirtz.cool/collections/longsleeve',
  ],
  crawlerType: 'cheerio',
  scraper: ($: CheerioAPI) => {
    const collectedProducts: Product[] = [];

    $('.prod-container').each((i, element) => {
      const website = 'Cool Shirtz';

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
      const oldPrice = $(moneyElements[1]).text();
      const price = $(moneyElements[0]).text();

      collectedProducts.push({
        website,
        link,
        name,
        image: image || '',
        oldPrice,
        price,
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
