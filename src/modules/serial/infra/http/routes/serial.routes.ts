import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';

import TestController from '@modules/serial/infra/http/controllers/Test.controller';
import ensureAuthenticated from '@modules/serial/infra/http/middlewares/ensureAuthenticated';

import CarlaController from '../controllers/Carla.controller';
import CommandController from '../controllers/Command.controller';
import CycleController from '../controllers/Cycle.controller';

const testController = new TestController();
const commandController = new CommandController();
const cycleController = new CycleController();
const carlaController = new CarlaController();

const serialRouter = Router();

serialRouter.get('/', ensureAuthenticated, testController.index);

serialRouter.post(
  '/command',
  celebrate({
    [Segments.BODY]: {
      cmd: Joi.string().required(),
      mode: Joi.string().required(),
      cardanSpeed: Joi.string().required(),
      rampTime: Joi.string().required(),
    },
  }),
  commandController.create,
);

serialRouter.post(
  '/cycle/command',
  celebrate({
    [Segments.BODY]: {
      cmd: Joi.string().required(),
      cycle: Joi.string().required(),
    },
  }),
  cycleController.create,
);

serialRouter.post(
  '/carla/command',
  celebrate({
    [Segments.BODY]: {
      cmd: Joi.string().required(),
    },
  }),
  carlaController.create,
);

export default serialRouter;
