import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';

import PasswordsController from '@modules/users/infra/http/controllers/Passwords.controller';

const passwordsController = new PasswordsController();

const passwordsRouter = Router();

passwordsRouter.post(
  '/forgot',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
    },
  }),
  passwordsController.forgot,
);

passwordsRouter.put(
  '/reset',
  celebrate({
    [Segments.BODY]: {
      token: Joi.string().uuid().required(),
      password: Joi.string().required(),
      password_confirmation: Joi.string().required().valid(Joi.ref('password')),
    },
  }),
  passwordsController.reset,
);

export default passwordsRouter;
