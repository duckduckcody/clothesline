import { CheerioAPI } from 'cheerio';
import { BasicCrawlerOptions, CheerioCrawlerOptions } from 'crawlee';
import { Product } from './Product';
import { Website } from './Website';

export type CrawlerConfig = BasicCrawlerConfig | CheerioCrawlerConfig;

export interface BasicCrawlerConfig {
  type: 'basic';
  name: Website;
  baseUrl: string;
  maximumProductsOnPage: number;
  categoryUrls: string[];
  scrape: (url: string) => Promise<Product[] | undefined>;
  getNextPageUrl: (url: string) => string;
  options?: Omit<BasicCrawlerOptions, 'requestHandler'>;
}

export interface CheerioCrawlerConfig {
  type: 'cheerio';
  name: Website;
  baseUrl: string;
  maximumProductsOnPage: number;
  fuckyTolerance?: number;
  shouldEnqueueLinks: (url: string) => boolean;
  categoryUrls: string[];
  scrape: ($: CheerioAPI, url: string) => Promise<Product | undefined>;
  getNextPageUrl: (url: string) => string;
  options?: Omit<CheerioCrawlerOptions, 'requestHandler'>;
}
