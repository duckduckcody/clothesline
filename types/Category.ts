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
  'trackpants',
  'shorts',
  'socks',
  'suits',
  'swimwear',
  'tracksuits',
  'joggers',
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
  'outerwear',
  'activewear',
  'crop-tops',
  'sets',
  'bras',
  'long sleeve tees',
]);
export type Category = z.infer<typeof categorySchema>;
