import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';

import ensureAuthenticated from '@modules/opcua/infra/http/middlewares/ensureAuthenticated';

import CarlaController from '../controllers/Carla.controller';
import CommandController from '../controllers/Command.controller';
import CycleController from '../controllers/Cycle.controller';

const commandController = new CommandController();
const cycleController = new CycleController();
const carlaController = new CarlaController();

const serialRouter = Router();

serialRouter.post(
  '/command',
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      cmd: Joi.string().required(),
      mode: Joi.string().required(),
      cardanInitialSpeed: Joi.string().required(),
      cardanEndSpeed: Joi.string().required(),
      cardanTestTotalTime: Joi.string().required(),
      couplingInstant: Joi.string().required(),
    },
  }),
  commandController.create,
);

serialRouter.post(
  '/cycle/command',
  ensureAuthenticated,
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
  ensureAuthenticated,
  celebrate({
    [Segments.BODY]: {
      cmd: Joi.string().required(),
    },
  }),
  carlaController.create,
);

export default serialRouter;
