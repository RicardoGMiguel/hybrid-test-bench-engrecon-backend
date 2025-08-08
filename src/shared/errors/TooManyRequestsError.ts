import HttpCode from '@constants/httpCodes';

import AppError from './AppError';

export class TooManyRequestsError extends AppError {
  constructor(message: string) {
    super(message, HttpCode.TOO_MANY_REQUESTS);
  }
}
