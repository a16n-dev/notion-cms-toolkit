import {
  CachedNotionFile,
  NotionDatabase,
  NotionDocument,
  NotionUser,
} from './types.ts';

import { CachedFileData } from '../fileStore/types.ts';
import {
  RawNotionDatabase,
  RawNotionDocument,
  RawNotionDocumentContent,
  RawNotionUser,
} from '../sharedTypes/rawObjectTypes';

/**
 * This is used for querying documents, as either a notion ID, or a slug can be used
 */
export type IdOrSlug = { id: string } | { slug: string };

export const IdOrSlugToQuery = (idOrSlug: IdOrSlug) => ({
  notionId: (idOrSlug as any).id,
  slug: (idOrSlug as any).slug,
});

export const isId = (idOrSlug: IdOrSlug): idOrSlug is { id: string } =>
  (idOrSlug as any).id !== undefined;

export const isSlug = (idOrSlug: IdOrSlug): idOrSlug is { slug: string } =>
  (idOrSlug as any).slug !== undefined;

/**
 * Responsible for storing notion data in the cache.
 */
export interface IDataCache {
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
  queryDatabase(databaseIds: IdOrSlug): Promise<NotionDatabase | null>;

  // Document query methods
  queryDocumentsByDatabase(databaseId: IdOrSlug): Promise<NotionDocument[]>;
  queryDocumentInDatabase(
    database: IdOrSlug,
    document: IdOrSlug,
  ): Promise<NotionDocument | null>;
}
