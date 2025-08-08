import { DataSource } from 'typeorm';

import { env } from '@config/env';
import logger from '@config/log';
import { orms } from '@config/orm/orms';

const useORM = orms[env.ORM];

if (useORM instanceof DataSource) useORM.initialize().catch(err => logger.error('Could not initialize TypeORM', err));

export default useORM;
