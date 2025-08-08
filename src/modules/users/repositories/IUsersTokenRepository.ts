import { IUserToken } from '@modules/users/interfaces';

export default interface IUsersTokenRepository {
  findByToken(token: string): Promise<IUserToken | null>;
  generate(user_id: string): Promise<IUserToken>;
  delete(id: string): Promise<void>;
}
