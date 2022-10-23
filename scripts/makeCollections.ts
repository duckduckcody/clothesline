import {
  productCollectionName,
  TypeSenseProductSchema,
} from '../types/TypeSenseProductSchema';
import { makeTypeSenseClient } from '../typesense/typeSenseClient';

const makeCollections = async () => {
  try {
    const typeSenseClient = makeTypeSenseClient(process.argv[2] === 'prod');
    typeSenseClient.collections(productCollectionName).delete();

    const res = await typeSenseClient
      .collections()
      .create(TypeSenseProductSchema);

    console.log(res, 'collections made');
  } catch (e) {
    console.log(e, 'error pushing to typesense');
  }
};

makeCollections();
