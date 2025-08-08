import { Repository } from 'typeorm';

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import { IUser } from '@modules/users/interfaces/IUser';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import useORM from '@config/orm';

import TypeORMUser from '../entities/User';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<IUser>;

  constructor() {
    // @ts-ignore
    this.ormRepository = useORM.getRepository(TypeORMUser);
  }

  public async findById(id: string): Promise<IUser | null> {
    const findUser = await this.ormRepository.findOne({
      where: { id },
    });

    return findUser;
  }

  public async findByEmail(email: string): Promise<IUser | null> {
    const findUser = await this.ormRepository.findOne({
      where: { email },
    });

    return findUser;
  }

  public async findAll(): Promise<IUser[]> {
    const users = await this.ormRepository.find();

    return users;
  }

  public async create({ name, email, password, role }: ICreateUserDTO): Promise<IUser> {
    const user = this.ormRepository.create({ name, email, password, role });
    await this.ormRepository.save(user);

    return user;
  }

  public async update(user: IUser): Promise<IUser> {
    return this.ormRepository.save(user);
  }

  public async delete(user: IUser): Promise<void> {
    await this.ormRepository.remove(user);
  }
}

export default UsersRepository;
