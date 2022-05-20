import { CheerioAPI } from 'cheerio/lib/load';
import { Gender } from './Gender';
import { Product } from './Product';

export interface Config {
  name: string;
  baseUrl: string;
  maximumProductsOnPage: number;
  fuckyTolerance?: number;
  categoryUrls: string[];
  crawlerType: 'cheerio' | 'playwright' | 'api';
  scraper: ($: CheerioAPI, url?: string) => Product[];
  getNextPageUrl: (url: string) => string;
  getGender: (url: string) => Gender[];
}
