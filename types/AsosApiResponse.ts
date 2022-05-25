import { z } from 'zod';

export const asosApiResponseSchema = z.object({
  searchTerm: z.string(),
  categoryName: z.string(),
  itemCount: z.number(),
  products: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      price: z.object({
        current: z.object({
          value: z.number(),
          text: z.string(),
        }),
        previous: z.object({
          value: z.number(),
          text: z.string(),
        }),
      }),
      brandName: z.string(),
      url: z.string(),
      imageUrl: z.string(),
      videoUrl: z.string().nullable(),
    })
  ),
});

export type AsosApiResponse = z.infer<typeof asosApiResponseSchema>;
