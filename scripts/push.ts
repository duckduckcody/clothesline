import { Dataset } from 'crawlee';
import shuffle from 'lodash.shuffle';
import { DatasetName } from '../types/DatasetName';
import { productCollectionName } from '../types/TypeSenseProductSchema';
import { makeTypeSenseClient } from '../typesense/typeSenseClient';

export const push = async () => {
  console.log('formatting data');
  const dataSet = await Dataset.open(DatasetName.products);

  let data: {}[] = [];
  await dataSet.forEach(async (item) => {
    if (item.sizes && item.sizes.length > 0) {
      // @ts-ignore
      const sizes = item.sizes.map((s) => s.label);
      // @ts-ignore
      const { price, oldPrice } = item.sizes[0];

      data.push({
        ...item,
        sizes,
        price,
        oldPrice,
      });
    }
  });

  // randomise data to stop website grouping
  data = shuffle(data);

  try {
    console.log('pushing data');
    const typeSenseClient = makeTypeSenseClient(process.argv[2] === 'prod');

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
