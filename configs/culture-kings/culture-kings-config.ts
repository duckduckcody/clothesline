import algoliasearch from 'algoliasearch';
import { BasicCrawlerConfig } from '../../types/CrawlerConfig';

import {
  CultureKingsAlgoliaHits,
  Variant,
} from '../../types/CultureKingsAlgoliaHits';
import { Product, productSchema } from '../../types/Product';
import { Size } from '../../types/Size';
import { logBadProduct, logBadResponse } from '../../utils/logging';
import { makeGender } from '../../utils/make-gender/make-gender';
import { makeCategories } from '../../utils/makeCategories';

const ALGOLIA_APP_ID = '22MG8HZKHO';
const ALGOLIA_API_KEY = '120a2dd1a67e962183768696b750a52c';

const algoliaClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);

const index = algoliaClient.initIndex(
  'shopify_production_products_published_at_desc'
);

export const CULTURE_KINGS_ALGOLIA_FILTERS =
  '(inStock:true OR isForcedSoldOut:1 OR isStayInCollection:1) AND isOnline:true';

export const CULTURE_KINGS_ALGOLIA_LIST_FILTERS = `${CULTURE_KINGS_ALGOLIA_FILTERS} AND collectionHandles:`;

export const CULTURE_KINGS_URL = 'https://culturekings.com.au';

export const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:86.0) Gecko/20100101 Firefox/86.0',
  Connection: 'keep-alive',
  'Cache-Control': 'no-cache',
};

export const CULTURE_KINGS_ALGOLIA_HEADERS = {
  Referer: CULTURE_KINGS_URL.replace('https://', 'https://www.'),
  ...HEADERS,
};

const makePrice = (price: string | number): number => {
  if (typeof price === 'string') {
    return parseInt(price);
  }

  return price;
};

const makeSizes = (sizes: Variant[]): Size[] =>
  sizes.map((s) => {
    const inStock = s.inStock ?? s.availableForSale;
    const price = makePrice(s.price);

    return {
      label: s.title,
      inStock,
      price,
      oldPrice: s.compareAtPrice > 0 ? s.compareAtPrice : undefined,
    };
  });

export const cultureKingsConfig: BasicCrawlerConfig = {
  type: 'basic',
  name: 'Culture Kings',
  baseUrl: CULTURE_KINGS_URL,
  maximumProductsOnPage: 72,
  categoryUrls: [
    'https://mens-tops',
    'https://mens-bottoms',
    'https://womens-tops',
    'https://womens-bottoms',
  ],
  scrape: async (url: string) => {
    const collectedProducts: Product[] = [];
    const splitUrl = url.split('?');
    const params = new URLSearchParams(splitUrl[1]);
    const key = splitUrl[0].split('https://')[1];

    await index
      .search<CultureKingsAlgoliaHits>('', {
        hitsPerPage: 72,
        page: params.get('page') ? Number(params.get('page')) : 1,
        ruleContexts: [`collection-${key}`],
        filters: `${CULTURE_KINGS_ALGOLIA_LIST_FILTERS}${key}`,
        headers: CULTURE_KINGS_ALGOLIA_HEADERS,
        distinct: true,
      })
      .then((res) => {
        res.hits.forEach((product) => {
          let category = product.subCategoriesNormalised;
          if (!category || category.length === 0) {
            category = [product.category];
          }

          const productParse = productSchema.safeParse({
            name: product.title,
            link: `${CULTURE_KINGS_URL}/products/${product.handle}?productId=${product.styleGroup}&gender=${product.gender}`,
            images: product.images ? product.images : [product.image],
            details: product.description,
            sizes: makeSizes(product.variants),
            brand: product.vendor,
            genders: makeGender(product.gender),
            categories: makeCategories(category),
            website: cultureKingsConfig.name,
          });

          if (productParse.success) {
            collectedProducts.push(productParse.data);
          } else {
            logBadProduct(productParse, { url, product });
          }
        });
      })
      .catch((e) => {
        console.log(e);
        logBadResponse(e);
      });

    return collectedProducts;
  },
  getNextPageUrl: (url: string) => {
    const splitUrl = url.split('?');
    const params = new URLSearchParams(splitUrl[1]);

    const page = params.get('page');
    params.set('page', `${page ? Number(page) + 1 : 2}`);

    return `${splitUrl[0]}?${params.toString()}`;
  },
};
