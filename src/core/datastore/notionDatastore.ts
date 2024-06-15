import { NotionDatastoreConfig, INotionDatastore } from './INotionDatastore.ts';

import { IDataCache, IdOrSlug } from '../cache/IDataCache.ts';
import { NotionDatabase, NotionDocument, NotionUser } from '../cache/types.ts';
import { INotionConnector } from '../connector/INotionConnector.ts';
import { IFileStore } from '../fileStore/IFileStore.ts';

export class NotionDatastore implements INotionDatastore {
  private connector: INotionConnector;
  private cache: IDataCache;
  private fileStore: IFileStore;

  constructor(config: NotionDatastoreConfig) {
    this.connector = config.connector;
    this.cache = config.cache;
    this.fileStore = config.fileStore;
  }

  private async cacheFile(url: string): Promise<string> {
    // generate the urlKey, to determine if the file is already cached
    const urlKey = url;

    // check if this key is already cached
    const cachedFile = await this.cache.isFileCached(urlKey);

    if (cachedFile) {
      return cachedFile.url;
    }

    const cachedFileData = await this.fileStore.cacheFile(urlKey, url);

    // store info about the cached file
    await this.cache.recordCachedFile(cachedFileData);

    return cachedFileData.url;
  }

  private async syncDatabaseDocumentsById(
    databaseId: string,
  ): Promise<NotionDocument[]> {
    const documents = await this.connector.getDocumentsInDatabase(databaseId);

    return this.cache.cacheDocuments(documents);
  }

  private async syncDatabases(): Promise<NotionDatabase[]> {
    const databases = await this.connector.getConnectedDatabases();

    // store them in the local cache
    return this.cache.cacheDatabases(databases);
  }

  private async syncDocumentContentById(
    documentId: string,
  ): Promise<NotionDocument> {
    const blocks = await this.connector.getDocumentContent(documentId);

    return this.cache.cacheDocumentContent(documentId, blocks);
  }

  private async syncDocumentById(documentId: string): Promise<NotionDocument> {
    // First sync the document properties, and check the "last edited" timestamp to determine if we need to sync the blocks
    const document = await this.connector.getDocument(documentId);

    let cachedDocument = await this.cache.cacheDocument(document);

    if (this.cache.areCachedDocumentBlocksStale(cachedDocument)) {
      cachedDocument = await this.syncDocumentContentById(documentId);
    }

    return cachedDocument;
  }

  private async syncUsers(): Promise<NotionUser[]> {
    const users = await this.connector.getUsers();

    return this.cache.cacheUsers(users);
  }

  public sync = {
    users: this.syncUsers,
    databases: this.syncDatabases,
    databaseDocuments: this.syncDatabaseDocumentsById,
    documentContent: this.syncDocumentContentById,
    document: this.syncDocumentById,
  };

  async queryDocument(database: IdOrSlug, document: IdOrSlug) {
    return this.cache.queryDocumentInDatabase(database, document);
  }

  async queryDocumentsInDatabase(database: IdOrSlug) {
    return this.cache.queryDocumentsByDatabase(database);
  }

  public query = {
    document: this.queryDocument,
    documentsInDatabase: this.queryDocumentsInDatabase,
  } as any;
}

export const buildNotionDatastore = (config: NotionDatastoreConfig) =>
  new NotionDatastore(config);
