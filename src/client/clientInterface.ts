import { NotionDocument } from './clientTypes.ts';

export interface ClientInterface {
  getDocumentBySlug(
    database: string,
    slug: string,
  ): Promise<NotionDocument | null>;

  getDocuments(database: string): Promise<NotionDocument[]>;
}
