import fs from 'fs';
import ini from 'ini';
import { Client } from 'typesense';
import { z } from 'zod';

const typeSenseClientConfigSchema = z.object({
  adminKey: z.string(),
  host: z.string(),
  port: z.string(),
  protocol: z.string(),
});

export const makeTypeSenseClient = (production: boolean = false) => {
  if (production) {
    const configFile = ini.parse(
      fs.readFileSync('./typesense/typesense-client.config.ini', 'utf-8')
    );

    const config = typeSenseClientConfigSchema.safeParse(configFile);

    if (config.success) {
      return new Client({
        nodes: [
          {
            host: config.data.host,
            port: parseInt(config.data.port),
            protocol: config.data.protocol,
          },
        ],
        apiKey: config.data.adminKey,
        connectionTimeoutSeconds: 30,
      });
    } else {
      console.log('config.error', config.error);
      throw new Error('bad production typesense config');
    }
  } else {
    return new Client({
      nodes: [
        {
          host: 'localhost',
          port: 8108,
          protocol: 'http',
        },
      ],
      apiKey: 'xyz',
      connectionTimeoutSeconds: 30,
    });
  }
};
