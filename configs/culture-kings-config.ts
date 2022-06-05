import algoliasearch from 'algoliasearch';
import { Config } from '../types/Config';
import {
  CultureKingsAlgoliaHits,
  Variant,
} from '../types/CultureKingsAlgoliaHits';
import { Product, productSchema, Size } from '../types/Product';
import { logBadProduct, logBadResponse } from '../utils/logging';

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

const formatSizes = (sizes: Variant[]): Size[] =>
  sizes.map((s) => ({
    label: s.title,
    inStock: s.availableForSale && s.inStock,
    price: s.price,
    oldPrice: s.compareAtPrice > 0 ? s.compareAtPrice : undefined,
  }));

export const cultureKingsConfig: Config = {
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
      })
      .then((res) => {
        res.hits.forEach((product) => {
          const productParse = productSchema.safeParse({
            name: product.title,
            link: `${CULTURE_KINGS_URL}/products/${product.handle}?productId=${product.styleGroup}&gender=${product.gender}`,
            images: product.images ? product.images : [product.image],
            details: product.description,
            sizes: formatSizes(product.variants),
            brand: product.vendor,
          });

          if (productParse.success) {
            collectedProducts.push(productParse.data);
          } else {
            logBadProduct(productParse, { url, product });
          }
        });
      })
      .catch((e) => {
        logBadResponse(e);
      });

    return collectedProducts;
  },
  shouldEnqueueLinks: () => false,
  getNextPageUrl: (url: string) => {
    const splitUrl = url.split('?');
    const params = new URLSearchParams(splitUrl[1]);

    const page = params.get('page');
    params.set('page', `${page ? Number(page) + 1 : 2}`);

    return `${splitUrl[0]}?${params.toString()}`;
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
