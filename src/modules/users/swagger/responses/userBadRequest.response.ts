/**
 *  @openapi
 *  components:
 *    responses:
 *      UserBadRequest:
 *        description: Bad Request
 *        content:
 *          application/json:
 *            schema:
 *              oneOf:
 *                - $ref: '#/components/schemas/ServiceError'
 *                - $ref: '#/components/schemas/CelebrateError'
 *            examples:
 *              ServiceError:
 *                description: Email fornecido já está em uso
 *                value:
 *                  status: error
 *                  message: Email já usado
 *              CelebrateError:
 *                description: Parâmetros de entrada inválildos
 *                value:
 *                  message: string
 *
 */
