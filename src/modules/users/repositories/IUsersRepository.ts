import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

import { IUser } from '../interfaces/IUser';

export default interface IUsersRepository {
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  findAll(): Promise<IUser[]>;
  create(data: ICreateUserDTO): Promise<IUser>;
  delete(user: IUser): Promise<void>;
  update: (user: IUser) => Promise<IUser>;
}
