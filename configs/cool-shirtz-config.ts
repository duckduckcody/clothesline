import { utils } from 'apify';
import { Config } from '../types/Config';
import { productSchema } from '../types/Product';
import { absoluteUrl } from '../utils/absoluteUrl';
import { logBadProduct } from '../utils/logging';
import { stringToPrice } from '../utils/stringToPrice';
import { urlToCheerio } from '../utils/urlToCheerio';

export const coolShirtzProductConfig: Config = {
  name: 'Cool Shirtz',
  baseUrl: 'https://shirtz.cool',
  maximumProductsOnPage: 15,
  // categoryUrls: [
  //   'https://shirtz.cool/collections/t-shirts',
  //   'https://shirtz.cool/collections/button-up-shirts',
  //   'https://shirtz.cool/collections/longsleeve',
  //   'https://shirtz.cool/collections/jumpers',
  //   'https://shirtz.cool/collections/crop-tops',
  //   'https://shirtz.cool/collections/jackets',
  //   'https://shirtz.cool/collections/pants',
  // ],
  categoryUrls: [
    'https://shirtz.cool/collections/longsleeve/products/ehdjaj-jdbjeui-jnd-oaadf',
  ],
  shouldEnqueueLinks: (url) => !url.includes('products'),
  enqueueLinks: async (url, requestQueue) => {
    const $ = await urlToCheerio(url);
    return await utils.enqueueLinks({
      $,
      requestQueue,
      limit: coolShirtzProductConfig.maximumProductsOnPage,
      selector: 'a.grid-view-item__link',
      baseUrl: coolShirtzProductConfig.baseUrl,
    });
  },
  scrape: async (url) => {
    const $ = await urlToCheerio(url);

    const product = $('div.product-single');

    // skip if sold out
    if (product.find(`input#BIS_trigger`).first()) return undefined;

    const name = $(product.find('.product-single__title').first()).text();

    const images: string[] = [];
    product.find('a.product-single__thumbnail').each((i, el) => {
      const image = absoluteUrl($(el).attr('data-imagesrc'));
      if (image) {
        images.push(image);
      }
    });

    const moneyElements = $(
      product.find('p.product-single__price').first()
    ).find('span.money');
    const oldPrice = stringToPrice($(moneyElements[1]).text());
    const price = stringToPrice($(moneyElements[0]).text());

    // clean up details
    product.find('div#product-description br').replaceWith(' ');
    product.find('div#product-description li').replaceWith((i, text) => {
      return ` ${$(text).text()} `;
    });

    const details = product
      .find('div#product-description')
      .text()
      .trim()
      .replace(/\s\s+/g, ' ');

    const parseRes = productSchema.safeParse({
      link: url,
      name,
      brand: coolShirtzProductConfig.name,
      details,
      images,
      price,
      oldPrice,
    });

    if (parseRes.success) {
      return parseRes.data;
    } else {
      await logBadProduct(parseRes);
      return undefined;
    }
  },
  getGender: () => {
    return ['Mens', 'Womens'];
  },
};
