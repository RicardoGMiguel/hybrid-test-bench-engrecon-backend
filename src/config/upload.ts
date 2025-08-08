import crypto from 'crypto';
import path from 'path';
import multer, { StorageEngine } from 'multer';

import { env } from './env';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

interface IUploaderConfig {
  driver: string;
  tmpFolder: string;
  uploadsFolder: string;
  multer: { storage: StorageEngine };
  config: {
    disk: unknown;
    aws: {
      bucket: string;
    };
  };
}

export default {
  driver: env.STORAGE_PROVIDER,
  tmpFolder,
  uploadsFolder: path.resolve(tmpFolder, 'uploads'),
  multer: {
    storage: multer.diskStorage({
      destination: tmpFolder,
      filename(req, file, call) {
        const filehash = crypto.randomBytes(10).toString('hex');
        const fileName = `${filehash}-${file.originalname}`;

        return call(null, fileName);
      },
    }),
  },

  config: {
    disk: {},
    aws: {
      bucket: 'example-bucket',
    },
  },
} as IUploaderConfig;
