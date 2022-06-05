import { BasicCrawlerOptions, RequestQueue } from 'apify';
import { Product } from './Product';

export interface Config {
  name: string;
  baseUrl: string;
  maximumProductsOnPage: number;
  fuckyTolerance?: number;
  shouldEnqueueLinks: (url: string) => boolean;
  /**
   * returns true if at least one product was enqueued
   */
  enqueueLinks?: (url: string, requestQueue: RequestQueue) => Promise<boolean>;
  categoryUrls: string[];
  scrape: (url: string) => Promise<Product[] | Product | undefined>;
  getNextPageUrl?: (url: string) => string;
  crawlerOptions?: Omit<BasicCrawlerOptions, 'handleRequestFunction'>;
}
