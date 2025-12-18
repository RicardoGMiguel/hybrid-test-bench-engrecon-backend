import { plainToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import Report from '@modules/reports/infra/typeorm/entities/Report';
import CreateReportService from '@modules/reports/services/CreateReport.service';
import DeleteAllReportsService from '@modules/reports/services/DeleteAllReports.service';
import IndexReportsService from '@modules/reports/services/IndexReports.service';
import IndexReportsChartDataService from '@modules/reports/services/IndexReportsChartData.service';

export default class ReportsController {
  public async index(req: Request, res: Response): Promise<Response> {
    const indexReportsService = container.resolve(IndexReportsService);

    const reports = await indexReportsService.execute();

    return res.json(plainToInstance(Report, reports));
  }

  public async indexChartData(req: Request, res: Response): Promise<Response> {
    const indexReportsChartDataService = container.resolve(IndexReportsChartDataService);

    const reportsChartData = await indexReportsChartDataService.execute();

    return res.json(reportsChartData);
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const { time, cardanSpeed, motorSpeed, currentStepperMotorState, commandCouplingInstant } = req.body;

    const createReportService = container.resolve(CreateReportService);

    const report = await createReportService.execute({
      time,
      cardanSpeed,
      motorSpeed,
      currentStepperMotorState,
      commandCouplingInstant,
    });

    return res.json(plainToInstance(Report, report));
  }

  public async deleteAll(req: Request, res: Response): Promise<Response> {
    const deleteAllReportsService = container.resolve(DeleteAllReportsService);

    await deleteAllReportsService.execute();

    return res.json();
  }
}
