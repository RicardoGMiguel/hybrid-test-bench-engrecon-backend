import serialRouter from '@modules/serial/infra/http/routes';
import Module from '@shared/decorators/Module';

@Module({
  router: serialRouter,
})
export default class SerialModule {}
