/**
 *  @openapi
 *  components:
 *    responses:
 *      Unauthorized:
 *        description: Unauthorized
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ServiceError'
 *            examples:
 *              MissingJWT:
 *                $ref: '#/components/examples/MissingJWT'
 *
 *      UnauthorizedAdmin:
 *        description: Unauthorized
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ServiceError'
 *            examples:
 *              MissingJWT:
 *                $ref: '#/components/examples/MissingJWT'
 *              InvalidRole:
 *                $ref: '#/components/examples/InvalidRole'
 */
