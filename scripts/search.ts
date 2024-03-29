import { productCollectionName } from '../types/TypeSenseProductSchema';
import { makeTypeSenseClient } from '../typesense/typeSenseClient';

export const search = async () => {
  const typeSenseClient = makeTypeSenseClient();
  const res = await typeSenseClient
    .collections(productCollectionName)
    .documents()
    .search({
      q: process.argv[2] ?? '',
      query_by: 'name',
    });

  console.log('search result', {
    ...res,
    // @ts-ignore
    hits: res.hits?.map((h) => h.document.name),
  });
};

search();
