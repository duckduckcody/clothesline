import { z } from 'zod';

export const websiteSchema = z.enum([
  'Universal',
  'Asos',
  'Culture Kings',
  'Cool Shirtz',
]);

export type Website = z.infer<typeof websiteSchema>;
