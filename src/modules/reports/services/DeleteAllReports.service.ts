import { inject, injectable } from 'tsyringe';

import IReportsRepository from '@modules/reports/repositories/IReportsRepository';

@injectable()
class DeleteAllReportsService {
  constructor(
    @inject('ReportsRepository')
    private reportsRepository: IReportsRepository,
  ) {}

  public async execute(): Promise<void> {
    await this.reportsRepository.deleteAll();
  }
}

export default DeleteAllReportsService;
