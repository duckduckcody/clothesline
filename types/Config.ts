import { CheerioAPI } from 'cheerio/lib/load';
import { Gender } from './Gender';
import { Product } from './Product';

export interface Config {
  name: string;
  baseUrl: string;
  categoryUrls: string[];
  crawlerType: 'cheerio' | 'playwright' | 'api';
  scraper: ($: CheerioAPI) => Product[];
  getNextPageUrl: (url: string) => string;
  getGender: (url: string) => Gender[];
}
