import { describe, expect, it } from 'vitest';

import { createUserData, mockIndexUsersService } from '../mocks';

describe('IndexUsersService', () => {
  it('should be able to index users', async () => {
    const { fakeUsersRepository, indexUsersService } = mockIndexUsersService();
    await fakeUsersRepository.create(createUserData({}));

    await fakeUsersRepository.create(createUserData({ email: 'jj2@fmail.com' }));

    const users = await indexUsersService.execute();

    expect(users?.length).toBe(2);
  });
});
