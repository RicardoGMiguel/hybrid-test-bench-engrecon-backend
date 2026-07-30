import opcuaRouter from '@modules/opcua/infra/http/routes';
import Module from '@shared/decorators/Module';

@Module({
  router: opcuaRouter,
})
export default class OpcuaModule {}
