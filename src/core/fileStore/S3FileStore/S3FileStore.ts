import { CachedFileData } from '../../sharedTypes/file.ts';
import { NotionFile } from '../../sharedTypes/notionHelperTypes.ts';
import { FileStoreInterface } from '../fileStoreInterface.ts';

class S3FileStore implements FileStoreInterface {
  cacheFile(file: NotionFile): CachedFileData {
    throw new Error('not implemented');
  }
}

export const buildS3FileStore = (): FileStoreInterface => new S3FileStore();
