import {
  CachedNotionDatabase,
  CachedNotionDocument,
  CachedNotionFile,
  CachedNotionUser,
  PrismaClient,
} from '@prisma/client';

import {
  BuildDocumentCache,
  DocumentCacheInterface,
} from './documentCacheInterface.ts';

import { NotionBlock, NotionBlockType } from '../types/notionBlockTypes.ts';
import { NotionRichText } from '../types/notionHelperTypes.ts';
import {
  NotionDatabase,
  NotionDocument,
  NotionDocumentContent,
  NotionUser,
} from '../types/notionObjectTypes.ts';

export class DocumentCacheV1 implements DocumentCacheInterface {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async cacheDatabase(database: NotionDatabase) {
    return this.prisma.cachedNotionDatabase.upsert({
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
        text: '',
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
        text: getPlainTextContent(blocks),
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

  async cacheUser(user: NotionUser): Promise<CachedNotionUser> {
    return this.prisma.cachedNotionUser.upsert({
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
  }

  async cacheUsers(users: NotionUser[]): Promise<CachedNotionUser[]> {
    const cachedUsers: CachedNotionUser[] = [];

    for (const user of users) {
      const cachedUser = await this.cacheUser(user);
      cachedUsers.push(cachedUser);
    }

    return cachedUsers;
  }

  areCachedDocumentBlocksStale(document: CachedNotionDocument): boolean {
    return (
      !document.blocksLastSyncedAt ||
      document.notionUpdatedAt.getTime() > document.blocksLastSyncedAt.getTime()
    );
  }

  async isFileCached(urlKey: string): Promise<CachedNotionFile | null> {
    return this.prisma.cachedNotionFile.findUnique({
      where: {
        urlKey,
      },
    });
  }

  queryDatabaseById(id: string): Promise<CachedNotionDatabase | null> {
    return this.prisma.cachedNotionDatabase.findUnique({
      where: {
        id,
      },
    });
  }

  queryDatabaseByNotionId(
    notionId: string,
  ): Promise<CachedNotionDatabase | null> {
    return this.prisma.cachedNotionDatabase.findUnique({
      where: {
        notionId,
      },
    });
  }

  queryDatabases(): Promise<CachedNotionDatabase[]> {
    return this.prisma.cachedNotionDatabase.findMany();
  }

  queryDocumentByNotionId(
    notionId: string,
  ): Promise<CachedNotionDocument | null> {
    return this.prisma.cachedNotionDocument.findUnique({
      where: {
        notionId,
      },
    });
  }

  queryDocumentInDatabaseBySlug(
    databaseId: string,
    slug: string,
  ): Promise<CachedNotionDocument | null> {
    return this.prisma.cachedNotionDocument.findFirst({
      where: {
        notionDatabaseId: databaseId,
        slug,
      },
    });
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

export const buildDocumentCache: BuildDocumentCache = () =>
  new DocumentCacheV1();

const notionRichTextToPlainText = (richText: NotionRichText) =>
  richText.map((t) => t.text).join('');

const getPlainTextContent = (blocks: NotionBlock[]) => {
  const withChildren = (text: string, blocks?: NotionBlock[]) => {
    if (!blocks || blocks.length === 0) {
      return text;
    }

    return `${text}\n${getPlainTextContent(blocks)}`;
  };

  const res = blocks.map((block) => {
    switch (block.type) {
      case NotionBlockType.Divider:
        break;
      case NotionBlockType.Paragraph:
        return withChildren(
          notionRichTextToPlainText(block.content.richText),
          block.children,
        );
      case NotionBlockType.Heading1:
        return withChildren(
          notionRichTextToPlainText(block.content.richText),
          block.children,
        );
      case NotionBlockType.Heading2:
        return withChildren(
          notionRichTextToPlainText(block.content.richText),
          block.children,
        );
      case NotionBlockType.Heading3:
        return withChildren(
          notionRichTextToPlainText(block.content.richText),
          block.children,
        );
      case NotionBlockType.BulletedList:
        return getPlainTextContent(block.children);
      case NotionBlockType.NumberedList:
        return getPlainTextContent(block.children);
      case NotionBlockType.ToDoList:
        return getPlainTextContent(block.children);
      case NotionBlockType.Quote:
        return withChildren(
          notionRichTextToPlainText(block.content.richText),
          block.children,
        );
      case NotionBlockType.Toggle:
        return withChildren(
          notionRichTextToPlainText(block.content.richText),
          block.children,
        );
      case NotionBlockType.Template:
        return withChildren(
          notionRichTextToPlainText(block.content.richText),
          block.children,
        );
      case NotionBlockType.SyncedBlock:
        return getPlainTextContent(block.children);
      case NotionBlockType.ChildPage:
        break;
      case NotionBlockType.ChildDatabase:
        break;
      case NotionBlockType.Equation:
        return block.content.expression;
      case NotionBlockType.Code:
        return notionRichTextToPlainText(block.content.richText);
      case NotionBlockType.Callout:
        return withChildren(
          notionRichTextToPlainText(block.content.richText),
          block.children,
        );
      case NotionBlockType.Breadcrumb:
        break;
      case NotionBlockType.TableOfContents:
        break;
      case NotionBlockType.ColumnList:
        return getPlainTextContent(block.children);
      case NotionBlockType.LinkToPage:
        break;
      case NotionBlockType.Table:
        return getPlainTextContent(block.children);
      case NotionBlockType.Embed:
        return (
          block.content.url +
          '\n' +
          notionRichTextToPlainText(block.content.caption)
        );
      case NotionBlockType.Bookmark:
        return (
          block.content.url +
          '\n' +
          notionRichTextToPlainText(block.content.caption)
        );
      case NotionBlockType.Image:
        return notionRichTextToPlainText(block.content.caption);
      case NotionBlockType.Video:
        return notionRichTextToPlainText(block.content.caption);
      case NotionBlockType.Pdf:
        return notionRichTextToPlainText(block.content.caption);
      case NotionBlockType.File:
        return notionRichTextToPlainText(block.content.caption);
      case NotionBlockType.Audio:
        return notionRichTextToPlainText(block.content.caption);
      case NotionBlockType.LinkPreview:
        return block.content.url;
      case NotionBlockType.BulletedListItem:
        return withChildren(
          notionRichTextToPlainText(block.content.richText),
          block.children,
        );
      case NotionBlockType.ToDoListItem:
        return withChildren(
          notionRichTextToPlainText(block.content.richText),
          block.children,
        );
      case NotionBlockType.NumberedListItem:
        return withChildren(
          notionRichTextToPlainText(block.content.richText),
          block.children,
        );
      case NotionBlockType.TableRow:
        return block.content.cells
          .map((cell) => notionRichTextToPlainText(cell))
          .join(' ');
      case NotionBlockType.Column:
        return getPlainTextContent(block.children);
    }
  });

  return res.filter((r) => r).join('\n');
};
