import { inject, injectable } from 'tsyringe';

import { IReport } from '@modules/reports/interfaces/IReport';
import IReportsRepository from '@modules/reports/repositories/IReportsRepository';

interface IRequest {
  time: number;
  cardanSpeed: number;
  motorSpeed: number;
  actuatorState: number;
  commandCouplingInstant: number;
}

@injectable()
class CreateReportService {
  constructor(
    @inject('ReportsRepository')
    private reportsRepository: IReportsRepository,
  ) {}

  public async execute({ time, cardanSpeed, motorSpeed, actuatorState, commandCouplingInstant }: IRequest): Promise<IReport> {
    const report = await this.reportsRepository.create({
      time,
      cardanSpeed,
      motorSpeed,
      actuatorState,
      commandCouplingInstant,
    });

    return report;
  }
}

export default CreateReportService;
