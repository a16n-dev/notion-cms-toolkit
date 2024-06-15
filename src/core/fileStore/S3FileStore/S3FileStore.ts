import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import axios from 'axios';
import { fileTypeFromBuffer } from 'file-type';
import { randomUUID } from 'node:crypto';

import { NotionFile } from '../../sharedTypes/notionHelperTypes.ts';
import { IFileStore } from '../IFileStore.ts';
import { CachedFileData } from '../types.ts';

interface S3FileStoreConfig {
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
  };
  bucket: string;
  region: string;
  s3Url: string;
  keyPrefix?: string;
}

class S3FileStore implements IFileStore {
  private s3Client: S3Client;
  private bucket: string;
  private s3Url: string;
  private keyPrefix: string | undefined;

  constructor(config: S3FileStoreConfig) {
    this.s3Client = new S3Client({
      credentials: config.credentials,
      region: config.region,
    });
    this.bucket = config.bucket;
    this.keyPrefix = config.keyPrefix;
  }

  async cacheFile(urlKey: string, file: NotionFile): Promise<CachedFileData> {
    // if not, download the file and cache it
    let data: ArrayBuffer;

    try {
      const { data: imageBuffer } = await axios.get(file.url, {
        responseType: 'arraybuffer',
      });

      data = imageBuffer;
    } catch (e) {
      throw new Error('Failed to cache file');
    }
    const sizeInBytes = data.byteLength;
    // Convert bytes to kilobytes
    const sizeInKB = sizeInBytes / 1024;

    const fileType = await fileTypeFromBuffer(data);

    if (!fileType) {
      throw new Error('Unrecognised file type');
    }

    // generate a uuid name
    const uuid = randomUUID();

    const fileName = this.keyPrefix
      ? `${this.keyPrefix}/${uuid}.${fileType.ext}`
      : `${uuid}.${fileType.ext}`;

    // upload to s3
    const request = new PutObjectCommand({
      Body: Buffer.from(data),
      Bucket: this.bucket,
      Key: fileName,
    });

    try {
      await this.s3Client.send(request);
    } catch (error) {
      throw new Error('Failed to upload to S3');
    }

    const finalUrl = this.constructUrl(fileName);

    return {
      fileSizeInKb: sizeInKB,
      fileType: fileType.mime,
      name: finalUrl,
      url: finalUrl,
      urlKey: urlKey,
    };
  }

  private constructUrl(key: string) {
    if (this.s3Url) {
      return `${this.s3Url}/${key}`;
    }
    return `https://${this.bucket}.s3.amazonaws.com/${key}`;
  }
}

export const buildS3FileStore = (config: S3FileStoreConfig): IFileStore =>
  new S3FileStore(config);
