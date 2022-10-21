import { load } from 'cheerio';
import { utils } from 'crawlee';

export const urlToCheerio = async (url: string) => {
  const res = await utils.requestAsBrowser({ url });
  return load(res.body);
};
