import { BasicCrawlerOptions } from 'crawlee';
import { Product } from './Product';
import { Website } from './Website';

export interface Config {
  type: 'cheerio' | 'basic';
  name: Website;
  baseUrl: string;
  maximumProductsOnPage: number;
  fuckyTolerance?: number;
  shouldEnqueueLinks: (url: string) => boolean;
  getEnqueueLinks?: (html: string) => string[];
  categoryUrls: string[];
  scrape: (url: string) => Promise<Product[] | Product | undefined>;
  getNextPageUrl?: (url: string) => string;
  crawlerOptions?: Omit<BasicCrawlerOptions, 'requestHandler'>;
}
