import { utils } from 'apify';

export const urlToJson = async (url: string) => {
  const res = await utils.requestAsBrowser({ url });
  return JSON.parse(res.body);
};
