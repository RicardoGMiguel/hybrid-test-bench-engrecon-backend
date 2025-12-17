import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateReportChart1765988299784 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'reports',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'time', type: 'numeric' },
          { name: 'cardanSpeed', type: 'numeric' },
          { name: 'motorSpeed', type: 'numeric' },
          { name: 'currentStepperMotorState', type: 'numeric' },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('reports');
  }
}
