import { v4 as uuid } from 'uuid';

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import { IUser } from '@modules/users/interfaces/IUser';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import FakeUser from '../fakeEntities/FakeUser';

class FakeUsersRepository implements IUsersRepository {
  private users: IUser[] = [];

  public async findAll(): Promise<IUser[]> {
    return this.users;
  }

  public async findById(id: string): Promise<IUser | null> {
    const findUser = this.users.find(user => user.id === id);

    return findUser || null;
  }

  public async findByEmail(email: string): Promise<IUser | null> {
    const findUser = this.users.find(user => user.email === email);

    return findUser || null;
  }

  public async create({ email, password, name, role }: ICreateUserDTO): Promise<IUser> {
    const user = new FakeUser();

    Object.assign(user, { id: uuid(), email, password, name, role });

    this.users.push(user);

    return user;
  }

  public async update(user: IUser): Promise<IUser> {
    const index = this.users.findIndex(findUser => findUser.id === user.id);

    this.users[index] = user;

    return user;
  }

  public async delete({ id }: IUser): Promise<void> {
    const index = this.users.findIndex(findUser => findUser.id === id);

    this.users.splice(index, 1);
  }
}

export default FakeUsersRepository;
