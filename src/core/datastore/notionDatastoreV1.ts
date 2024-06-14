import {
  NotionDatastoreConfig,
  NotionDatastoreInterface,
} from './notionDatastoreInterface';

import { DataCacheInterface } from '../cache/dataCacheInterface.ts';
import { NotionConnectorInterface } from '../connector/notionConnectorInterface';
import { FileStoreInterface } from '../fileStore/fileStoreInterface.ts';

export class NotionDatastoreV1 implements NotionDatastoreInterface {
  private connector: NotionConnectorInterface;
  private cache: DataCacheInterface;
  private fileStore: FileStoreInterface;

  constructor(config: NotionDatastoreConfig) {
    this.connector = config.connector;
    this.cache = config.cache;
    this.fileStore = config.fileStore;
  }

  private async syncDatabaseDocumentsById(databaseId: string): Promise<void> {
    const documents = await this.connector.getDocumentsInDatabase(databaseId);

    await this.cache.cacheDocuments(documents);
  }

  private async syncDatabases(): Promise<void> {
    const databases = await this.connector.getConnectedDatabases();

    // store them in the local cache
    await this.cache.cacheDatabases(databases);
  }

  private async syncDocumentContentById(documentId: string): Promise<void> {
    const blocks = await this.connector.getDocumentContent(documentId);

    await this.cache.cacheDocumentContent(documentId, blocks);
  }

  private async syncDocumentById(documentId: string): Promise<void> {
    // First sync the document properties, and check the "last edited" timestamp to determine if we need to sync the blocks
    const document = await this.connector.getDocument(documentId);

    const cachedDocument = await this.cache.cacheDocument(document);

    if (this.cache.areCachedDocumentBlocksStale(cachedDocument)) {
      await this.syncDocumentContentById(documentId);
    }
  }

  private async syncUsers(): Promise<void> {
    const users = await this.connector.getUsers();

    await this.cache.cacheUsers(users);
  }

  public sync = {
    users: this.syncUsers,
    databases: this.syncDatabases,
    databaseDocuments: this.syncDatabaseDocumentsById,
    documentContent: this.syncDocumentContentById,
    document: this.syncDocumentById,
  };

  public query = {
    document: () => {},
    documentsInDatabase: () => {},
  } as any;
}

export const buildNotionDatastore = (config: NotionDatastoreConfig) =>
  new NotionDatastoreV1(config);
