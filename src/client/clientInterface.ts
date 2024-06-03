import { DocumentResponse } from './clientTypes.ts';

export interface ClientInterface {
  getDocumentById(
    database: string,
    documentId: string,
  ): Promise<DocumentResponse | null>;

  getDocumenBySlug(
    database: string,
    slug: string,
  ): Promise<DocumentResponse | null>;

  getDocuments(database: string): Promise<DocumentResponse[]>;
}
