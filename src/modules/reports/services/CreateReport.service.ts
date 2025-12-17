import { inject, injectable } from 'tsyringe';

import { IReport } from '@modules/reports/interfaces/IReport';
import IReportsRepository from '@modules/reports/repositories/IReportsRepository';

interface IRequest {
  time: number;
  cardanSpeed: number;
  motorSpeed: number;
  currentStepperMotorState: number;
}

@injectable()
class CreateReportService {
  constructor(
    @inject('ReportsRepository')
    private reportsRepository: IReportsRepository,
  ) {}

  public async execute({ time, cardanSpeed, motorSpeed, currentStepperMotorState }: IRequest): Promise<IReport> {
    const report = await this.reportsRepository.create({
      time,
      cardanSpeed,
      motorSpeed,
      currentStepperMotorState,
    });

    return report;
  }
}

export default CreateReportService;
