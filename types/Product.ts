import { z } from 'zod';

export const sizeSchema = z.object({
  label: z.string(),
  inStock: z.boolean(),
  price: z.number(),
  oldPrice: z.number().optional(),
});

export const productSchema = z.object({
  name: z.string(),
  brand: z.string(),
  details: z.string(),
  sizing: z.string().optional(),
  link: z.string(),
  images: z.array(z.string()),
  sizes: z.array(sizeSchema),
});

export type Product = z.infer<typeof productSchema>;
export type Size = z.infer<typeof sizeSchema>;
