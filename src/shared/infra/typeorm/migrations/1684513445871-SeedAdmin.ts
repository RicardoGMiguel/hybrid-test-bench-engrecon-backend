import { hash } from 'bcryptjs';
import { MigrationInterface, QueryRunner } from 'typeorm';

import { UserRoles } from '@modules/users/interfaces';

export class SeedAdmin1684513445871 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const password = await hash('admin@123', 8);

    await queryRunner.query(`INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3,$4)`, [
      'Admin',
      'admin@empresa.com',
      password,
      UserRoles.ADMIN,
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.createQueryBuilder().delete().from('users').where('email = :email', { email: 'admin@empresa.com' }).execute();
  }
}
