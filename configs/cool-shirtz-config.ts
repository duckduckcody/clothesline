import { utils } from 'apify';
import { Config } from '../types/Config';
import { productSchema, sizeSchema } from '../types/Product';
import { Size } from '../types/Size';
import { absoluteUrl } from '../utils/absoluteUrl';
import { incrementPageParam } from '../utils/incrementPageParam';
import { logBadProduct } from '../utils/logging';
import { stringToPrice } from '../utils/stringToPrice';
import { urlToCheerio } from '../utils/urlToCheerio';

export const coolShirtzProductConfig: Config = {
  name: 'Cool Shirtz',
  baseUrl: 'https://shirtz.cool',
  maximumProductsOnPage: 15,
  categoryUrls: [
    'https://shirtz.cool/collections/t-shirts',
    'https://shirtz.cool/collections/button-up-shirts',
    'https://shirtz.cool/collections/longsleeve',
    'https://shirtz.cool/collections/jumpers',
    'https://shirtz.cool/collections/crop-tops',
    'https://shirtz.cool/collections/jackets',
    'https://shirtz.cool/collections/pants',
  ],
  shouldEnqueueLinks: (url) => !url.includes('products'),
  enqueueLinks: async (url, requestQueue) => {
    const $ = await urlToCheerio(url);
    const res = await utils.enqueueLinks({
      $,
      requestQueue,
      limit: coolShirtzProductConfig.maximumProductsOnPage,
      selector: 'a.grid-view-item__link',
      baseUrl: coolShirtzProductConfig.baseUrl,
    });

    return Boolean(res.length);
  },
  getNextPageUrl: (url) => incrementPageParam(url, 'page'),
  scrape: async (url) => {
    // get sizes to work.............

    const $ = await urlToCheerio(url);

    const product = $('div.product-single');

    const name = $(product.find('h1.product-single__title').first()).text();

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

    const sizes: Size[] = [];
    $(product.find('.swatch-element')).each((i, s) => {
      const sizeParse = sizeSchema.safeParse({
        label: $(s).text(),
        inStock: !$(s).hasClass('soldout'),
        price: price,
        oldPrice: oldPrice,
      });

      if (sizeParse.success) {
        sizes.push(sizeParse.data);
      } else {
        logBadProduct(sizeParse.error, {
          message: 'error making styles for cools shirtz',
        });
      }
    });

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
      sizes,
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
