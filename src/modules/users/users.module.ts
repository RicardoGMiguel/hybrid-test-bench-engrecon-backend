import Module from '@shared/decorators/Module';

import './swagger';

import usersRouter from '@modules/users/infra/http/routes';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import BCryptHashProvider from '@modules/users/providers/HashProvider/implementations/BCryptHashProvider';

import UsersTokenRepository from './infra/typeorm/repositories/UsersTokensRepository';

@Module({
  router: usersRouter,
  providers: [
    { provideAs: 'UsersRepository', useClass: UsersRepository },
    { provideAs: 'UsersTokenRepository', useClass: UsersTokenRepository },
    { provideAs: 'HashProvider', useClass: BCryptHashProvider },
  ],
})
export default class UsersModule {}
