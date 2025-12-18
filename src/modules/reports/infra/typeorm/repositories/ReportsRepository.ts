import { Repository } from 'typeorm';

import ICreateReportDTO from '@modules/reports/dtos/ICreateReportDTO';
import { IReport } from '@modules/reports/interfaces/IReport';
import IReportsRepository from '@modules/reports/repositories/IReportsRepository';
import useORM from '@config/orm';

import TypeORMReport from '../entities/Report';

class ReportsRepository implements IReportsRepository {
  private ormRepository: Repository<IReport>;

  constructor() {
    // @ts-ignore
    this.ormRepository = useORM.getRepository(TypeORMReport);
  }

  public async findAll(): Promise<IReport[]> {
    const reports = await this.ormRepository.find();

    return reports;
  }

  public async create({
    time,
    cardanSpeed,
    motorSpeed,
    currentStepperMotorState,
    commandCouplingInstant,
  }: ICreateReportDTO): Promise<IReport> {
    const report = this.ormRepository.create({ time, cardanSpeed, motorSpeed, currentStepperMotorState, commandCouplingInstant });
    await this.ormRepository.save(report);

    return report;
  }

  public async deleteAll(): Promise<void> {
    await this.ormRepository.deleteAll();
  }
}

export default ReportsRepository;
