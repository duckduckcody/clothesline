import { z } from 'zod';
import { categorySchema } from './Category';
import { genderSchema } from './Gender';
import { sizeSchema } from './Size';
import { websiteSchema } from './Website';

export const productSchema = z.object({
  name: z.string(),
  brand: z.string(),
  details: z.string(),
  sizing: z.string().optional(),
  link: z.string(),
  images: z.array(z.string()).nonempty(),
  sizes: z.array(sizeSchema),
  genders: z.array(genderSchema).nonempty(),
  categories: z.array(categorySchema).nonempty(),
  website: z.string(websiteSchema),
});

export type Product = z.infer<typeof productSchema>;
