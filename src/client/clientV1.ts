import { camelCase } from 'change-case';

import { ClientInterface } from './clientInterface.ts';
import { NotionDocumentResponse } from './clientTypes.ts';

import { NotionDocument } from '../core/cache/types.ts';
import { INotionDatastore } from '../core/datastore/INotionDatastore.ts';
import { NotionBlock } from '../core/sharedTypes/notionBlockTypes.ts';

const stripBlockIDs = (blocks: NotionBlock[]) => {
  return blocks.map(({ id: _, children, ...rest }) => {
    return {
      ...rest,
      children: children ? stripBlockIDs(children) : undefined,
    };
  });
};

export class ClientV1 implements ClientInterface {
  constructor(private documentCache: INotionDatastore) {}

  async getDocumentBySlug(
    databaseSlug: string,
    documentSlug: string,
  ): Promise<NotionDocumentResponse | null> {
    // find the database with the given name

    // get the document
    const document = await this.documentCache.query.document(
      { slug: databaseSlug },
      { slug: documentSlug },
    );

    if (!document) {
      return null;
    }

    return this.mapDocument(document);
  }

  private mapDocument(document: NotionDocument): NotionDocumentResponse {
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

  async getDocuments(databaseSlug: string): Promise<NotionDocumentResponse[]> {
    const documents = await this.documentCache.query.documentsInDatabase({
      slug: databaseSlug,
    });

    return documents.map(this.mapDocument);
  }
}
