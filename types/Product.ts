import { z } from 'zod';

export const productSchema = z.object({
  name: z.string(),
  link: z.string(),
  image: z.string(),
  oldPrice: z.number().optional(),
  price: z.number(),
});

export type Product = z.infer<typeof productSchema>;
