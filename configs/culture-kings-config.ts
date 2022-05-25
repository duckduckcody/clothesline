import algoliasearch from 'algoliasearch';
import { Config } from '../types/Config';
import { Product } from '../types/Product';

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

export const cultureKingsConfig: Config = {
  name: 'Culture Kings',
  baseUrl: 'https://www.culturekings.com.au/',
  maximumProductsOnPage: 72,
  categoryUrls: [''],
  scrape: async (url: string) => {
    const collectedProducts: Product[] = [];

    await index
      .search('', {
        hitsPerPage: 72,
        page: 1,
        ruleContexts: [`collection-${url}`],
        filters: `${CULTURE_KINGS_ALGOLIA_LIST_FILTERS}${url}`,
        headers: CULTURE_KINGS_ALGOLIA_HEADERS,
      })
      .then((res) => {
        //res to Product[]
      })
      .catch((e) => {
        console.error('Error scraping Culture kings', e);
      });

    return collectedProducts;

    // if (parseRes.success) {
    //   const collectedProducts: Product[] = [];

    //   parseRes.data.products.forEach((product) => {
    //     const productParse = productSchema.safeParse({
    //       name: product.name,
    //       link: `${asosProductConfig.baseUrl}${product.url}`,
    //       image: product.imageUrl,
    //       oldPrice: product.price.previous.value,
    //       price: product.price.current.value,
    //     });

    //     if (productParse.success) {
    //       collectedProducts.push(productParse.data);
    //     } else {
    //       console.log('bad product...');
    //     }
    //   });

    //   return collectedProducts;
    // } else {
    //   throw new Error(`bad api response for ${url}`);
    // }
  },
  getNextPageUrl: (url: string) => {
    const splitUrl = url.split('?');
    const params = new URLSearchParams(splitUrl[1]);

    const offset = params.get('offset');
    params.set('offset', `${offset ? Number(offset) + 72 : 72}`);

    return `${splitUrl[0]}?${params.toString()}`;
  },
  // TODO: correctly set gender
  getGender: (url: string) => {
    return ['Mens', 'Womens'];
  },
};
