import { z } from 'zod';

export const genderSchema = z.enum(['Mens', 'Womens']);

export type Gender = z.infer<typeof genderSchema>;
