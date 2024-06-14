import { NotionDocument } from '../../client/clientTypes.ts';
import { DataCacheInterface } from '../cache/dataCacheInterface.ts';
import { NotionConnectorInterface } from '../connector/notionConnectorInterface';
import { FileStoreInterface } from '../fileStore/fileStoreInterface.ts';

/**
 * This is used for querying documents, as either a notion ID, or a slug can be used
 */
export type IdOrSlug = { id: string } | { slug: string };

/**
 * The `NotionDatastore` is responsible for calling the `NotionConnector`, and persisting it in the database of choice.
 * This is the central system component.
 * The Datastore is intended to either be exposed as an API to other parts of the system, or to be called through the client
 */
export interface NotionDatastoreInterface {
  sync: {
    /**
     * Syncs the notion users with the local cache
     */
    users(): Promise<void>;

    /**
     * Syncs the list of databases that are available to the integration
     */
    databases(): Promise<void>;

    /**
     * Syncs the list of pages in the database
     */
    databaseDocuments(notionDatabase: string): Promise<void>;

    /**
     * Syncs the latest blocks for a given document
     */
    documentContent(notionDocument: string): Promise<void>;

    /**
     * Syncs both document properties and document blocks for a given document
     */
    document(notionDocument: string): Promise<void>;
  };

  query: {
    document(
      database: IdOrSlug,
      document: IdOrSlug,
    ): Promise<NotionDocument | null>;

    documentsInDatabase(database: IdOrSlug): Promise<NotionDocument[]>;
  };
}

/**
 * These are the different components that can be configured within the datastore
 */
export interface NotionDatastoreConfig {
  connector: NotionConnectorInterface;
  cache: DataCacheInterface;
  fileStore: FileStoreInterface;
}
