import Apify from 'apify';
import { addRequests } from './add-requests';

jest.mock('apify', () => ({
  openRequestQueue: jest.fn(() => ({ addRequest: jest.fn() })),
}));

describe('add-requests', () => {
  it('adds no requests with empty urls', async () => {
    const requestQueue = await Apify.openRequestQueue();
    expect(requestQueue).toBeTruthy();

    addRequests(requestQueue, []);
    expect(requestQueue.addRequest).toBeCalledTimes(0);
  });

  it('add single url to queue', async () => {
    const requestQueue = await Apify.openRequestQueue();
    expect(requestQueue).toBeTruthy();

    addRequests(requestQueue, ['https://www.google.com']);
    expect(requestQueue.addRequest).toHaveBeenCalledWith({
      url: 'https://www.google.com',
    });
  });

  it('add multiple urls to queue', async () => {
    const requestQueue = await Apify.openRequestQueue();
    expect(requestQueue).toBeTruthy();

    addRequests(requestQueue, [
      'https://www.google.com',
      'https://www.123.com',
      'https://www.xyz.com',
    ]);
    expect(requestQueue.addRequest).toHaveBeenCalledTimes(3);

    // TODO: improve this
    // @ts-ignore
    expect(requestQueue.addRequest.mock.calls).toEqual([
      [{ url: 'https://www.google.com' }],
      [{ url: 'https://www.123.com' }],
      [{ url: 'https://www.xyz.com' }],
    ]);
  });
});
