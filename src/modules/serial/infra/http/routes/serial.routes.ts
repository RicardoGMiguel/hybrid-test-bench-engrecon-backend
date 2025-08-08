import { Router } from 'express';

import TestController from '@modules/serial/infra/http/controllers/Test.controller';
import ensureAuthenticated from '@modules/serial/infra/http/middlewares/ensureAuthenticated';

const testController = new TestController();

const serialRouter = Router();

serialRouter.get('/', ensureAuthenticated, testController.index);

export default serialRouter;
