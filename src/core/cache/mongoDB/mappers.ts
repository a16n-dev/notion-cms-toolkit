import {
  CachedNotionDatabase,
  CachedNotionDocument,
  CachedNotionFile,
  CachedNotionUser,
} from '@prisma/client';

import {
  NotionDatabase,
  NotionDocument,
  NotionUser,
  CachedNotionFile as CachedNotionFileType,
} from '../types.ts';

export const mapDatabase = (
  database: CachedNotionDatabase,
): NotionDatabase => ({
  cover: (database.cover as any) ?? undefined,
  icon: (database.icon as any) ?? undefined,
  id: database.notionId,
  lastSyncedAt: database.lastSyncedAt,
  name: database.name,
  notionUrl: database.url,
  propertySchema: database.propertySchema as any,
  slug: database.slug,
});

export const mapDocument = (
  document: CachedNotionDocument & { database: CachedNotionDatabase },
): NotionDocument => ({
  id: document.notionId,
  slug: document.slug,
  name: document.name,
  properties: document.properties as any,
  blocks: document.blocks as any,
  text: document.text,
  notionCreatedAt: document.notionCreatedAt,
  notionUpdatedAt: document.notionUpdatedAt,
  notionUrl: document.url,
  databaseId: document.notionDatabaseId,
  database: mapDatabase(document.database),
  blocksLastSyncedAt: document.blocksLastSyncedAt ?? undefined,
  cover: (document.cover as any) ?? undefined,
  icon: (document.icon as any) ?? undefined,
  propertiesLastSyncedAt: document.propertiesLastSyncedAt ?? undefined,
});

export const mapUser = (user: CachedNotionUser): NotionUser => ({
  id: user.notionId,
  isBot: user.isBot,
  name: user.name ?? undefined,
  lastSyncedAt: user.lastSyncedAt,
});

export const mapFile = (file: CachedNotionFile): CachedNotionFileType => ({
  urlKey: file.urlKey,
  fileSizeInKb: file.fileSizeInKb,
  url: file.url,
  fileType: file.fileType,
  lastSyncedAt: file.lastSyncedAt,
});
