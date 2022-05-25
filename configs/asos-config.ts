import { utils } from 'apify';
import { asosApiResponseSchema } from '../types/AsosApiResponse';
import { Config } from '../types/Config';
import { Product, productSchema } from '../types/Product';
import { logBadProduct, logBadResponse } from '../utils/logging';
import { urlToJson } from '../utils/urlToJson';

const API_URL = 'https://www.asos.com/api/product/search/v2/categories';
const params =
  '?channel=desktop-web&country=AU&currency=AUD&lang=en-AU&limit=72&rowlength=4&store=AU';

export const asosProductConfig: Config = {
  name: 'Asos',
  baseUrl: 'https://www.asos.com/au',
  maximumProductsOnPage: 72,
  categoryUrls: [
    `${API_URL}/5668${params}`, // mens hoodies
    `${API_URL}/3606${params}`, // mens jackets
    `${API_URL}/4208${params}`, // mens jeans
    `${API_URL}/4208${params}`, // mens jeans
    `${API_URL}/3602${params}`, // mens shirts
    `${API_URL}/7616${params}`, // mens t-shirts and singlets
    `${API_URL}/28291${params}`, // mens coords
    `${API_URL}/27111${params}`, // mens designer
    `${API_URL}/14274${params}`, // mens trackies
    `${API_URL}/7617${params}`, // mens jumpers
    `${API_URL}/18797${params}`, // mens lounge wear
    `${API_URL}/4910${params}`, // mens pants & chinos
    `${API_URL}/4616${params}`, // mens polos
    `${API_URL}/7078${params}`, // mens shorts
    `${API_URL}/16329${params}`, // mens socks
    `${API_URL}/5678${params}`, // mens suits
    `${API_URL}/13210${params}`, // mens swimwear
    `${API_URL}/26776${params}`, // mens tracksuits
    `${API_URL}/20317${params}`, // mens underwear

    `${API_URL}/8799${params}`, // womens dresses
    `${API_URL}/2641${params}`, // womens coats
    `${API_URL}/3630${params}`, // womens jeans
    `${API_URL}/2637${params}`, // womens jumpers
    `${API_URL}/11318${params}`, // womens shirts
    `${API_URL}/11896${params}`, // womens Blazers
    `${API_URL}/15210${params}`, // womens Designer
    `${API_URL}/11321${params}`, // Women's Hoodies & Sweatshirts
    `${API_URL}/7618${params}`, // Women's Jumpsuits & Playsuits
    `${API_URL}/6046${params}`, // Women's Lingerie
    `${API_URL}/21867${params}`, // Women's loungewear
    `${API_URL}/19224${params}`, // Women's Multi Packs
    `${API_URL}/2640${params}`, // Women's Pants & Leggings
    `${API_URL}/9263${params}`, // Women's Shorts
    `${API_URL}/2639${params}`, // Women's Skirts
    `${API_URL}/7657${params}`, // Women's Socks & Tights
    `${API_URL}/13632${params}`, // Women's Suits & Tailoring
    `${API_URL}/2238${params}`, // Women's  Swimwear & Beachwear
    `${API_URL}/4169${params}`, // Women's Tops
    `${API_URL}/27953${params}`, // Women's Tracksuits
    `${API_URL}/19632${params}`, // Women's Co-ords
  ],
  scrape: async (url: string) => {
    // asos api seems sophisticated, wait between requests to avoid ip block
    await utils.sleep(5000);

    const collectedProducts: Product[] = [];

    const json = await urlToJson(url);
    if (!json) return collectedProducts;

    const parseRes = asosApiResponseSchema.safeParse(json);

    if (parseRes.success) {
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
          logBadProduct(productParse);
        }
      });
    } else {
      logBadResponse(parseRes);
    }

    return collectedProducts;
  },
  getNextPageUrl: (url: string) => {
    const splitUrl = url.split('?');
    const params = new URLSearchParams(splitUrl[1]);

    const offset = params.get('offset');
    params.set(
      'offset',
      `${
        offset
          ? Number(offset) + asosProductConfig.maximumProductsOnPage
          : asosProductConfig.maximumProductsOnPage
      }`
    );

    return `${splitUrl[0]}?${params.toString()}`;
  },
  // TODO: correctly set gender
  getGender: (url: string) => {
    return ['Mens', 'Womens'];
  },
};
