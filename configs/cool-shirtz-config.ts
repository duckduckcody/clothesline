import { CheerioAPI } from 'cheerio/lib/load';

interface Product {
  website: string;
  name: string;
  link: string;
  image: string;
  oldPrice: string;
  price: string;
}

export const coolShirtzProductConfig = {
  name: 'Cool Shirtz',
  url: 'https://shirtz.cool/collections/t-shirts',
  categoryUrls: [
    'https://shirtz.cool/collections/t-shirts',
    'https://shirtz.cool/collections/button-up-shirts',
  ],
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
    let pageNumber = Number(url.split('=')?.[1]) ?? 1;
    return `${coolShirtzProductConfig.url}?page=${pageNumber + 1}`;
  },
};
