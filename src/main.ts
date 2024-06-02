import 'dotenv/config';

import { writeFileSync } from 'node:fs';

import { buildNotionConnector } from './core/connector/notionConnectorV1.ts';
import { buildDocumentCache } from './core/datastore/documentCacheV1.ts';
import { buildNotionDatastore } from './core/datastore/notionDatastoreV1.ts';

const cacheHandler = async (url: string) => {
  return url;
};

const connector = buildNotionConnector(
  process.env.NOTION_API_KEY!,
  cacheHandler,
);

const cache = buildDocumentCache();

const datastore = buildNotionDatastore({
  connector,
  cache,
});

await datastore.syncDocumentBlocks('ad2a3f8d-7d65-42ec-bec5-d0c386a32ea4');

const document = await cache.queryDocumentByNotionId(
  'ad2a3f8d-7d65-42ec-bec5-d0c386a32ea4',
);

writeFileSync('datastore.json', JSON.stringify(document, null, 2));
