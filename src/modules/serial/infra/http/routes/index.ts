import { Router } from 'express';

import serialRouter from '@modules/serial/infra/http/routes/serial.routes';

const routes = Router();

routes.use('/serial', serialRouter);

export default routes;
