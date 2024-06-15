import express from 'express';

import { buildMongoDBDataCache } from '../core/cache/mongoDB/mongoDBDataCache.ts';
import { buildNotionAPIConnector } from '../core/connector/notionAPIConnector/notionAPIConnector.ts';
import { buildNotionDatastore } from '../core/datastore/notionDatastore.ts';
import { buildS3FileStore } from '../core/fileStore/S3FileStore/S3FileStore.ts';
import { ClientV1 } from './clientV1.ts';

const app = express();
const port = 3000;

// define the different system components
const connector = buildNotionAPIConnector(process.env.NOTION_API_KEY!);
const cache = buildMongoDBDataCache();
const fileStore = buildS3FileStore({} as any);

// build the datastore
const datastore = buildNotionDatastore({
  connector,
  cache,
  fileStore,
});

const client = new ClientV1(datastore);

app.get('/database/:database/documents', async (req, res) => {
  const dbSlug = req.params.database;

  const documents = await client.getDocuments(dbSlug);

  res.json(documents);
});

app.get('/database/:database/documents/:documentSlug', async (req, res) => {
  const dbSlug = req.params.database;
  const docSlug = req.params.documentSlug;

  const document = await client.getDocumentBySlug(dbSlug, docSlug);

  if (!document) {
    // send a 404 if the document is not found
    res.status(404).send(`Document not found in database "${dbSlug}"`);
    return;
  }

  res.json(document);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
