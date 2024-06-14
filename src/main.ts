import 'dotenv/config';

import { buildDocumentCache } from './core/cache/mongoDB/mongoDBDataCache.ts';
import { buildNotionAPIConnector } from './core/connector/notionAPIConnector/notionAPIConnector.ts';

import { buildNotionDatastore } from './core/datastore/notionDatastoreV1.ts';

const connector = buildNotionAPIConnector(process.env.NOTION_API_KEY!);

const cache = buildDocumentCache();

const datastore = buildNotionDatastore({
  connector,
  cache,
});

// syncs databases
// await datastore.syncDatabases();
// await datastore.syncUsers();
//
// const databases = await cache.queryDatabases();
// //
// for (const database of databases) {
//   await datastore.syncDatabaseDocuments(database.notionId);
// }

// sync blocks for the test article
await datastore.sync.documentContent('502aac19-da1f-433e-9601-1e0800ecda15');
