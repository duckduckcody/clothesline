import { TypeSenseProductSchema } from '../types/TypeSenseProductSchema';
import { typeSenseClient } from '../typeSenseClient';

const makeCollections = async () => {
  const res = await typeSenseClient
    .collections()
    .create(TypeSenseProductSchema);
  console.log('result', res);
};

makeCollections();
