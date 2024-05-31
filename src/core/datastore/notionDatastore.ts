import { NotionConnectorInterface } from '../connector/notionConnectorInterface';

/**
 * The `NotionDatastore` is responsible for calling the `NotionConnector`, and persisting it in the database of choice.
 * This is the central system component
 */
export interface NotionDatastoreInterface {
  async;
}

export interface NotionDatastoreConfig {
  auth: string;
  connector: NotionConnectorInterface;
}

export type buildNotionDatastore = (
  config: NotionDatastoreConfig,
) => NotionDatastoreInterface;
