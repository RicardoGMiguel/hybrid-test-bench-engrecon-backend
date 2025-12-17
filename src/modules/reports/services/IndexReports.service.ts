import { inject, injectable } from 'tsyringe';

import { IReport } from '@modules/reports/interfaces/IReport';
import IReportsRepository from '@modules/reports/repositories/IReportsRepository';

@injectable()
class IndexReportsService {
  constructor(
    @inject('ReportsRepository')
    private reportsRepository: IReportsRepository,
  ) {}

  public async execute(): Promise<IReport[]> {
    const reports = await this.reportsRepository.findAll();

    return reports;
  }
}

export default IndexReportsService;
