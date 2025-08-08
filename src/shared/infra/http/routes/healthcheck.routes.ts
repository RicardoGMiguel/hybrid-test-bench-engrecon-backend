import { Router } from 'express';

const healthcheckRouter = Router();

/**
 * @openapi
 * /healthcheck:
 *  get:
 *     tags:
 *     - Healthcheck
 *     description: Retorna se a aplicação está funcionando
 *     responses:
 *       200:
 *         description: A aplicação está funcionando
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: active
 */
healthcheckRouter.use('/healthcheck', (_req, res): void => {
  res.send({ status: 'active' });
});

export default healthcheckRouter;
