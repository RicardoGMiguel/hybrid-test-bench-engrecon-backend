import { v4 as uuid } from 'uuid';

import { IUserToken } from '@modules/users/interfaces';
import IUsersTokenRepository from '@modules/users/repositories/IUsersTokenRepository';

import FakeUserToken from '../fakeEntities/FakeUserToken';

class FakeUserTokensRepository implements IUsersTokenRepository {
  private users_tokens: IUserToken[] = [];

  async findByToken(token: string): Promise<IUserToken | null> {
    const userTokenFound = this.users_tokens.find(user_token => user_token.token === token);

    return userTokenFound || null;
  }

  async generate(user_id: string): Promise<IUserToken> {
    const userToken = new FakeUserToken();

    Object.assign(userToken, {
      id: uuid(),
      token: uuid(),
      user_id,
    });

    this.users_tokens.push(userToken);

    return userToken;
  }

  async delete(id: string): Promise<void> {
    const userTokenIdx = this.users_tokens.findIndex(user_token => user_token.id === id);

    if (userTokenIdx >= 0) {
      this.users_tokens.splice(userTokenIdx, 1);
    }
  }
}

export default FakeUserTokensRepository;
