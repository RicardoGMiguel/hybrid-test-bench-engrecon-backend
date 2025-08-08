import { describe, expect, it } from 'vitest';

import { NotFoundError } from '@shared/errors';

import { createUserData, mockShowUserService } from '../mocks';

describe('ShowUserService', () => {
  it('should be able to show an user', async () => {
    const { fakeUsersRepository, showUserService } = mockShowUserService();
    const user = await fakeUsersRepository.create(createUserData({}));

    const showUser = await showUserService.execute({ user_id: user.id });

    expect(showUser.id).toBe(user.id);
  });

  it('should not be able to show a non-exitent user', async () => {
    const { showUserService } = mockShowUserService();
    expect(showUserService.execute({ user_id: 'non-exitent-user_id' })).rejects.toBeInstanceOf(NotFoundError);
  });
});
