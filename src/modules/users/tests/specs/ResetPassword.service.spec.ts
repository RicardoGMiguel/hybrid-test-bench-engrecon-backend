import { BadRequestError, NotFoundError } from '@shared/errors';

import { createUserData, mockResetPasswordService } from '../mocks';

describe('ResetPasswordService', () => {
  it('should be able to reset user password', async () => {
    const { fakeUsersRepository, fakeUsersTokensRepository, resetPasswordService, fakeHashProvider } = mockResetPasswordService();

    const user = await fakeUsersRepository.create(createUserData({}));
    const userToken = await fakeUsersTokensRepository.generate(user.id);

    const generateHashSpy = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPasswordService.execute({
      token: userToken.token,
      password: 'pass@123',
    });

    expect(generateHashSpy).toHaveBeenCalledWith('pass@123');
  });

  it('should not be able to send reset password a non-existent user', async () => {
    const { resetPasswordService, fakeUsersTokensRepository } = mockResetPasswordService();

    const userToken = await fakeUsersTokensRepository.generate('non-existent');

    expect(
      resetPasswordService.execute({
        token: userToken.token,
        password: 'pass@123',
      }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it('should not be able to send reset password a non-existent token', async () => {
    const { resetPasswordService } = mockResetPasswordService();

    expect(
      resetPasswordService.execute({
        token: 'non-existent-token',
        password: 'pass@123',
      }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it('should not be able to send reset password when token has expired', async () => {
    const { fakeUsersRepository, fakeUsersTokensRepository, resetPasswordService } = mockResetPasswordService();

    const user = await fakeUsersRepository.create(createUserData({}));
    const userToken = await fakeUsersTokensRepository.generate(user.id);

    jest.spyOn(fakeUsersTokensRepository, 'findByToken').mockImplementationOnce(async () => ({
      ...userToken,
      created_at: new Date(1900, 1, 1),
    }));

    expect(
      resetPasswordService.execute({
        token: userToken.token,
        password: 'pass@123',
      }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });
});
