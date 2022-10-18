import { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';

export const productCollectionName = 'products';
export const TypeSenseProductSchema: CollectionCreateSchema = {
  name: 'products',
  fields: [
    {
      name: 'name',
      type: 'string',
    },
    {
      name: 'brand',
      type: 'string',
      facet: true,
    },
    {
      name: 'details',
      type: 'string',
    },
    {
      name: 'sizing',
      type: 'string',
      optional: true,
    },
    {
      name: 'link',
      type: 'string',
    },
    {
      name: 'images',
      type: 'string[]',
    },
    {
      name: 'sizes',
      type: 'string[]',
      facet: true,
    },
    {
      name: 'price',
      type: 'float',
      facet: true,
    },
    {
      name: 'oldPrice',
      type: 'float',
      optional: true,
    },
    {
      name: 'genders',
      type: 'string[]',
      facet: true,
    },
    {
      name: 'categories',
      type: 'string[]',
      facet: true,
    },
    {
      name: 'website',
      type: 'string',
      facet: true,
    },
  ],
};
