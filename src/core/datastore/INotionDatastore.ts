import { IDataCache, IdOrSlug } from '../cache/IDataCache.ts';
import { NotionDatabase, NotionDocument, NotionUser } from '../cache/types.ts';
import { INotionConnector } from '../connector/INotionConnector.ts';
import { IFileStore } from '../fileStore/IFileStore.ts';

/**
 * The `NotionDatastore` is responsible for calling the `NotionConnector`, and persisting it in the database of choice.
 * This is the central system component.
 * The Datastore is intended to either be exposed as an API to other parts of the system, or to be called through the client
 */
export interface INotionDatastore {
  sync: {
    /**
     * Syncs the notion users with the local cache
     */
    users(): Promise<NotionUser[]>;

    /**
     * Syncs the list of databases that are available to the integration
     */
    databases(): Promise<NotionDatabase[]>;

    /**
     * Syncs the list of pages in the database
     */
    databaseDocuments(notionDatabase: string): Promise<NotionDocument[]>;

    /**
     * Syncs the latest blocks for a given document
     */
    documentContent(notionDocument: string): Promise<NotionDocument>;

    /**
     * Syncs both document properties and document blocks for a given document
     */
    document(notionDocument: string): Promise<NotionDocument>;
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
  connector: INotionConnector;
  cache: IDataCache;
  fileStore: IFileStore;
}
