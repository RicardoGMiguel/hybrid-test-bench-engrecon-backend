import { IUserToken } from '@modules/users/interfaces';

export default class FakeUserToken implements IUserToken {
  id: string;
  token: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
}
