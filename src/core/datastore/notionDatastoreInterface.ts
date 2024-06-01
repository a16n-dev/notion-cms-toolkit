import { DocumentCacheInterface } from './documentCacheInterface';

import { NotionConnectorInterface } from '../connector/notionConnectorInterface';

/**
 * The `NotionDatastore` is responsible for calling the `NotionConnector`, and persisting it in the database of choice.
 * This is the central system component
 */
export interface NotionDatastoreInterface {
  /**
   * The sync<method> methods are responsible for syncing the data from Notion to the local cache
   *
   * the query<method> methods are responsible for querying the local cache.
   */

  /**
   * Syncs the notion users with the local cache
   */
  syncUsers(): Promise<void>;

  /**
   * Syncs the list of databases that are available to the integration
   */
  syncDatabases(): Promise<void>;

  /**
   * Syncs the list of pages in the database
   */
  syncDatabaseDocuments(databaseId: string): Promise<void>;

  /**
   * Syncs the latest blocks for a given document
   */
  syncDocumentBlocks(documentId: string): Promise<void>;
}

export interface NotionDatastoreConfig {
  auth: string;
  connector: NotionConnectorInterface;
  cache: DocumentCacheInterface;
}

export type buildNotionDatastore = (
  config: NotionDatastoreConfig,
) => NotionDatastoreInterface;
