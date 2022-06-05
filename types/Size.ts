import { z } from 'zod';

export const sizeSchema = z.object({
  label: z.string(),
  inStock: z.boolean(),
  price: z.number(),
  oldPrice: z.number().optional(),
});

export type Size = z.infer<typeof sizeSchema>;
