import { describe, expect, it } from 'vitest';

import { createUserData, mockDeleteUserService } from '@modules/users/tests/mocks';
import { NotFoundError } from '@shared/errors';

describe('DeleteUserService', () => {
  it('should be able to delete an user', async () => {
    const { deleteUserService, fakeUsersRepository } = mockDeleteUserService();

    const user = await fakeUsersRepository.create(createUserData({}));

    expect(await deleteUserService.execute({ user_id: user.id })).toBeUndefined();
  });

  it('should return an error if the user does not exist', async () => {
    const { deleteUserService } = mockDeleteUserService();

    await expect(deleteUserService.execute({ user_id: 'non-existent-user-id' })).rejects.toBeInstanceOf(NotFoundError);
  });
});
