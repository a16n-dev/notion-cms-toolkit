import { DocumentCacheInterface } from './documentCacheInterface';

import { NotionConnectorInterface } from '../connector/notionConnectorInterface';

/**
 * The `NotionDatastore` is responsible for calling the `NotionConnector`, and persisting it in the database of choice.
 * This is the central system component
 */
export interface NotionDatastoreInterface {
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
  syncDatabaseDocuments(notionDatabaseId: string): Promise<void>;

  /**
   * Syncs the latest blocks for a given document
   */
  syncDocumentBlocks(notionDocumentId: string): Promise<void>;
}

export interface NotionDatastoreConfig {
  connector: NotionConnectorInterface;
  cache: DocumentCacheInterface;
}

export type BuildNotionDatastore = (
  config: NotionDatastoreConfig,
) => NotionDatastoreInterface;
