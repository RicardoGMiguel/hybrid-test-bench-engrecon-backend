/**
 *  @openapi
 *  components:
 *    responses:
 *      UserNotFound:
 *        description: Not Found
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ServiceError'
 *            example:
 *              status: error
 *              message: Usuário não existe
 */
