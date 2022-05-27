import { z } from 'zod';

export const productSchema = z.object({
  name: z.string(),
  brand: z.string(),
  details: z.string(),
  sizing: z.string().optional(),
  link: z.string(),
  images: z.array(z.string()),
  oldPrice: z.number().optional(),
  price: z.number(),
});

export type Product = z.infer<typeof productSchema>;
