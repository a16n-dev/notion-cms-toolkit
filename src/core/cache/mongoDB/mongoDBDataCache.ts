import {
  CachedNotionDatabase,
  CachedNotionDocument,
  PrismaClient,
} from '@prisma/client';

import { mapDatabase, mapDocument, mapFile, mapUser } from './mappers.ts';

import { CachedFileData } from '../../fileStore/types.ts';
import { NotionPropertyType } from '../../sharedTypes/propertyTypes.ts';
import {
  RawNotionDatabase,
  RawNotionDocument,
  RawNotionDocumentContent,
  RawNotionUser,
} from '../../sharedTypes/rawObjectTypes.ts';
import { IDataCache, IdOrSlug, IdOrSlugToQuery, isId } from '../IDataCache.ts';
import {
  CachedNotionFile,
  NotionDatabase,
  NotionDocument,
  NotionUser,
} from '../types.ts';

export class MongoDBDataCache implements IDataCache {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async cacheDatabase(database: RawNotionDatabase): Promise<NotionDatabase> {
    const cachedDatabase = await this.prisma.cachedNotionDatabase.upsert({
      where: {
        notionId: database.notionId,
      },
      create: {
        notionId: database.notionId,
        slug: database.slug,
        name: database.name,
        url: database.url,
        cover: database.cover,
        icon: database.icon,
        propertySchema: database.propertySchema,
        lastSyncedAt: new Date(),
      },
      update: {
        notionId: database.notionId,
        slug: database.slug,
        name: database.name,
        url: database.url,
        cover: database.cover ?? undefined,
        icon: database.icon ?? undefined,
        propertySchema: database.propertySchema,
        lastSyncedAt: new Date(),
      },
    });

    return mapDatabase(cachedDatabase);
  }

  async cacheDatabases(
    databases: RawNotionDatabase[],
  ): Promise<NotionDatabase[]> {
    const cachedDatabases: NotionDatabase[] = [];

    for (const database of databases) {
      const cachedDatabase = await this.cacheDatabase(database);
      cachedDatabases.push(cachedDatabase);
    }

    return cachedDatabases;
  }

  async cacheDocument(document: RawNotionDocument): Promise<NotionDocument> {
    const people = await this.prisma.cachedNotionUser.findMany();

    // add extra data to any "people" type property
    const properties = document.properties.map((property) => {
      if (property.type === NotionPropertyType.People) {
        return {
          ...property,
          value: property.value.map((v) => {
            const person = people.find((p) => p.notionId === v);
            if (person) {
              return {
                notionId: person.notionId,
                name: person.name,
                avatar: person.avatar,
                isBot: person.isBot,
              };
            } else {
              return v;
            }
          }),
        };
      } else {
        return property;
      }
    });

    const cachedDocument = await this.prisma.cachedNotionDocument.upsert({
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
        text: '',
        properties: properties as any,
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
        properties: properties as any,
        propertiesLastSyncedAt: new Date(),
      },
      include: {
        database: true,
      },
    });

    return mapDocument(cachedDocument);
  }

  async cacheDocumentContent(
    notionDocumentId: string,
    content: RawNotionDocumentContent,
  ): Promise<NotionDocument> {
    const cachedDocument = await this.prisma.cachedNotionDocument.update({
      where: {
        notionId: notionDocumentId,
      },
      data: {
        text: content.plainText,
        blocks: content.blocks as any,
        blocksLastSyncedAt: new Date(),
      },
      include: {
        database: true,
      },
    });

    return mapDocument(cachedDocument);
  }

  async cacheDocuments(
    documents: RawNotionDocument[],
  ): Promise<NotionDocument[]> {
    const cachedDocuments: NotionDocument[] = [];

    for (const document of documents) {
      const cachedDocument = await this.cacheDocument(document);
      cachedDocuments.push(cachedDocument);
    }

    return cachedDocuments;
  }

  async cacheUser(user: RawNotionUser): Promise<NotionUser> {
    const cachedUser = await this.prisma.cachedNotionUser.upsert({
      where: {
        notionId: user.notionId,
      },
      create: {
        notionId: user.notionId,
        name: user.name,
        avatar: user.avatar,
        lastSyncedAt: new Date(),
        isBot: user.isBot,
      },
      update: {
        name: user.name,
        avatar: user.avatar,
        lastSyncedAt: new Date(),
        isBot: user.isBot,
      },
    });

    return mapUser(cachedUser);
  }

  async cacheUsers(users: RawNotionUser[]): Promise<NotionUser[]> {
    const cachedUsers: NotionUser[] = [];

    for (const user of users) {
      const cachedUser = await this.cacheUser(user);
      cachedUsers.push(cachedUser);
    }

    return cachedUsers;
  }

  areCachedDocumentBlocksStale(document: NotionDocument): boolean {
    return (
      !document.blocksLastSyncedAt ||
      document.notionUpdatedAt.getTime() > document.blocksLastSyncedAt.getTime()
    );
  }

  async isFileCached(urlKey: string): Promise<CachedNotionFile | null> {
    const cachedFile = await this.prisma.cachedNotionFile.findUnique({
      where: {
        urlKey,
      },
    });

    if (!cachedFile) {
      return null;
    }

    return mapFile(cachedFile);
  }

  async queryDatabase(id: IdOrSlug): Promise<NotionDatabase | null> {
    const cachedDatabase = await this.prisma.cachedNotionDatabase.findUnique({
      where: IdOrSlugToQuery(id),
    });

    if (!cachedDatabase) {
      return null;
    }

    return mapDatabase(cachedDatabase);
  }

  async queryDatabases(): Promise<NotionDatabase[]> {
    const cachedDatabases = await this.prisma.cachedNotionDatabase.findMany();

    return cachedDatabases.map(mapDatabase);
  }

  async queryDocumentInDatabase(
    databaseId: IdOrSlug,
    documentId: IdOrSlug,
  ): Promise<NotionDocument | null> {
    let document:
      | (CachedNotionDocument & { database: CachedNotionDatabase })
      | null;

    if (isId(documentId)) {
      document = await this.prisma.cachedNotionDocument.findUnique({
        where: {
          notionId: documentId.id,
        },
        include: {
          database: true,
        },
      });
    } else {
      const database = await this.prisma.cachedNotionDatabase.findUniqueOrThrow(
        {
          where: IdOrSlugToQuery(databaseId),
        },
      );

      document = await this.prisma.cachedNotionDocument.findUnique({
        where: {
          slug_databaseId: {
            databaseId: database.id,
            slug: documentId.slug,
          },
        },
        include: {
          database: true,
        },
      });
    }

    if (!document) {
      return null;
    }

    return mapDocument(document);
  }

  async queryDocumentsByDatabase(
    databaseId: IdOrSlug,
  ): Promise<NotionDocument[]> {
    const database = await this.prisma.cachedNotionDatabase.findUnique({
      where: IdOrSlugToQuery(databaseId),
      include: {
        documents: {
          include: {
            database: true,
          },
        },
      },
    });

    if (!database) {
      throw new Error(`Invalid database "${JSON.stringify(databaseId)}"`);
    }

    return database.documents.map(mapDocument);
  }

  async recordCachedFile(data: CachedFileData): Promise<CachedNotionFile> {
    const cachedFile = await this.prisma.cachedNotionFile.create({
      data: {
        urlKey: data.urlKey,
        url: data.url,
        fileType: data.fileType,
        name: data.name,
        fileSizeInKb: data.fileSizeInKb,
      },
    });

    return mapFile(cachedFile);
  }
}

export const buildMongoDBDataCache = () => new MongoDBDataCache();
