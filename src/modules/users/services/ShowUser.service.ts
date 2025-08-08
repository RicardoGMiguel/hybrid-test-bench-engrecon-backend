import { inject, injectable } from 'tsyringe';

import { IUser } from '@modules/users/interfaces/IUser';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { NotFoundError } from '@shared/errors';

interface IRequest {
  user_id: string;
}

@injectable()
class ShowUserService {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id }: IRequest): Promise<IUser> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) throw new NotFoundError('Usuário não existe');

    return user;
  }
}

export default ShowUserService;
