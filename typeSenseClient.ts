import { Client } from 'typesense';

export const typeSenseClient = new Client({
  nodes: [
    {
      host: 'localhost',
      port: 8108,
      protocol: 'http',
    },
  ],
  apiKey: 'JTaNZQxQRu86z8ighMdwYoRDjw5zlSJ1r5C5rlX6CclRQ4cn',
  connectionTimeoutSeconds: 2,
});
