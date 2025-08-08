import { PrismaClient } from '@prisma/client';

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import { IUser } from '@modules/users/interfaces/IUser';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import useORM from '@config/orm';

export default class UsersRepository implements IUsersRepository {
  private ormRepository: PrismaClient;

  constructor() {
    // @ts-ignore
    this.ormRepository = useORM;
  }

  public async findById(id: string): Promise<IUser | null> {
    const user = await this.ormRepository.user.findUnique({ where: { id } });

    return user;
  }

  public async findByEmail(email: string): Promise<IUser | null> {
    const user = await this.ormRepository.user.findFirst({ where: { email } });

    return user;
  }

  public async findAll(): Promise<IUser[]> {
    const users = await this.ormRepository.user.findMany();

    return users;
  }

  public async update({ id, ...data }: IUser): Promise<IUser> {
    const user = await this.ormRepository.user.update({ where: { id }, data });

    return user;
  }

  public async create({ name, email, password, role }: ICreateUserDTO): Promise<IUser> {
    const user = await this.ormRepository.user.create({ name, email, password, role });

    return user;
  }

  public async delete(user: IUser): Promise<void> {
    await this.ormRepository.user.delete({ where: { id: user.id } });
  }
}
