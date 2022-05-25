import { utils } from 'apify';
import { load } from 'cheerio';

export const urlToCheerio = async (url: string) => {
  const res = await utils.requestAsBrowser({ url });
  return load(res.body);
};
