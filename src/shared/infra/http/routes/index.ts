import express, { Express } from 'express';
import swaggerUi from 'swagger-ui-express';

import swaggerSpec from '@config/swagger';
import uploadConfig from '@config/upload';

import frontEndRoutes, { frontEndFolder } from './frontEnd.routes';
import healthcheckRouter from './healthcheck.routes';
import modulesRoutes from './modules.routes';

function setupRoutes(app: Express): void {
  app.use('/files', express.static(uploadConfig.uploadsFolder));
  app.use(express.static(frontEndFolder));
  app.use('/app*', frontEndRoutes);
  app.use('/', healthcheckRouter);
  app.use('/api', modulesRoutes);
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
}

export default setupRoutes;
