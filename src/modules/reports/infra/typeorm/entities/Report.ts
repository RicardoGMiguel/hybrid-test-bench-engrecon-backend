import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { IReport } from '@modules/reports/interfaces/IReport';

@Entity('reports')
class Report implements IReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('numeric')
  time: number;

  @Column('numeric')
  cardanSpeed: number;

  @Column('numeric')
  motorSpeed: number;

  @Column('numeric')
  currentStepperMotorState: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Report;
