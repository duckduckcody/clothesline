import { CheerioAPI } from 'cheerio/lib/load';
import { z } from 'zod';
import { SendRequest } from '../../types/SendRequest';
import { Size, sizeSchema } from '../../types/Size';
import { logBadProduct } from '../../utils/logging';

export type SKU = { label: string; sku: string };

export const stockQuantityUrl =
  'https://www.universalstore.com/product/ajax/stockquantity';

const stockStatusSchema = z.enum(['in-stock', 'out-of-stock', 'low-stock']);
const stockQuantityUrlResponseSchema = z.object({
  products: z.array(
    z.object({
      sku: z.string(),
      status: stockStatusSchema,
    })
  ),
});
type StockQuantityUrlResponse = z.infer<typeof stockQuantityUrlResponseSchema>;

export const makeQuantityUrl = (skus: SKU[]) =>
  `${stockQuantityUrl}?${skus.map(({ sku }) => `skus[]=${sku}&`).join('')}`;

export const getPageSkus = ($: CheerioAPI) => {
  const skus: SKU[] = [];

  $('li.dropdown-item').each((i, opt) => {
    const sku = $(opt).attr('data-sku');
    const label = $(opt).text().trim().replaceAll('\n', '');

    if (sku) {
      skus.push({ label, sku });
    }
  });

  return skus;
};

export const makeSizes = (
  apiSkus: StockQuantityUrlResponse,
  pageSkus: SKU[],
  price: number | undefined,
  oldPrice: number | undefined
) => {
  const sizes: Size[] = [];

  apiSkus.products.map((apiSku) => {
    const label = pageSkus.find((pageSku) => pageSku.sku === apiSku.sku)?.label;
    if (label) {
      const sizeParse = sizeSchema.safeParse({
        label,
        inStock: apiSku.status !== 'out-of-stock',
        price,
        oldPrice,
      });

      if (sizeParse.success) {
        sizes.push(sizeParse.data);
      } else {
        logBadProduct(sizeParse.error, {
          message: 'error in universal store makeSizes()',
        });
      }
    }
  });

  return sizes;
};

export const getSizes = async (
  $: CheerioAPI,
  price: number | undefined,
  oldPrice: number | undefined,
  sendRequest: SendRequest
) => {
  const pageSkus = getPageSkus($);

  const stockQuantityRes = await sendRequest({
    url: makeQuantityUrl(pageSkus),
  });
  const stockQuantityJson = JSON.parse(stockQuantityRes.body);

  const stockParse =
    stockQuantityUrlResponseSchema.safeParse(stockQuantityJson);

  if (stockParse.success) {
    return makeSizes(stockParse.data, pageSkus, price, oldPrice);
  } else {
    logBadProduct(stockParse, {
      message: 'error getting universal stock levels',
    });
  }
};
