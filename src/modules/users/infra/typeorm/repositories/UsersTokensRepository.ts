import { Repository } from 'typeorm';

import TypeORMUserToken from '@modules/users/infra/typeorm/entities/UserToken';
import { IUserToken } from '@modules/users/interfaces';
import IUsersTokenRepository from '@modules/users/repositories/IUsersTokenRepository';
import useORM from '@config/orm';

class UsersTokenRepository implements IUsersTokenRepository {
  private ormRepository: Repository<IUserToken>;

  constructor() {
    // @ts-ignore
    this.ormRepository = useORM.getRepository(TypeORMUserToken);
  }

  public async findByToken(token: string): Promise<IUserToken | null> {
    const userToken = await this.ormRepository.findOne({
      where: { token },
    });

    return userToken;
  }

  public async generate(user_id: string): Promise<IUserToken> {
    const userToken = this.ormRepository.create({
      user_id,
    });

    await this.ormRepository.save(userToken);

    return userToken;
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}

export default UsersTokenRepository;
