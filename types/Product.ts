import { z } from 'zod';
import { categorySchema } from './Category';
import { genderSchema } from './Gender';
import { sizeSchema } from './Size';

export const productSchema = z.object({
  name: z.string(),
  brand: z.string(),
  details: z.string(),
  sizing: z.string().optional(),
  link: z.string(),
  images: z.array(z.string()),
  sizes: z.array(sizeSchema),
  gender: z.array(genderSchema),
  category: z.array(categorySchema),
});

export type Product = z.infer<typeof productSchema>;
