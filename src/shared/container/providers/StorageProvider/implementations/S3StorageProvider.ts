import fs from 'fs';
import path from 'path';
import { S3 } from '@aws-sdk/client-s3';
import mime from 'mime';

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import AppError from '@shared/errors/AppError';
import uploadConfig from '@config/upload';

class S3StorageProvider implements IStorageProvider {
  private client: S3;

  constructor() {
    this.client = new S3({
      region: 'us-east-2',
      followRegionRedirects: true,
    });
  }

  public async saveFile(file: string): Promise<string> {
    const originalPath = path.resolve(uploadConfig.tmpFolder, file);

    const ContentType = mime.getType(originalPath);

    if (!ContentType) {
      throw new AppError('File not found');
    }

    const fileContent = await fs.promises.readFile(originalPath);

    await this.client.putObject({
      Bucket: uploadConfig.config.aws.bucket,
      Key: file,
      // ACL: 'public-read', // Just in case ACLs are enabled
      Body: fileContent,
      ContentType,
      ContentDisposition: `inline; filename=${file}`,
    });

    await fs.promises.unlink(originalPath);

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    await this.client.deleteObject({
      Bucket: uploadConfig.config.aws.bucket,
      Key: file,
    });
  }
}

export default S3StorageProvider;
