import { z } from 'zod';

export const categorySchema = z.enum([
  'hoodies',
  'jackets',
  'jumpers',
  't-shirts',
  'shirts',
  'singlets',
  'polos',
  'pants',
  'jeans',
  'chinos',
  'trackies',
  'shorts',
  'socks',
  'suits',
  'swimwear',
  'tracksuits',
  'underwear',
  'co-ords',
  'designer',
  'lounge wear',
  'dresses',
  'coats',
  'blazers',
  'jumpsuits',
  'lingerie',
  'leggings',
  'skirts',
  'tights',
  'tops',
]);
export type Category = z.infer<typeof categorySchema>;
