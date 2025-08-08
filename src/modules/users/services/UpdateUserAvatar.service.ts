import { inject, injectable } from 'tsyringe';

import { IUser } from '@modules/users/interfaces/IUser';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import { BadRequestError, NotFoundError } from '@shared/errors';

interface IUpdateUserAvatarServiceRequest {
  user_id: string;
  avatarFileName?: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id, avatarFileName }: IUpdateUserAvatarServiceRequest): Promise<IUser> {
    if (!avatarFileName) throw new BadRequestError('Avatar não fornecido');

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    if (user.avatar) {
      await this.storageProvider.deleteFile(user.avatar);
    }

    const fileName = await this.storageProvider.saveFile(avatarFileName);
    user.avatar = fileName;

    await this.usersRepository.update(user);

    return user;
  }
}

export default UpdateUserAvatarService;
