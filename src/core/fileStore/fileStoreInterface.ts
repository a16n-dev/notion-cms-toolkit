import { CachedFileData } from '../sharedTypes/file.ts';
import { NotionFile } from '../sharedTypes/notionHelperTypes.ts';

export interface FileStoreInterface {
  cacheFile(file: NotionFile): CachedFileData;
}
