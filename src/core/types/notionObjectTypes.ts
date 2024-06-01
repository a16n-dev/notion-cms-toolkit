import { NotionTopLevelBlock } from './notionBlockTypes';
import { NotionFile, NotionIcon } from './notionHelperTypes';
import {
  NotionDocumentProperty,
  NotionPropertySchemaDefinition,
} from './notionPropertyTypes';

export type NotionDocument = {
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

export type NotionDatabase = {
  notionId: string;
  name: string;
  url: string;
  cover?: NotionFile;
  icon?: NotionIcon;
  propertySchema: NotionPropertySchemaDefinition[];

  createdTime: string;
  lastEditedTime: string;
};

export type NotionDocumentContent = Array<NotionTopLevelBlock>;

export type NotionUser = {
  notionId: string;
  name?: string;
  avatar?: NotionFile;
  isBot: boolean;
};
