import { inject, injectable } from 'tsyringe';

import IReportsRepository from '@modules/reports/repositories/IReportsRepository';

import { IDiffSpeedChart, IReportsChartData, ISpeedChart } from '../interfaces';

@injectable()
class IndexReportsChartDataService {
  constructor(
    @inject('ReportsRepository')
    private reportsRepository: IReportsRepository,
  ) {}

  public async execute(): Promise<IReportsChartData> {
    const reports = await this.reportsRepository.findAll();

    if (reports.length === 0) {
      return {} as IReportsChartData;
    }

    const newCommandCouplingInstant = Number(reports[0].commandCouplingInstant);

    const newCouplingInstant = Number(reports.find(item => item.currentStepperMotorState === 1)?.time) || 0;

    const newSpeedChartData: ISpeedChart[] = reports.map(report => {
      const data: ISpeedChart = {
        time: Number(report.time),
        cardanSpeed: Number(report.cardanSpeed),
        motorSpeed: Number(report.motorSpeed),
      };

      return data;
    });

    const newDiffSpeedChartData: IDiffSpeedChart[] = reports.map(report => {
      const data: IDiffSpeedChart = {
        time: Number(report.time),
        diffSpeedBetweenShafts: report.cardanSpeed - report.motorSpeed,
      };

      return data;
    });

    const reportsChartData: IReportsChartData = {
      couplingInfo: {
        couplingCommandInstant: newCommandCouplingInstant,
        couplingInstant: newCouplingInstant,
      },
      speedChartData: newSpeedChartData,
      diffSpeedChart: newDiffSpeedChartData,
    };

    return reportsChartData;
  }
}

export default IndexReportsChartDataService;
