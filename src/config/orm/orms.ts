import 'dotenv/config';

import { PrismaClient } from '@prisma/client';
import { DataSource, EntitySchema } from 'typeorm';

// import path from 'path';

import * as entities from '@shared/infra/typeorm/entities';
import * as migrations from '@shared/infra/typeorm/migrations';
import { ORM } from '@shared/types/ORM';
import { env } from '@config/env';

export const orms = {
  [ORM.PRISMA]: new PrismaClient({
    log: ['info'],
  }),
  [ORM.TYPEORM]: new DataSource({
    type: 'postgres',
    url: env.DB_URL,
    logging: false,
    // entities: [
    //   env.PRODUCTION?.toLowerCase().trim() === 'true'
    //     ? path.join(__dirname, '..', '..', '..', 'dist/modules/**/infra/typeorm/entities/*.js')
    //     : path.join(__dirname, '..', '..', '..', 'src/modules/**/infra/typeorm/entities/*.ts'),
    // ],
    entities: Object.values(entities) as unknown as EntitySchema[], // Utilizar essa propriedade juntamente com o PKG
    migrations: Object.values(migrations) as unknown as Function[],
    migrationsRun: true, // Utilizar essa propriedade juntamente com o PKG
    // migrations: [
    //   env.PRODUCTION?.toLowerCase().trim() === 'true'
    //     ? path.join(__dirname, '..', '..', '..', 'dist/shared/infra/typeorm/migrations/*.js')
    //     : path.join(__dirname, '..', '..', '..', 'src/shared/infra/typeorm/migrations/*.ts'),
    // ],
    subscribers: ['common/subscriber/**/*.ts'],
  }),
};
