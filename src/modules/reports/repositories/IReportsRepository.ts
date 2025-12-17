import ICreateReportDTO from '@modules/reports/dtos/ICreateReportDTO';

import { IReport } from '../interfaces/IReport';

export default interface IReportsRepository {
  findAll(): Promise<IReport[]>;
  create(data: ICreateReportDTO): Promise<IReport>;
  deleteAll(): Promise<void>;
}
