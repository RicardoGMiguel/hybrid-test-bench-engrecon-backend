import { inject, injectable } from 'tsyringe';

import { IUser } from '@modules/users/interfaces/IUser';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { BadRequestError, NotFoundError } from '@shared/errors';

interface IRequest {
  user_id: string;
  name?: string;
  email?: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private readonly hashProvider: IHashProvider,
  ) {}

  public async execute({ user_id, name, email, old_password, password }: IRequest): Promise<IUser> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) throw new NotFoundError('Usuário não existe');

    if (email) {
      const verifyIfEmailIsUsed = await this.usersRepository.findByEmail(email);

      if (verifyIfEmailIsUsed && verifyIfEmailIsUsed.id !== user.id) throw new BadRequestError('Email já usado');
      user.email = email;
    }

    if (name) user.name = name;

    if (password && !old_password) throw new BadRequestError('Senha antiga não fornecida');

    if (password && old_password) {
      const checkOldPassword = await this.hashProvider.compareHash(old_password, user.password);

      if (!checkOldPassword) throw new BadRequestError('Senhas não correspondem');

      user.password = await this.hashProvider.generateHash(password);
    }

    return this.usersRepository.update(user);
  }
}

export default UpdateUserService;
