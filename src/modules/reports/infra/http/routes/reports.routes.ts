import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';

import ReportsController from '@modules/reports/infra/http/controllers/Reports.controller';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const reportsController = new ReportsController();

const reportsRouter = Router();

reportsRouter.get('/', ensureAuthenticated, reportsController.index);

reportsRouter.get('/chart', ensureAuthenticated, reportsController.indexChartData);

reportsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      time: Joi.number().required(),
      cardanSpeed: Joi.number().required(),
      motorSpeed: Joi.number().required(),
      currentStepperMotorState: Joi.number().required(),
      commandCouplingInstant: Joi.number().required(),
    },
  }),
  reportsController.create,
);

reportsRouter.delete('/', ensureAuthenticated, reportsController.deleteAll);

export default reportsRouter;
