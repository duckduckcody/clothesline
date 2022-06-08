import { TypeSenseProductSchema } from '../types/TypeSenseProductSchema';
import { typeSenseClient } from '../typeSenseClient';

const makeCollections = async () => {
  try {
    const res = await typeSenseClient
      .collections()
      .create(TypeSenseProductSchema);

    console.log(res, 'collections made');
  } catch (e) {
    console.log(e, 'error pushing to typesense');
  }
};

makeCollections();
