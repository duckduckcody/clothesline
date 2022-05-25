import { Gender } from './Gender';
import { Product } from './Product';

export interface Config {
  name: string;
  baseUrl: string;
  maximumProductsOnPage: number;
  fuckyTolerance?: number;
  categoryUrls: string[];
  scrape: (url: string) => Promise<Product[] | undefined>;
  getNextPageUrl: (url: string) => string;
  getGender: (url: string) => Gender[];
}
