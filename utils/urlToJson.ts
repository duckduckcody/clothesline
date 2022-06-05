import { utils } from 'apify';
import { logBadRequest } from './logging';

export const urlToJson = async (url: string) => {
  try {
    const res = await utils.requestAsBrowser({ url });
    console.log('res', res);
    return JSON.parse(res.body);
  } catch (e) {
    logBadRequest(url, { e });
    return undefined;
  }
};
