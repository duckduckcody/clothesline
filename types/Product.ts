import { z } from 'zod';

const sizeSchema = z.object({ label: z.string(), inStock: z.boolean() });

export const productSchema = z.object({
  name: z.string(),
  brand: z.string(),
  details: z.string(),
  sizing: z.string().optional(),
  link: z.string(),
  images: z.array(z.string()),
  oldPrice: z.number().optional(),
  price: z.number(),
  sizes: z.array(sizeSchema),
});

export type Product = z.infer<typeof productSchema>;
export type Size = z.infer<typeof sizeSchema>;
