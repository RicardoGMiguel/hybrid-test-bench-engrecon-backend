import { describe, expect, it, vi } from 'vitest';

import { BadRequestError, NotFoundError } from '@shared/errors';

import { createUserData, mockUpdateUserAvatarService } from '../mocks';

describe('upadateAvatarService', () => {
  it('should be able to save an avatar', async () => {
    const { fakeUsersRepository, updateUserAvatarService } = mockUpdateUserAvatarService();
    const user = await fakeUsersRepository.create(createUserData({}));

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFileName: 'avatar.jpg',
    });

    expect(user.avatar).toBe('avatar.jpg');
  });

  it('should be able to replace avatar', async () => {
    const { fakeStorageProvider, fakeUsersRepository, updateUserAvatarService } = mockUpdateUserAvatarService();
    const deleteFile = vi.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create(createUserData({}));

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFileName: 'avatar.jpg',
    });

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFileName: 'avatar2.jpg',
    });

    expect(deleteFile).toBeCalledWith('avatar.jpg');
    expect(user.avatar).toBe('avatar2.jpg');
  });

  it('should not be able setup an avatar without the resource file', async () => {
    const { updateUserAvatarService, fakeUsersRepository } = mockUpdateUserAvatarService();

    const user = await fakeUsersRepository.create(createUserData({}));

    await expect(
      updateUserAvatarService.execute({
        user_id: user.id,
      }),
    ).rejects.toBeInstanceOf(BadRequestError);
  });

  it('should not be able to create avatar for a non-existent user', async () => {
    const { updateUserAvatarService } = mockUpdateUserAvatarService();
    await expect(
      updateUserAvatarService.execute({
        user_id: 'anyone',
        avatarFileName: 'avatar2.jpg',
      }),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
