import express from 'express';

import { buildDocumentCache } from '../core/datastore/documentCacheV1.ts';
import { ClientV1 } from './clientV1.ts';

const app = express();
const port = 3000;

const documentCache = buildDocumentCache();
const client = new ClientV1(documentCache);

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
