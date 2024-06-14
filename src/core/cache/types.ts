import { NotionTopLevelBlock } from '../sharedTypes/notionBlockTypes.ts';
import { NotionFile, NotionIcon } from '../sharedTypes/notionHelperTypes.ts';
import {
  NotionDocumentProperty,
  NotionPropertySchemaDefinition,
} from '../sharedTypes/propertyTypes.ts';

// Note: It's up to the specific implementation to decide if "id" refers to an internal database ID, or a Notion ID
// These types represent the final format that is exposed to the application layer

export interface NotionDatabase {
  id: string;
  slug: string;
  name: string;

  notionUrl: string;

  icon?: NotionIcon;
  cover?: NotionFile;
  propertySchema: NotionPropertySchemaDefinition[];

  lastSyncedAt: Date;
}
export interface NotionDocument {
  id: string;
  slug: string;
  name: string;

  properties: NotionDocumentProperty[];
  propertiesLastSyncedAt?: Date;

  blocks: NotionTopLevelBlock[];
  text: string;
  blocksLastSyncedAt?: Date;

  notionCreatedAt: Date;
  notionUpdatedAt: Date;
  notionUrl: string;

  cover?: NotionFile;
  icon?: NotionIcon;

  databaseId: string;
  database: NotionDatabase;
}

export interface CachedNotionFile {
  urlKey: string;
  name?: string;
  fileSizeInKb: number;
  url: string;
  fileType: string;
  lastSyncedAt: Date;
}

export interface NotionUser {
  id: string;
  name?: string;
  isBot: boolean;
  lastSyncedAt: Date;
}
