import { Router } from 'express';

import opcuaRouter from '@modules/opcua/infra/http/routes/opcua.routes';

const routes = Router();

routes.use('/opcua', opcuaRouter);

export default routes;
