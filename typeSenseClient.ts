import { Client } from 'typesense';

export const typeSenseClient = new Client({
  nodes: [
    {
      host: '7h2kvajliz0up16qp-1.a1.typesense.net',
      port: 443,
      protocol: 'https',
    },
  ],
  apiKey: '6o3OIIikU2D5kmNLApXxSdvIqTu3arwR',
  connectionTimeoutSeconds: 2,
});
