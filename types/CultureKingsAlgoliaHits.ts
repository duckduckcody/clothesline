export interface Variant {
  availableForSale: boolean;
  inStock: boolean;
  price: number;
  compareAtPrice: number;
  title: string;
}

export interface CultureKingsAlgoliaHits {
  title: string;
  price: number;
  compareAtPrice: number;
  handle: string;
  image: string;
  openstyleStyleCode: string;
  gender: string;
  description: string;
  images: string[];
  styleGroup: string;
  sizes: string[];
  vendor: string;
  variants: Variant[];
}
