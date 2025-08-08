import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';

import { version } from '../../package.json';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Project name REST API Documentation',
      version,
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    process.env.PRODUCTION?.toLowerCase().trim() === 'true'
      ? path.join(__dirname, '..', '..', 'dist/**/*.js')
      : path.join(__dirname, '..', '..', 'src/**/*.ts'),
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
