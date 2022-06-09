import { RequestQueue } from 'apify';

// when given urls, check that they are added to the queue using the addRequest functions
// mock the queue object where the addRequest is a jest.fn()

// can you make a mock out of a type?

export const addRequests = async (queue: RequestQueue, urls: string[]) => {
  let results = urls.map((url) => {
    queue.addRequest({ url });
  });
  await Promise.all(results);
};
