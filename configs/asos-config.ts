import { asosApiResponseSchema } from '../types/AsosApiResponse';
import { Config } from '../types/Config';
import { Product, productSchema } from '../types/Product';
import { urlToJson } from '../utils/urlToJson';

export const asosProductConfig: Config = {
  name: 'Asos',
  baseUrl: 'https://www.asos.com/au',
  maximumProductsOnPage: 15,
  categoryUrls: [
    'https://www.asos.com/api/product/search/v2/categories/3602?channel=desktop-web&country=AU&currency=AUD&keyStoreDataversion=dup0qtf-35&lang=en-AU&limit=72&offset=72&rowlength=4&store=AU',
  ],
  scrape: async (url: string) => {
    const json = await urlToJson(url);
    const parseRes = asosApiResponseSchema.safeParse(json);

    if (parseRes.success) {
      const collectedProducts: Product[] = [];

      parseRes.data.products.forEach((product) => {
        const productParse = productSchema.safeParse({
          name: product.name,
          link: `${asosProductConfig.baseUrl}${product.url}`,
          image: product.imageUrl,
          oldPrice: product.price.previous.value,
          price: product.price.current.value,
        });

        if (productParse.success) {
          collectedProducts.push(productParse.data);
        } else {
          console.log('bad product...');
        }
      });

      return collectedProducts;
    } else {
      throw new Error(`bad api response for ${url}`);
    }
  },
  getNextPageUrl: (url: string) => {
    const splitUrl = url.split('?');
    let pageNumber = Number(splitUrl[1]?.split('=')?.[1] ?? 1);

    return `${splitUrl[0]}?page=${pageNumber + 1}`;
  },
  getGender: (url: string) => {
    return ['Mens', 'Womens'];
  },
};
