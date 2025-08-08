import { addHours, isAfter } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUsersTokenRepository from '@modules/users/repositories/IUsersTokenRepository';
import { BadRequestError, NotFoundError } from '@shared/errors';

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUsersRepository,

    @inject('UsersTokenRepository')
    private userTokenRepository: IUsersTokenRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ password, token }: IRequest): Promise<void> {
    const userToken = await this.userTokenRepository.findByToken(token);

    if (!userToken) {
      throw new NotFoundError('Token não encontrado');
    }

    const user = await this.userRepository.findById(userToken.user_id);

    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    const tokenCreatedAt = userToken.created_at;

    const compareDate = addHours(tokenCreatedAt, 2);

    if (isAfter(Date.now(), compareDate)) {
      throw new BadRequestError('Token expirado');
    }

    user.password = await this.hashProvider.generateHash(password);

    await this.userRepository.update(user);
    await this.userTokenRepository.delete(userToken.id);
  }
}

export default ResetPasswordService;
