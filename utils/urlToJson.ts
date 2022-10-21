import { logBadRequest } from './logging';

export const urlToJson = async (url: string) => {
  try {
    const res = await utils.requestAsBrowser({ url });
    return JSON.parse(res.body);
  } catch (e) {
    logBadRequest(url, { e });
    return undefined;
  }
};
