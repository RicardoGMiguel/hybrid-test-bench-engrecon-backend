import { UserRoles } from '@prisma/client';

import { IUser } from '@modules/users/interfaces/IUser';

export default class FakeUser implements IUser {
  id: string;

  name: string;

  email: string;

  password: string;

  avatar: string | null;

  role: UserRoles;

  created_at: Date;

  updated_at: Date;
}
