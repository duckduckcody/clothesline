import { Dataset, KeyValueStore } from 'crawlee';
import { DatasetName } from '../types/DatasetName';

export const logBadProduct = async (res: object, extraData?: object) => {
  const dataset = await Dataset.open(DatasetName.badProduct);
  console.log('bad product found');
  dataset.pushData({ extraData, res });
};

export const logBadCategory = async (categoryName: string) => {
  const badCategories =
    (await KeyValueStore.getValue(DatasetName.badCategory)) ?? [];

  // @ts-ignore
  if (!badCategories.includes(categoryName)) {
    await KeyValueStore.setValue(
      DatasetName.badCategory,
      // @ts-ignore
      badCategories.concat(categoryName)
    );
    console.log('bad category', categoryName);
  }
};

export const logBadRequest = async (url: string, error: unknown) => {
  const dataset = await Dataset.open(DatasetName.badRequest);
  console.log('bad request ', url);
  dataset.pushData({ url, error });
};

export const logBadResponse = async <T extends object>(res: T) => {
  const dataset = await Dataset.open(DatasetName.badResponse);
  console.log('bad response');
  dataset.pushData(res);
};

export const logBadEnqueue = async (res: object, extraData?: object) => {
  const dataset = await Dataset.open(DatasetName.badEnqueue);
  console.log('bad enqueue');
  dataset.pushData({ extraData, res });
};
