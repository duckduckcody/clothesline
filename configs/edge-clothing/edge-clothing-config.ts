import { CheerioCrawlerConfig } from '../../types/CrawlerConfig';
import { productSchema } from '../../types/Product';
import { Size, sizeSchema } from '../../types/Size';
import { addCategoryGenderToRequest } from '../../utils/add-category-gender-to-request/add-category-gender-to-request';
import { getCategoryAndGenderFromUrl } from '../../utils/getCategoryAndGenderFromUrl';
import { incrementPageParam } from '../../utils/increment-page-param/increment-page-param';
import { logBadProduct } from '../../utils/logging';
import { makeCategories } from '../../utils/makeCategories';
import { protocolAbsolute } from '../../utils/protocol-absolute/protocol-absolute';
import { stringToPrice } from '../../utils/stringToPrice';
import { EdgeClothingCategoryMap } from './category-map';

export const edgeClothingConfig: CheerioCrawlerConfig = {
  options: {
    maxConcurrency: 2,
  },

  type: 'cheerio',
  name: 'Edge Clothing',
  baseUrl: 'https://www.edgeclothing.com.au',
  categoryUrls: [...EdgeClothingCategoryMap.keys()],

  shouldEnqueueLinks: (url) => !url.includes('products'),
  enqueueSelector: 'a.product-thumbnail__title',
  transformRequestFunction: (request, originalUrl) => {
    request = addCategoryGenderToRequest(
      request,
      originalUrl,
      EdgeClothingCategoryMap
    );
    return request;
  },

  maximumProductsOnPage: 24,
  getNextPageUrl: (url) => incrementPageParam(url, 'page'),

  scrape: async ($, url) => {
    const product = $('div.product_section');

    const name = $(product.find('h1.product_name').first()).text();
    const details = '';

    const images: string[] = [];
    product.find('a.product-gallery__link').each((i, el) => {
      const image = protocolAbsolute($(el).attr('href'));
      if (image) {
        images.push(image);
      }
    });

    const price = stringToPrice(
      $(product.find('span.current_price').first()).text()
    );
    const oldPrice = stringToPrice(
      $(product.find('span.was-price').first()).text()
    );

    const sizes: Size[] = [];
    $(product.find('.swatch-element')).each((i, s) => {
      const sizeParse = sizeSchema.safeParse({
        label: $(s).text().trim().replaceAll('\n', ''),
        inStock: !$(s).hasClass('soldout'),
        price,
        oldPrice,
      });

      if (sizeParse.success) {
        sizes.push(sizeParse.data);
      } else {
        logBadProduct(sizeParse.error, {
          message: 'error making sizes for edge clothing',
        });
      }
    });

    const { genders, categories } = getCategoryAndGenderFromUrl(url);
    const parseRes = productSchema.safeParse({
      link: url,
      name,
      brand: edgeClothingConfig.name,
      details,
      images,
      sizes,
      genders,
      categories: makeCategories(categories),
      website: edgeClothingConfig.name,
    });

    if (parseRes.success) {
      return parseRes.data;
    } else {
      await logBadProduct(parseRes, { name, url });
      return undefined;
    }
  },
};
