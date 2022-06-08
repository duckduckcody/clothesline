import {
  productCollectionName,
  TypeSenseProductSchema,
} from '../types/TypeSenseProductSchema';
import { typeSenseClient } from '../typesense/typeSenseClient';

const makeCollections = async () => {
  try {
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
