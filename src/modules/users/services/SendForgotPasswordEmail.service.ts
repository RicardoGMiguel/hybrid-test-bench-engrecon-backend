import path from 'node:path';
import { inject, injectable } from 'tsyringe';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import { NotFoundError } from '@shared/errors';
import { env } from '@config/env';

import IUsersRepository from '../repositories/IUsersRepository';
import IUsersTokenRepository from '../repositories/IUsersTokenRepository';

interface IRequest {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private userRepository: IUsersRepository,

    @inject('UsersTokenRepository')
    private userTokenRepository: IUsersTokenRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) {}

  public async execute({ email }: IRequest): Promise<void> {
    const checkUserExists = await this.userRepository.findByEmail(email);

    if (!checkUserExists) {
      throw new NotFoundError('Usuário não encontrado');
    }

    const { token } = await this.userTokenRepository.generate(checkUserExists.id);
    const forgotPasswordMailTemplate = path.resolve(__dirname, '..', 'views', 'forgotPassword.hbs');

    await this.mailProvider.sendMail({
      to: {
        email: checkUserExists.email,
        name: checkUserExists.name,
      },
      subject: 'Nome Empresa - Recuperação de senha',
      templateData: {
        file: forgotPasswordMailTemplate,
        variables: {
          name: checkUserExists.name,
          link: `${env.FRONTEND_URL}/resetPassword?token=${token}`,
          token,
        },
      },
    });
  }
}

export default SendForgotPasswordEmailService;
