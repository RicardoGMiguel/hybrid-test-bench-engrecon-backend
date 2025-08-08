import path from 'path';
import { Request, Response, Router } from 'express';

export const frontEndFolder = path.join(`${process.cwd()}/frontEnd`);
const frontEndFile = path.join(`${process.cwd()}/frontEnd/index.html`);

const frontEndRoutes = Router();

frontEndRoutes.get('/', (req: Request, res: Response): void => {
  res.sendFile(frontEndFile);
});

export default frontEndRoutes;
