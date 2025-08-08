import HttpCode from '@constants/httpCodes';

import AppError from './AppError';

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, HttpCode.BAD_REQUEST);
  }
}
