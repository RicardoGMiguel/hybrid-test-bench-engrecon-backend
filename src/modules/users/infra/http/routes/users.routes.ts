import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';

import UserAvatarController from '@modules/users/infra/http/controllers/UserAvatar.controller';
import UsersController from '@modules/users/infra/http/controllers/Users.controller';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import { UserRoles } from '@modules/users/interfaces';

const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

const usersRouter = Router();

/**
 *  @openapi
 *  /api/users:
 *    get:
 *      tags:
 *        - Users
 *      summary: 'Listar usuários'
 *      responses:
 *        200:
 *          description: Sucesso - Usuários indexados
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/User'
 *        400:
 *          $ref: '#/components/responses/BadRequest'
 *        401:
 *          $ref: '#/components/responses/Unauthorized'
 *
 */
usersRouter.get('/', ensureAuthenticated, usersController.index);

/**
 *  @openapi
 *  /api/users/{user_id}:
 *    get:
 *      tags:
 *        - Users
 *      summary: 'Mostrar usuário'
 *      parameters:
 *        - in: path
 *          name: user_id
 *          description: Id de usuário
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *       200:
 *         description: Sucesso - Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/UserNotFound'
 *
 */
usersRouter.get(
  '/:user_id',
  ensureAuthenticated,
  celebrate({
    [Segments.PARAMS]: {
      user_id: Joi.string().trim().uuid().required(),
    },
  }),
  usersController.show,
);

/**
 *  @openapi
 *  /api/users:
 *    post:
 *      tags:
 *        - Users
 *      summary: 'Criar um usuário'
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CreateUserInput'
 *      responses:
 *        200:
 *          description: Sucesso - Usuário criado
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 *        400:
 *          $ref: '#/components/responses/UserBadRequest'
 *        401:
 *          $ref: '#/components/responses/Unauthorized'
 *
 */
usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().trim().email().required(),
      name: Joi.string().trim().required(),
      password: Joi.string().min(8).required(),
      role: Joi.string()
        .trim()
        .valid(...Object.values(UserRoles))
        .required(),
    },
  }),
  usersController.create,
);

/**
 *  @openapi
 *  /api/users/{user_id}:
 *    put:
 *      tags:
 *        - Users
 *      summary: 'Atualizar um usuário'
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: user_id
 *          description: Id de usuário
 *          required: true
 *          schema:
 *            type: string
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UpdateUserInput'
 *      responses:
 *        200:
 *          description: Sucesso - Usuário atualizado
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 *        400:
 *          $ref: '#/components/responses/UserBadRequest'
 *        401:
 *          $ref: '#/components/responses/Unauthorized'
 *        404:
 *          $ref: '#/components/responses/UserNotFound'
 *
 */
usersRouter.put(
  '/:user_id',
  ensureAuthenticated,
  celebrate({
    [Segments.PARAMS]: {
      user_id: Joi.string().trim().uuid().required(),
    },
    [Segments.BODY]: {
      email: Joi.string().trim().email().optional(),
      name: Joi.string().trim().optional(),
      password: Joi.string().min(8).optional(),
      old_password: Joi.string().min(8).when('password', { is: Joi.exist(), then: Joi.required() }),
    },
  }),
  usersController.update,
);

/**
 *  @openapi
 *  /api/users/{user_id}:
 *    delete:
 *      tags:
 *        - Users
 *      summary: 'Deletar um usuário'
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: user_id
 *          description: Id de usuário
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: Sucesso - Usuário deletado
 *        400:
 *          $ref: '#/components/responses/BadRequest'
 *        401:
 *          $ref: '#/components/responses/Unauthorized'
 *        404:
 *          $ref: '#/components/responses/UserNotFound'
 *
 */
usersRouter.delete(
  '/:user_id',
  ensureAuthenticated,
  celebrate({
    [Segments.PARAMS]: {
      user_id: Joi.string().trim().uuid().required(),
    },
  }),
  usersController.delete,
);

/**
 *  @openapi
 *  /api/users/avatar:
 *    patch:
 *      tags:
 *        - Users
 *      summary: 'Atualizar o avatar de um usuário'
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UpdateUserAvatarInput'
 *      responses:
 *        200:
 *          description: Sucesso - Avatar de usuário atualizado
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 *        400:
 *          $ref: '#/components/responses/UserBadRequest'
 *        401:
 *          $ref: '#/components/responses/Unauthorized'
 *        404:
 *          $ref: '#/components/responses/UserNotFound'
 *
 */
usersRouter.patch('/avatar', ensureAuthenticated, userAvatarController.update);

export default usersRouter;
