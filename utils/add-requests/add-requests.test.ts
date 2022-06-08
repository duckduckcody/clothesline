import Apify from 'apify';
import { addRequests } from './add-requests';

jest.mock('apify');

describe('add-requests', () => {
  it('adds no requests with empty urls', async () => {
    const requestQueue = await Apify.openRequestQueue();

    expect(Apify.openRequestQueue).toHaveBeenCalled();

    expect(await addRequests(requestQueue, [])).toEqual(undefined);

    console.log('requestQueue.addRequest', requestQueue.addRequest);

    expect(requestQueue.addRequest).toHaveBeenCalledTimes(0);
  });
});
