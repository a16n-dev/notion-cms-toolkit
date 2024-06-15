import { NotionDocumentResponse } from './clientTypes.ts';

export interface ClientInterface {
  getDocumentBySlug(
    database: string,
    slug: string,
  ): Promise<NotionDocumentResponse | null>;

  getDocuments(database: string): Promise<NotionDocumentResponse[]>;
}
