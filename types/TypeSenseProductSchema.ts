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
    },
    {
      name: 'price',
      type: 'float',
    },
    {
      name: 'oldPrice',
      type: 'float',
      optional: true,
    },
    {
      name: 'gender',
      type: 'string[]',
    },
    {
      name: 'category',
      type: 'string[]',
    },
    {
      name: 'website',
      type: 'string',
    },
  ],
};
