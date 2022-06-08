import { Client } from 'typesense';

// start server
// sudo /usr/bin/./typesense-server --config=/etc/typesense/typesense-server.ini

// api key generated in
// /etc/typesense/typesense-server.ini

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
