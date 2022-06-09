import { RequestQueue } from 'apify';

/**
 * adds multiple urls to a apify RequestQueue
 * @param queue apify RequestQueue
 * @param urls array of urls to add
 */
export const addRequests = async (queue: RequestQueue, urls: string[]) => {
  let results = urls.map((url) => {
    queue.addRequest({ url });
  });
  await Promise.all(results);
};
