import { openDataset } from 'apify';

export const logBadProduct = async (res: object, extraData?: object) => {
  const dataset = await openDataset('bad-product');
  console.log('bad product found');
  dataset.pushData({ extraData, res });
};

export const logBadCategory = async (
  categoryName: string,
  extraData?: object
) => {
  const dataset = await openDataset('bad-category');
  console.log('bad category found');
  dataset.pushData({ categoryName, extraData });
};

export const logBadRequest = async (url: string, error: unknown) => {
  const dataset = await openDataset('bad-url');
  console.log('bad url found');
  dataset.pushData({ url, error });
};

export const logBadResponse = async <T extends object>(res: T) => {
  const dataset = await openDataset('bad-response');
  console.log('bad response found');
  dataset.pushData(res);
};

export const logBadEnqueue = async (res: object, extraData?: object) => {
  const dataset = await openDataset('bad-enqueue');
  console.log('bad enqueue found');
  dataset.pushData({ extraData, res });
};
