import { UserRoles } from './UserRoles';

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar?: string | null;
  role: UserRoles;
  created_at: Date;
  updated_at: Date;
}
