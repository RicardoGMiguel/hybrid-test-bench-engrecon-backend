import 'reflect-metadata';
import 'dotenv/config';
import 'express-async-errors';
import '@config/orm';

import { env } from '@config/env';
import logger from '@config/log';

import '@shared/container/';

import App from './app';

const port = env.PORT || 3001;

new App().express.listen(port, () => {
  logger.info(`Server running on http://localhost:${port}.`);
});
