import { DocumentCacheInterface } from './documentCacheInterface';
import {
  NotionDatastoreConfig,
  NotionDatastoreInterface,
} from './notionDatastoreInterface';

import { NotionConnectorInterface } from '../connector/notionConnectorInterface';

export class NotionDatastoreV1 implements NotionDatastoreInterface {
  private connector: NotionConnectorInterface;
  private cache: DocumentCacheInterface;

  constructor(config: NotionDatastoreConfig) {
    this.connector = config.connector;
    this.cache = config.cache;
  }

  async syncDatabaseDocuments(databaseId: string): Promise<void> {
    const documents = await this.connector.getDocumentsInDatabase(databaseId);

    await this.cache.cacheDocuments(documents);
  }

  async syncDatabases(): Promise<void> {
    const databases = await this.connector.getConnectedDatabases();

    // store them in the local cache
    await this.cache.cacheDatabases(databases);
  }

  async syncDocumentBlocks(documentId: string): Promise<void> {
    const blocks = await this.connector.getDocumentBlocks(documentId);

    await this.cache.cacheDocumentBlocks(documentId, blocks);
  }

  async syncDocument(documentId: string): Promise<void> {
    // First sync the document properties, and check the "last edited" timestamp to determine if we need to sync the blocks
    const document = await this.connector.getDocument(documentId);

    const cachedDocument = await this.cache.cacheDocument(document);

    if (this.cache.areCachedDocumentBlocksStale(cachedDocument)) {
      await this.syncDocumentBlocks(documentId);
    }
  }

  syncUsers(): Promise<void> {
    return Promise.resolve(undefined);
  }
}
