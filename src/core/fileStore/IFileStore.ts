import { CachedFileData } from './types.ts';

export interface IFileStore {
  cacheFile(key: string, file: string): Promise<CachedFileData>;
}
