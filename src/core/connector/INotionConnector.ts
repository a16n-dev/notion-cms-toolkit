import {
  RawNotionDatabase,
  RawNotionDocument,
  RawNotionDocumentContent,
  RawNotionUser,
} from '../sharedTypes/rawObjectTypes.ts';

/**
 * This class does all the interaction with the Notion API.
 * All responses returned represent the Simplified notion data representation.
 * This data is returned in a format designed to be stored in an intermediate database
 */

export interface INotionConnector {
  /**
   * Returns a list of all databases that the integration has access to.
   * For each database, the response includes the metadata about the database, as well as it's property schema.
   */
  getConnectedDatabases(): Promise<RawNotionDatabase[]>;

  /**
   * Returns a list of all blocks in the specified document
   */
  getDocumentContent(
    notionDocumentId: string,
  ): Promise<RawNotionDocumentContent>;

  /**
   * Returns a list of all documents in the specified database
   */
  getDocumentsInDatabase(
    notionDatabaseId: string,
  ): Promise<RawNotionDocument[]>;

  /**
   * Returns the document with the specified id.
   *
   * **NOTE: this method is not recommended, as the Notion API rate limiting is quite strict. If you need multiple documents,
   * it's more efficient to use `getDocumentsInDatabase` to get all the documents at once**
   */
  getDocument(notionDocumentId: string): Promise<RawNotionDocument>;

  /**
   * Returns the database with the specified id.
   *
   * **NOTE: this method is not recommended, as the Notion API rate limiting is quite strict. If you need multiple databases,
   * it's more efficient to use `getConnectedDatabases` to get all the databases at once**
   */
  getDatabase(notionDatabaseId: string): Promise<RawNotionDatabase>;

  /**
   * Returns all the users in the workspace.
   *
   * **NOTE: This requires extra permission scope for the integration**
   */
  getUsers(): Promise<RawNotionUser[]>;

  /**
   * Sets the file cache handler for the connector.
   */
  setFileCacheHandler(handler: NotionConnectorFileCacheHandler): void;
}

/**
 * A function that takes a file URL and caches the file if needed. If the file is cached, the URL to the cached file should be returned. Otherwise, the original url should be returned.
 */
export type NotionConnectorFileCacheHandler = (url: string) => Promise<string>;
