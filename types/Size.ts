import range from 'lodash.range';
import { z } from 'zod';

export const sizeSchema = z.enum([
  'XS',
  'S',
  'M',
  'L',
  'XL',
  '2XL',
  '3XL',
  '4XL',
  '5XL',
  ...range(6, 51, 1).map(String),
]);

export type Size = z.infer<typeof sizeSchema>;
