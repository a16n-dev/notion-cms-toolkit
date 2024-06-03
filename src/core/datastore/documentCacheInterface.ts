import {
  CachedNotionDatabase,
  CachedNotionDocument,
  CachedNotionFile,
  CachedNotionUser,
} from '@prisma/client';

import { NotionTopLevelBlock } from '../types/notionBlockTypes.ts';
import { NotionFile, NotionIcon } from '../types/notionHelperTypes.ts';
import {
  NotionDatabase,
  NotionDocument,
  NotionDocumentContent,
  NotionUser,
} from '../types/notionObjectTypes';
import { NotionDocumentProperty } from '../types/notionPropertyTypes.ts';

export type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;

export type CachedNotionDocumentWithCorrectedTypes = Overwrite<
  CachedNotionDocument,
  {
    cover: NotionFile | null;
    icon: NotionIcon | null;
    properties: NotionDocumentProperty[];
    blocks: NotionTopLevelBlock[];
    database: CachedNotionDatabase;
  }
>;

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
  cacheDocument(
    document: NotionDocument,
  ): Promise<CachedNotionDocumentWithCorrectedTypes>;

  /**
   * @see `cacheDocument`
   */
  cacheDocuments(
    documents: NotionDocument[],
  ): Promise<CachedNotionDocumentWithCorrectedTypes[]>;

  /**
   * Stores information about a user in the cache
   */
  cacheUser(user: NotionUser): Promise<CachedNotionUser>;

  /**
   * @see `cacheUser`
   */
  cacheUsers(users: NotionUser[]): Promise<CachedNotionUser[]>;

  /**
   * Caches the blocks of a document in the cache
   */
  cacheDocumentBlocks(
    notionDocumentId: string,
    blocks: NotionDocumentContent,
  ): Promise<CachedNotionDocumentWithCorrectedTypes>;

  /**
   * Checks if the blocks of a document are stale and need to be updated
   */
  areCachedDocumentBlocksStale(
    document: CachedNotionDocumentWithCorrectedTypes,
  ): boolean;

  /**
   * Records information about a file that has been cached in the seperate file cache
   */
  recordCachedFile(): Promise<CachedNotionFile>;

  /**
   * Used to check if a file is in the file cache, based on the unique URL-based key provided
   */
  isFileCached(urlKey: string): Promise<CachedNotionFile | null>;

  // Database query methods
  queryDatabases(): Promise<CachedNotionDatabase[]>;
  queryDatabaseByNotionId(
    notionId: string,
  ): Promise<CachedNotionDatabase | null>;
  queryDatabaseById(id: string): Promise<CachedNotionDatabase | null>;

  // Document query methods
  queryDocumentsByDatabaseSlug(
    databaseSlug: string,
  ): Promise<CachedNotionDocumentWithCorrectedTypes[]>;
  queryDocumentByNotionId(
    notionId: string,
  ): Promise<CachedNotionDocumentWithCorrectedTypes | null>;
  queryDocumentInDatabaseBySlug(
    databaseSlug: string,
    documentSlug: string,
  ): Promise<CachedNotionDocumentWithCorrectedTypes | null>;
}

export type BuildDocumentCache = () => DocumentCacheInterface;
