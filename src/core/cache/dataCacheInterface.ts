import {
  CachedNotionFile,
  NotionDatabase,
  NotionDocument,
  NotionUser,
} from './types.ts';

import { CachedFileData } from '../sharedTypes/file.ts';
import {
  RawNotionDatabase,
  RawNotionDocument,
  RawNotionDocumentContent,
  RawNotionUser,
} from '../sharedTypes/rawObjectTypes';

/**
 * Responsible for storing notion data in the cache.
 */
export interface DataCacheInterface {
  /**
   * Stores information about a notion database in the cache
   */
  cacheDatabase(database: RawNotionDatabase): Promise<NotionDatabase>;
  /**
   * @see `cacheDatabase`
   */
  cacheDatabases(databases: RawNotionDatabase[]): Promise<NotionDatabase[]>;

  /**
   * Stores information about a notion document in the cache
   */
  cacheDocument(document: RawNotionDocument): Promise<NotionDocument>;

  /**
   * @see `cacheDocument`
   */
  cacheDocuments(documents: RawNotionDocument[]): Promise<NotionDocument[]>;

  /**
   * Stores information about a user in the cache
   */
  cacheUser(user: RawNotionUser): Promise<NotionUser>;

  /**
   * @see `cacheUser`
   */
  cacheUsers(users: RawNotionUser[]): Promise<NotionUser[]>;

  /**
   * Caches the blocks of a document in the cache
   */
  cacheDocumentContent(
    notionDocumentId: string,
    content: RawNotionDocumentContent,
  ): Promise<NotionDocument>;

  /**
   * Checks if the blocks of a document are stale and need to be updated
   */
  areCachedDocumentBlocksStale(document: NotionDocument): boolean;

  /**
   * Records information about a file that has been cached in the seperate file cache
   */
  recordCachedFile(data: CachedFileData): Promise<CachedNotionFile>;

  /**
   * Used to check if a file is in the file cache, based on the unique URL-based key provided
   */
  isFileCached(urlKey: string): Promise<CachedNotionFile | null>;

  // Database query methods
  queryDatabases(): Promise<NotionDatabase[]>;
  queryDatabaseByNotionId(notionId: string): Promise<NotionDatabase | null>;

  // Document query methods
  queryDocumentsByDatabaseSlug(databaseSlug: string): Promise<NotionDocument[]>;
  queryDocumentByNotionId(notionId: string): Promise<NotionDocument | null>;
  queryDocumentInDatabaseBySlug(
    databaseSlug: string,
    documentSlug: string,
  ): Promise<NotionDocument | null>;
}
