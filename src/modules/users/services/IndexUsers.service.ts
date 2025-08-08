import { inject, injectable } from 'tsyringe';

import { IUser } from '@modules/users/interfaces/IUser';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

@injectable()
class IndexUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(): Promise<IUser[]> {
    const users = await this.usersRepository.findAll();

    return users;
  }
}

export default IndexUsersService;
