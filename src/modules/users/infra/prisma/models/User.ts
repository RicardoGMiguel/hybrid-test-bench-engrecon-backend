import { UserRoles } from '@prisma/client';
import { Exclude } from 'class-transformer';

import { IUser } from '@modules/users/interfaces/IUser';

export default class User implements IUser {
  id: string;

  name: string;

  email: string;

  @Exclude()
  password: string;

  avatar?: string | null;

  role: UserRoles;

  created_at: Date;

  updated_at: Date;
}
