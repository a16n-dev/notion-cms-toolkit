import { camelCase } from 'change-case';

import { ClientInterface } from './clientInterface.ts';
import { NotionDocument } from './clientTypes.ts';

import {
  CachedNotionDocumentWithCorrectedTypes,
  DocumentCacheInterface,
} from '../core/datastore/documentCacheInterface.ts';
import { NotionBlock } from '../core/types/notionBlockTypes.ts';

const stripBlockIDs = (blocks: NotionBlock[]) => {
  return blocks.map(({ id: _, children, ...rest }) => {
    return {
      ...rest,
      children: children ? stripBlockIDs(children) : undefined,
    };
  });
};

export class ClientV1 implements ClientInterface {
  constructor(private documentCache: DocumentCacheInterface) {}

  async getDocumentBySlug(
    databaseSlug: string,
    documentSlug: string,
  ): Promise<NotionDocument | null> {
    // find the database with the given name

    // get the document
    const document = await this.documentCache.queryDocumentInDatabaseBySlug(
      databaseSlug,
      documentSlug,
    );

    if (!document) {
      return null;
    }

    return this.mapDocument(document);
  }

  private mapDocument(
    document: CachedNotionDocumentWithCorrectedTypes,
  ): NotionDocument {
    const properties = document.properties.reduce((acc, property) => {
      acc[camelCase(property.name)] = property.value;
      return acc;
    }, {});

    return {
      id: document.id,
      slug: document.slug,
      name: document.name,
      cover: document.cover ?? undefined,
      icon: document.icon ?? undefined,
      properties,
      blocks: stripBlockIDs(document.blocks),
    };
  }

  async getDocuments(databaseSlug: string): Promise<NotionDocument[]> {
    const documents =
      await this.documentCache.queryDocumentsByDatabaseSlug(databaseSlug);

    return documents.map(this.mapDocument);
  }
}
