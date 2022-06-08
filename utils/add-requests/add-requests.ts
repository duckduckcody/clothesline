import { RequestQueue } from 'apify';

export const addRequests = async (queue: RequestQueue, urls: string[]) => {
  let results = urls.map((url) => {
    queue.addRequest({ url });
  });
  await Promise.all(results);
};
