import { z } from 'zod';

export const websiteSchema = z.enum([
  'Universal',
  'Asos',
  'Culture Kings',
  'Cool Shirtz',
  'Edge Clothing',
]);

export type Website = z.infer<typeof websiteSchema>;
