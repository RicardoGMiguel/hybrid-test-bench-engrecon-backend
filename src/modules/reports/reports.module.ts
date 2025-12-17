import reportsRouter from '@modules/reports/infra/http/routes';
import ReportsRepository from '@modules/reports/infra/typeorm/repositories/ReportsRepository';
import Module from '@shared/decorators/Module';

@Module({
  router: reportsRouter,
  providers: [{ provideAs: 'ReportsRepository', useClass: ReportsRepository }],
})
export default class ReportsModule {}
