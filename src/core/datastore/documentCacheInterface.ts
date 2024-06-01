import {
  CachedNotionDatabase,
  CachedNotionDocument,
  CachedNotionFile,
  CachedNotionUser,
} from '@prisma/client';

import {
  NotionDatabase,
  NotionDocument,
  NotionDocumentContent,
} from '../types/notionObjectTypes';

/**
 * Responsible for storing notion data in the cache.
 */
export interface DocumentCacheInterface {
  /**
   * Stores information about a notion database in the cache
   */
  cacheDatabase(database: NotionDatabase): Promise<CachedNotionDatabase>;
  /**
   * @see `cacheDatabase`
   */
  cacheDatabases(databases: NotionDatabase[]): Promise<CachedNotionDatabase[]>;

  /**
   * Stores information about a notion document in the cache
   */
  cacheDocument(document: NotionDocument): Promise<CachedNotionDocument>;

  /**
   * @see `cacheDocument`
   */
  cacheDocuments(documents: NotionDocument[]): Promise<CachedNotionDocument[]>;

  /**
   * Caches the blocks of a document in the cache
   */
  cacheDocumentBlocks(
    notionDocumentId: string,
    blocks: NotionDocumentContent,
  ): Promise<CachedNotionDocument>;

  /**
   * Checks if the blocks of a document are stale and need to be updated
   */
  areCachedDocumentBlocksStale(document: CachedNotionDocument): boolean;

  /**
   * Records information about a file that has been cached in the seperate file cache
   */
  recordCachedFile(): Promise<CachedNotionFile>;

  /**
   * Used to check if a file is in the file cache, based on the unique URL-based key provided
   */
  isFileCached(urlKey: string): Promise<CachedNotionFile | undefined>;

  // Database query methods
  queryDatabases(): Promise<CachedNotionDatabase[]>;
  queryDatabaseByNotionId(
    notionId: string,
  ): Promise<CachedNotionDatabase | null>;
  queryDatabaseById(id: string): Promise<CachedNotionDatabase | null>;

  // Document query methods
  queryDocumentsByDatabaseId(
    databaseId: string,
  ): Promise<CachedNotionDocument[]>;
  queryDocumentByNotionId(
    notionId: string,
  ): Promise<CachedNotionDocument | null>;
  queryDocumentInDatabaseById(
    databaseId: string,
    documentId: string,
  ): Promise<CachedNotionDocument | null>;
  queryDocumentInDatabaseBySlug(
    databaseId: string,
    slug: string,
  ): Promise<CachedNotionDocument | null>;

  // User query methods
  queryUserById(userId: string): Promise<CachedNotionUser | null>;
  queryUserByNotionId(notionId: string): Promise<CachedNotionUser | null>;
}
