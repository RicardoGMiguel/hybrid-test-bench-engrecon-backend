import { NotFoundError } from '@shared/errors';

import { createUserData, mockSendForgotPasswordEmailService } from '../mocks';

describe('SendForgotPasswordEmailService', () => {
  it('should be able to send forgot password mail', async () => {
    const { fakeUsersRepository, sendForgotPasswordEmailService, fakeMailProvider } = mockSendForgotPasswordEmailService();
    const user = await fakeUsersRepository.create(createUserData({}));

    const sendMailSpy = jest.spyOn(fakeMailProvider, 'sendMail');

    await sendForgotPasswordEmailService.execute({
      email: user.email,
    });

    expect(sendMailSpy).toHaveBeenCalledTimes(1);
  });

  it('should not be able to send forgot password a non-existent user', async () => {
    const { sendForgotPasswordEmailService } = mockSendForgotPasswordEmailService();

    expect(
      sendForgotPasswordEmailService.execute({
        email: 'non-existent-user',
      }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
