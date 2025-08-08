import { inject, injectable } from 'tsyringe';

import { IUser } from '@modules/users/interfaces/IUser';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { BadRequestError } from '@shared/errors';

import { UserRoles } from '../interfaces';

interface IRequest {
  name: string;
  email: string;
  password: string;
  role: UserRoles;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ name, email, password, role }: IRequest): Promise<IUser> {
    const checkUserExists = await this.usersRepository.findByEmail(email);

    if (checkUserExists) throw new BadRequestError('Email já usado');

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return user;
  }
}

export default CreateUserService;
