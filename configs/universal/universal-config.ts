import { CheerioCrawlerConfig } from '../../types/CrawlerConfig';
import { Product, productSchema } from '../../types/Product';
import { addCategoryGenderToRequest } from '../../utils/add-category-gender-to-request/add-category-gender-to-request';
import { getCategoryAndGenderFromUrl } from '../../utils/getCategoryAndGenderFromUrl';
import { incrementPageParam } from '../../utils/increment-page-param/increment-page-param';
import { logBadProduct } from '../../utils/logging';
import { makeCategories } from '../../utils/makeCategories';
import { stringToPrice } from '../../utils/stringToPrice';
import { universalCategoryMap } from './category-map';
import { getSizes } from './getSizes';

export const universalConfig: CheerioCrawlerConfig = {
  type: 'cheerio',
  name: 'Universal',
  baseUrl: 'https://www.universalstore.com',
  categoryUrls: [...universalCategoryMap.keys()],

  getNextPageUrl: (url: string) => incrementPageParam(url, 'p'),
  maximumProductsOnPage: 60,
  fuckyTolerance: 5,

  shouldEnqueueLinks: (url: string) => url.includes('clothing'),
  enqueueSelector: 'a.product-item-info',
  transformRequestFunction: (request, originalUrl) => {
    request = addCategoryGenderToRequest(
      request,
      originalUrl,
      universalCategoryMap
    );
    return request;
  },

  scrape: async ($, url, sendRequest) => {
    const { genders, categories } = getCategoryAndGenderFromUrl(url);

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

    const sizing = $(product.find('div.description-item-content').first())
      .text()
      .trim();

    const sizes = await getSizes($, price, oldPrice, sendRequest);

    const parseRes = productSchema.safeParse({
      name,
      brand,
      link: url,
      details: '',
      images,
      sizing,
      genders,
      sizes,
      categories: makeCategories(categories),
      website: universalConfig.name,
    } as Product);

    if (parseRes.success) {
      return parseRes.data;
    } else {
      logBadProduct(parseRes, { url });
    }
  },
};
