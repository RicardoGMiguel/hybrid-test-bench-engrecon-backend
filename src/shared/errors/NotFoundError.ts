import HttpCode from '@constants/httpCodes';

import AppError from './AppError';

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, HttpCode.NOT_FOUND);
  }
}
