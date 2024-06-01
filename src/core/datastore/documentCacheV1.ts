import {
  CachedNotionDatabase,
  CachedNotionDocument,
  CachedNotionFile,
  CachedNotionUser,
  PrismaClient,
} from '@prisma/client';

import { DocumentCacheInterface } from './documentCacheInterface';

import {
  NotionDatabase,
  NotionDocument,
  NotionDocumentContent,
} from '../types/notionObjectTypes';

export class DocumentCacheV1 implements DocumentCacheInterface {
  constructor(private prisma: PrismaClient) {}

  async cacheDatabase(database: NotionDatabase) {
    return this.prisma.cachedNotionDatabase.upsert({
      where: {
        notionId: database.notionId,
      },
      create: {
        notionId: database.notionId,
        name: database.name,
        url: database.url,
        cover: database.cover,
        icon: database.icon,
        propertySchema: database.propertySchema,
        lastSyncedAt: new Date(),
      },
      update: {
        notionId: database.notionId,
        name: database.name,
        url: database.url,
        cover: database.cover ?? undefined,
        icon: database.icon ?? undefined,
        propertySchema: database.propertySchema,
        lastSyncedAt: new Date(),
      },
    });
  }

  async cacheDatabases(
    databases: NotionDatabase[],
  ): Promise<CachedNotionDatabase[]> {
    const cachedDatabases: CachedNotionDatabase[] = [];

    for (const database of databases) {
      const cachedDatabase = await this.cacheDatabase(database);
      cachedDatabases.push(cachedDatabase);
    }

    return cachedDatabases;
  }

  cacheDocument(document: NotionDocument): Promise<CachedNotionDocument> {
    return this.prisma.cachedNotionDocument.upsert({
      where: {
        notionId: document.notionId,
      },
      create: {
        notionId: document.notionId,
        notionDatabaseId: document.notionDatabaseId,
        slug: document.slug,
        name: document.name,
        url: document.url,
        cover: document.cover,
        icon: document.icon,
        properties: document.properties as any,
        notionCreatedAt: document.createdTime,
        notionUpdatedAt: document.lastEditedTime,
        propertiesLastSyncedAt: new Date(),
        database: {
          connect: {
            notionId: document.notionDatabaseId,
          },
        },
      },
      update: {
        slug: document.slug,
        name: document.name,
        url: document.url,
        cover: document.cover ?? null,
        icon: document.icon ?? null,
        notionCreatedAt: document.createdTime,
        notionUpdatedAt: document.lastEditedTime,
        properties: document.properties as any,
        propertiesLastSyncedAt: new Date(),
      },
    });
  }

  async cacheDocumentBlocks(
    notionDocumentId: string,
    blocks: NotionDocumentContent,
  ): Promise<CachedNotionDocument> {
    return this.prisma.cachedNotionDocument.update({
      where: {
        notionId: notionDocumentId,
      },
      data: {
        blocks: blocks as any,
        blocksLastSyncedAt: new Date(),
      },
    });
  }

  async cacheDocuments(
    documents: NotionDocument[],
  ): Promise<CachedNotionDocument[]> {
    const cachedDocuments: CachedNotionDocument[] = [];

    for (const document of documents) {
      const cachedDocument = await this.cacheDocument(document);
      cachedDocuments.push(cachedDocument);
    }

    return cachedDocuments;
  }

  areCachedDocumentBlocksStale(document: CachedNotionDocument): boolean {
    return (
      !document.blocksLastSyncedAt ||
      document.notionUpdatedAt.getTime() > document.blocksLastSyncedAt.getTime()
    );
  }

  isFileCached(urlKey: string): Promise<CachedNotionFile | undefined> {
    throw new Error('');
  }

  queryDatabaseById(id: string): Promise<CachedNotionDatabase | null> {
    throw new Error('');
  }

  queryDatabaseByNotionId(
    notionId: string,
  ): Promise<CachedNotionDatabase | null> {
    throw new Error('');
  }

  queryDatabases(): Promise<CachedNotionDatabase[]> {
    throw new Error('');
  }

  queryDocumentByNotionId(
    notionId: string,
  ): Promise<CachedNotionDocument | null> {
    throw new Error('');
  }

  queryDocumentInDatabaseById(
    databaseId: string,
    documentId: string,
  ): Promise<CachedNotionDocument | null> {
    throw new Error('');
  }

  queryDocumentInDatabaseBySlug(
    databaseId: string,
    slug: string,
  ): Promise<CachedNotionDocument | null> {
    throw new Error('');
  }

  queryDocumentsByDatabaseId(
    databaseId: string,
  ): Promise<CachedNotionDocument[]> {
    throw new Error('');
  }

  queryUserById(userId: string): Promise<CachedNotionUser | null> {
    throw new Error('');
  }

  queryUserByNotionId(notionId: string): Promise<CachedNotionUser | null> {
    throw new Error('');
  }

  recordCachedFile(): Promise<CachedNotionFile> {
    throw new Error('');
  }
}
