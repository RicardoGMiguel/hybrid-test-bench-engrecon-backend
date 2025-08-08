import { UserRoles } from '@modules/users/interfaces';
import AuthenticateUserService from '@modules/users/services/AuthenticateUser.service';
import CreateUserService from '@modules/users/services/CreateUser.service';
import DeleteUserService from '@modules/users/services/DeleteUser.service';
import IndexUsersService from '@modules/users/services/IndexUsers.service';
import ResetPasswordService from '@modules/users/services/ResetPassword.service';
import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmail.service';
import ShowUserService from '@modules/users/services/ShowUser.service';
import UpdateUserService from '@modules/users/services/UpdateUser.service';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatar.service';
import FakeHashProvider from '@modules/users/tests/fakeProviders/FakeHashProvider';
import FakeUsersRepository from '@modules/users/tests/fakeRepositories/FakeUsersRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';

import FakeUserTokensRepository from '../fakeRepositories/FakeUsersTokensRepository';

interface ICreateUserData {
  email?: string;
  password?: string;
  name?: string;
  role?: UserRoles;
}

export const mockAuthenticateUserService = () => {
  const fakeUsersRepository = new FakeUsersRepository();
  const fakeHashProvider = new FakeHashProvider();
  const authenticateUserService = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);
  return { authenticateUserService, fakeUsersRepository };
};

export const mockCreateUserService = () => {
  const fakeUsersRepository = new FakeUsersRepository();
  const fakeHashProvider = new FakeHashProvider();
  const createUserService = new CreateUserService(fakeUsersRepository, fakeHashProvider);
  return createUserService;
};

export const mockIndexUsersService = () => {
  const fakeUsersRepository = new FakeUsersRepository();
  const indexUsersService = new IndexUsersService(fakeUsersRepository);
  return { indexUsersService, fakeUsersRepository };
};

export const mockShowUserService = () => {
  const fakeUsersRepository = new FakeUsersRepository();
  const showUserService = new ShowUserService(fakeUsersRepository);
  return { showUserService, fakeUsersRepository };
};

export const mockUpdateUserAvatarService = () => {
  const fakeUsersRepository = new FakeUsersRepository();
  const fakeStorageProvider = new FakeStorageProvider();
  const updateUserAvatarService = new UpdateUserAvatarService(fakeStorageProvider, fakeUsersRepository);
  return { fakeUsersRepository, fakeStorageProvider, updateUserAvatarService };
};

export const mockUpdateUserService = () => {
  const fakeUsersRepository = new FakeUsersRepository();
  const fakeHashProvider = new FakeHashProvider();
  const updateUserService = new UpdateUserService(fakeUsersRepository, fakeHashProvider);
  return { fakeUsersRepository, updateUserService, fakeHashProvider };
};

export const mockDeleteUserService = () => {
  const fakeUsersRepository = new FakeUsersRepository();
  const deleteUserService = new DeleteUserService(fakeUsersRepository);
  return { fakeUsersRepository, deleteUserService };
};

export const mockSendForgotPasswordEmailService = () => {
  const fakeUsersRepository = new FakeUsersRepository();
  const fakeUsersTokensRepository = new FakeUserTokensRepository();
  const fakeMailProvider = new FakeMailProvider();

  const sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
    fakeUsersRepository,
    fakeUsersTokensRepository,
    fakeMailProvider,
  );

  return { fakeUsersRepository, fakeUsersTokensRepository, fakeMailProvider, sendForgotPasswordEmailService };
};

export const mockResetPasswordService = () => {
  const fakeUsersRepository = new FakeUsersRepository();
  const fakeUsersTokensRepository = new FakeUserTokensRepository();
  const fakeHashProvider = new FakeHashProvider();

  const resetPasswordService = new ResetPasswordService(fakeUsersRepository, fakeUsersTokensRepository, fakeHashProvider);

  return { fakeUsersRepository, fakeUsersTokensRepository, fakeHashProvider, resetPasswordService };
};

export const createUserData = ({ email, name, password, role }: ICreateUserData) => ({
  email: email || 'jj@email.com',
  password: password || '123456',
  name: name || 'username',
  role: role || 'OPERATOR',
});
