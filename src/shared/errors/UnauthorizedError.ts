import HttpCode from '@constants/httpCodes';

import AppError from './AppError';

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, HttpCode.UNAUTHORIZED);
  }
}
