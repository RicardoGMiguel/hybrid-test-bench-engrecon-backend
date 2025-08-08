import expressWinston from 'express-winston';

import logger from '@config/log';

export const loggingMiddleware = expressWinston.logger({
  winstonInstance: logger,
  expressFormat: true,
});
