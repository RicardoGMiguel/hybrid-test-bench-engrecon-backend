import { inject, injectable } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { NotFoundError } from '@shared/errors';

interface IRequest {
  user_id: string;
}

@injectable()
class DeleteUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id }: IRequest): Promise<void> {
    const findUser = await this.usersRepository.findById(user_id);

    if (!findUser) throw new NotFoundError('Usuário não encontrado');

    await this.usersRepository.delete(findUser);
  }
}

export default DeleteUserService;
