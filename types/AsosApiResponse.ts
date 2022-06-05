import { z } from 'zod';

export const asosSearchApiResponseSchema = z.object({
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
        }),
        previous: z.object({
          value: z.number().nullable(),
        }),
      }),
      brandName: z.string(),
      url: z.string(),
      imageUrl: z.string(),
      videoUrl: z.string().nullable(),
    })
  ),
});
export type AsosSearchApiResponse = z.infer<typeof asosSearchApiResponseSchema>;

const asosDetailApiResponseVariant = z.object({
  id: z.number(),
  brandSize: z.string(),
  isInStock: z.boolean(),
  isAvailable: z.boolean(),
  price: z.object({
    current: z.object({ value: z.number() }),
    previous: z.object({ value: z.number() }),
    isMarkedDown: z.boolean(),
  }),
});
export type Variant = z.infer<typeof asosDetailApiResponseVariant>;

export const asosDetailApiResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  gender: z.string(),
  brand: z.object({ name: z.string() }),
  media: z.object({
    images: z.array(z.object({ url: z.string() })),
  }),
  price: z.object({
    current: z.object({ value: z.number() }),
    previous: z.object({ value: z.number() }),
    isMarkedDown: z.boolean(),
  }),
  // sizes
  variants: z.array(asosDetailApiResponseVariant),
  localisedData: z.array(z.object({ locale: z.string(), pdpUrl: z.string() })),
});
export type AsosDetailApiResponse = z.infer<typeof asosDetailApiResponseSchema>;
