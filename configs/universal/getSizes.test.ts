import { load } from 'cheerio';
import { urlToJson } from '../../utils/urlToJson';
import {
  getPageSkus,
  getSizes,
  makeQuantityUrl,
  makeSizes,
  stockQuantityUrl,
} from './getSizes';
import { productDetails } from './product-details.snapshot';

describe('getSizes makeQuantityUrl', () => {
  it('does nothing with empty array', () => {
    expect(makeQuantityUrl([])).toEqual(`${stockQuantityUrl}?`);
  });

  it('adds one sku to url', () => {
    expect(makeQuantityUrl([{ label: 'S', sku: '1235' }])).toEqual(
      `${stockQuantityUrl}?skus[]=1235&`
    );
  });

  it('adds multiple sku to url', () => {
    expect(
      makeQuantityUrl([
        { label: 'S', sku: '1235' },
        { label: 'S', sku: '3456' },
        { label: 'S', sku: '99989' },
      ])
    ).toEqual(`${stockQuantityUrl}?skus[]=1235&skus[]=3456&skus[]=99989&`);
  });
});

describe('getSizes getPageSkus', () => {
  it('gets correct options', () => {
    expect(getPageSkus(load(productDetails))).toEqual([
      { label: '4', sku: '32247923' },
      { label: '6', sku: '32247930' },
      { label: '8', sku: '32247947' },
      { label: '10', sku: '32247954' },
      { label: '12', sku: '32247961' },
    ]);
  });
});

describe('getSizes makeSizes', () => {
  it('empty if no pageSkus', () => {
    expect(
      makeSizes(
        { products: [{ sku: '123', status: 'out-of-stock' }] },
        [],
        0,
        0
      )
    ).toEqual([]);
  });

  it('correctly maps single api stock level to page skus', () => {
    expect(
      makeSizes(
        { products: [{ sku: '123', status: 'out-of-stock' }] },
        [{ sku: '123', label: 'X' }],
        0,
        0
      )
    ).toEqual([{ inStock: false, label: 'X', price: 0, oldPrice: 0 }]);
  });

  it('correctly maps multiple api stock level to page skus', () => {
    expect(
      makeSizes(
        {
          products: [
            { sku: '1', status: 'out-of-stock' },
            { sku: '2', status: 'in-stock' },
            { sku: '3', status: 'low-stock' },
            { sku: '4', status: 'out-of-stock' },
            { sku: '5', status: 'in-stock' },
          ],
        },
        [
          { sku: '1', label: 'X' },
          { sku: '2', label: 'M' },
          { sku: '3', label: 'L' },
          { sku: '4', label: 'XL' },
          { sku: '5', label: 'XXL' },
        ],
        0,
        0
      )
    ).toEqual([
      { inStock: false, label: 'X', price: 0, oldPrice: 0 },
      { inStock: true, label: 'M', price: 0, oldPrice: 0 },
      { inStock: true, label: 'L', price: 0, oldPrice: 0 },
      { inStock: false, label: 'XL', price: 0, oldPrice: 0 },
      { inStock: true, label: 'XXL', price: 0, oldPrice: 0 },
    ]);
  });

  it('Ignores any api skus that dont map to page skus', () => {
    expect(
      makeSizes(
        {
          products: [
            { sku: '1', status: 'out-of-stock' },
            { sku: '2', status: 'in-stock' },
          ],
        },
        [{ sku: '2', label: 'X' }],
        0,
        0
      )
    ).toEqual([{ inStock: true, label: 'X', price: 0, oldPrice: 0 }]);
  });
});

jest.mock('../../utils/urlToJson', () => {
  return {
    urlToJson: jest.fn(async () => {
      return Promise.resolve({
        products: [
          { status: 'out-of-stock', sku: '32247923' },
          { status: 'out-of-stock', sku: '32247930' },
          { status: 'out-of-stock', sku: '32247947' },
          { status: 'out-of-stock', sku: '32247954' },
          { status: 'in-stock', sku: '32247961' },
        ],
      });
    }),
  };
});

describe('getSizes getSizes', () => {
  it('gets correct sizes', async () => {
    const res = await getSizes(load(productDetails), 0, 0);
    expect(res).toEqual([
      { label: '4', inStock: false, price: 0, oldPrice: 0 },
      { label: '6', inStock: false, price: 0, oldPrice: 0 },
      { label: '8', inStock: false, price: 0, oldPrice: 0 },
      { label: '10', inStock: false, price: 0, oldPrice: 0 },
      { label: '12', inStock: true, price: 0, oldPrice: 0 },
    ]);
    expect(urlToJson).toHaveBeenCalledWith(
      `${stockQuantityUrl}?skus[]=32247923&skus[]=32247930&skus[]=32247947&skus[]=32247954&skus[]=32247961&`
    );
  });
});
