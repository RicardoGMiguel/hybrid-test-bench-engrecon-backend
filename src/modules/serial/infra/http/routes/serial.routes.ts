import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';

import TestController from '@modules/serial/infra/http/controllers/Test.controller';
import ensureAuthenticated from '@modules/serial/infra/http/middlewares/ensureAuthenticated';

import CommandController from '../controllers/Command.controller';

const testController = new TestController();
const commandController = new CommandController();

const serialRouter = Router();

serialRouter.get('/', ensureAuthenticated, testController.index);

serialRouter.post(
  '/command',
  celebrate({
    [Segments.BODY]: {
      cmd: Joi.string().required(),
      mode: Joi.string().required(),
    },
  }),
  commandController.create,
);

export default serialRouter;
