/**
 *  @openapi
 *  components:
 *    responses:
 *      BadRequest:
 *        description: Bad Request
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CelebrateError'
 *            examples:
 *              CelebrateError:
 *                description: Parâmetros de entrada inválidos
 *                value:
 *                  message: string
 */
