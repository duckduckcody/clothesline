import { CheerioAPI } from 'cheerio/lib/load';
import { Product } from './Product';

export interface Config {
  name: string;
  baseUrl: string;
  categoryUrls: string[];
  crawlerType: 'cheerio' | 'playwright' | 'api';
  scraper: ($: CheerioAPI) => Product[];
  getNextPageUrl: (url: string) => string;
}
