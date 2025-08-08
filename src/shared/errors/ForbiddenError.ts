import HttpCode from '@constants/httpCodes';

import AppError from './AppError';

export class ForbiddenError extends AppError {
  constructor(message: string) {
    super(message, HttpCode.FORBIDDEN);
  }
}
