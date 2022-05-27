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
]);

export type Size = z.infer<typeof sizeSchema>;
