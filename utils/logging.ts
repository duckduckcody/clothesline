import { openDataset } from 'apify';

export const logBadProduct = async (res: object, extraData?: object) => {
  const dataset = await openDataset('BAD_PRODUCT');
  console.log('BAD_PRODUCT logged');
  dataset.pushData({ extraData, res });
};

export const logBadRequest = async (url: string, error: unknown) => {
  const dataset = await openDataset('BAD_URL');
  console.log('BAD_URL logged');
  dataset.pushData({ url, error });
};

export const logBadResponse = async <T extends object>(res: T) => {
  const dataset = await openDataset('BAD_RESPONSE');
  console.log('BAD_RESPONSE logged');
  dataset.pushData(res);
};

export const logBadEnqueue = async (res: object, extraData?: object) => {
  const dataset = await openDataset('BAD_ENQUEUE');
  console.log('BAD_ENQUEUE logged');
  dataset.pushData({ extraData, res });
};
