import { Dataset } from 'crawlee';
import { DatasetName } from '../types/DatasetName';
import { productCollectionName } from '../types/TypeSenseProductSchema';
import { typeSenseClient } from '../typesense/typeSenseClient';

export const push = async () => {
  const dataSet = await Dataset.open(DatasetName.products);

  // simplify sizes until typesense can index object arrays
  const data = await dataSet.map((product) => {
    // @ts-ignore
    const sizes = product.sizes.map((s) => s.label);
    // @ts-ignore
    const { price, oldPrice } = product.sizes[0];

    return {
      ...product,
      sizes,
      price,
      oldPrice,
    };
  });

  try {
    await typeSenseClient
      .collections(productCollectionName)
      .documents()
      .import(data, { action: 'upsert' });
  } catch (e) {
    return console.log(e, 'error pushing to typesense');
  }

  console.log('documents pushed to typesense');
};

push();
