import { NotionTopLevelBlock } from './notionBlockTypes';
import { NotionFile, NotionIcon } from './notionHelperTypes';
import {
  NotionDocumentProperty,
  NotionPropertySchemaDefinition,
} from './propertyTypes';

// These are the "raw" types returned by the connector, to be processed by the datastore

export type RawNotionDocument = {
  notionId: string;
  notionDatabaseId: string;
  slug: string;
  name: string;
  url: string;
  cover?: NotionFile;
  icon?: NotionIcon;
  properties: NotionDocumentProperty[];

  createdTime: string;
  lastEditedTime: string;
};

export type RawNotionDatabase = {
  notionId: string;
  slug: string;
  name: string;
  url: string;
  cover?: NotionFile;
  icon?: NotionIcon;
  propertySchema: NotionPropertySchemaDefinition[];

  createdTime: string;
  lastEditedTime: string;
};

export type RawNotionDocumentContent = {
  blocks: Array<NotionTopLevelBlock>;
  plainText: string;
};

export type RawNotionUser = {
  notionId: string;
  name?: string;
  avatar?: NotionFile;
  isBot: boolean;
};
