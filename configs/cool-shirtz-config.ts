import { utils } from 'apify';
import { CategoryMap } from '../types/CategoryMap';
import { Config } from '../types/Config';
import { productSchema } from '../types/Product';
import { Size, sizeSchema } from '../types/Size';
import { addCategoryGenderToRequest } from '../utils/add-category-gender-to-request/add-category-gender-to-request';
import { incrementPageParam } from '../utils/increment-page-param/increment-page-param';
import { logBadProduct } from '../utils/logging';
import { makeCategories } from '../utils/makeCategories';
import { protocolAbsolute } from '../utils/protocol-absolute/protocol-absolute';
import { stringToPrice } from '../utils/stringToPrice';
import { urlToCheerio } from '../utils/urlToCheerio';

const categoryMap: CategoryMap = new Map();
categoryMap
  .set('https://shirtz.cool/collections/t-shirts', {
    category: ['t-shirts'],
    gender: ['Mens', 'Womens'],
  })
  .set('https://shirtz.cool/collections/button-up-shirts', {
    category: ['t-shirts'],
    gender: ['Mens', 'Womens'],
  })
  .set('https://shirtz.cool/collections/longsleeve', {
    category: ['t-shirts'],
    gender: ['Mens', 'Womens'],
  })
  .set('https://shirtz.cool/collections/jumpers', {
    category: ['jumpers'],
    gender: ['Mens', 'Womens'],
  })
  .set('https://shirtz.cool/collections/crop-tops', {
    category: ['t-shirts', 'crop-tops'],
    gender: ['Womens'],
  })
  .set('https://shirtz.cool/collections/jackets', {
    category: ['jackets'],
    gender: ['Mens', 'Womens'],
  })
  .set('https://shirtz.cool/collections/pants', {
    category: ['pants'],
    gender: ['Mens', 'Womens'],
  });

export const coolShirtzConfig: Config = {
  name: 'Cool Shirtz',
  baseUrl: 'https://shirtz.cool',
  maximumProductsOnPage: 15,
  crawlerOptions: {
    maxConcurrency: 1,
  },
  categoryUrls: [...categoryMap.keys()],
  shouldEnqueueLinks: (url) => !url.includes('products'),
  enqueueLinks: async (url, requestQueue) => {
    const $ = await urlToCheerio(url);
    const res = await utils.enqueueLinks({
      $,
      requestQueue,
      limit: coolShirtzConfig.maximumProductsOnPage,
      selector: 'a.grid-view-item__link',
      baseUrl: coolShirtzConfig.baseUrl,
      transformRequestFunction: (request) =>
        addCategoryGenderToRequest(url, categoryMap, request),
    });

    return Boolean(res.length);
  },
  getNextPageUrl: (url) => incrementPageParam(url, 'page'),
  scrape: async (url) => {
    const splitUrl = url.split('/');
    const categories = [splitUrl[splitUrl.indexOf('collections') + 1]];

    let genders = ['Mens', 'Womens'];
    if (categories?.[0] === 'crop-tops') {
      genders = ['Womens'];
    }

    const $ = await urlToCheerio(url);

    const product = $('div.product-single');

    const name = $(product.find('h1.product-single__title').first()).text();

    const images: string[] = [];
    product.find('a.product-single__thumbnail').each((i, el) => {
      const image = protocolAbsolute($(el).attr('data-imagesrc'));
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
      brand: coolShirtzConfig.name,
      details,
      images,
      sizes,
      genders,
      categories: makeCategories(categories),
      website: coolShirtzConfig.name,
    });

    if (parseRes.success) {
      return parseRes.data;
    } else {
      await logBadProduct(parseRes, { name, url });
      return undefined;
    }
  },
};
