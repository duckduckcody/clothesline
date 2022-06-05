import { z } from 'zod';
import { sizeSchema } from './Size';

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
