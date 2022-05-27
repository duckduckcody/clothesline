import { QueueOperationInfo, RequestQueue } from 'apify';
import { Gender } from './Gender';
import { Product } from './Product';

export interface Config {
  name: string;
  baseUrl: string;
  maximumProductsOnPage: number;
  fuckyTolerance?: number;
  shouldEnqueueLinks: (url: string) => boolean;
  enqueueLinks: (
    url: string,
    requestQueue: RequestQueue
  ) => Promise<Array<QueueOperationInfo>>;
  categoryUrls: string[];
  scrape: (url: string) => Promise<Product[] | Product | undefined>;
  getNextPageUrl?: (url: string) => string;
  getGender: (url: string) => Gender[];
}
