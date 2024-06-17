import 'dotenv/config';

import { buildMongoDBDataCache } from './core/cache/mongoDB/mongoDBDataCache.ts';
import { buildNotionAPIConnector } from './core/connector/notionAPIConnector/notionAPIConnector.ts';
import { buildNotionDatastore } from './core/datastore/notionDatastore.ts';

import { buildS3FileStore } from './core/fileStore/S3FileStore/S3FileStore.ts';

// define the different system components
const connector = buildNotionAPIConnector(process.env.NOTION_API_KEY!);
const cache = buildMongoDBDataCache();
const fileStore = buildS3FileStore({
  bucket: 'a16n-notion-cms-content',
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
  region: 'us-east-1',
  s3Url: 'https://cms.a16n.dev',
});

// build the datastore
const datastore = buildNotionDatastore({
  connector,
  cache,
  fileStore,
});

// Example #1: Populate the cache
await datastore.sync.users();
const databases = await datastore.sync.databases();

for (const database of databases) {
  await datastore.sync.databaseDocuments(database.id);
}

// Example #2: Update a document
const document = await datastore.sync.databaseDocuments('example-document-id');
