import AppError from './AppError';

/**
 * If you need an error that it isn't defined by a specific class (not 400, 401, 403, 404 or 429),
 * you can use that to define what status code you need to return to client
 */
export class GenericError extends AppError {
  constructor(message: string, statusCode: number) {
    super(message, statusCode);
  }
}
