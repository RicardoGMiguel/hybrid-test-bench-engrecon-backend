import { MigrationInterface, QueryRunner } from 'typeorm';

export class InstallUuid1662657742630 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
  }

  public async down(): Promise<void> {
    //
  }
}
