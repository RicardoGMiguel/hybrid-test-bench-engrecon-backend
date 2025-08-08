import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddUserRoleField1684508875389 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "user_roles_enum" AS ENUM('ADMIN', 'OPERATOR')`);

    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'role',
        type: 'enum',
        enumName: 'user_roles_enum',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'role');
    await queryRunner.query('DROP TYPE "user_roles_enum"');
  }
}
