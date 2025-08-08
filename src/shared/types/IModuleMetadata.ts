import { Router } from 'express';

import { Provider } from './Provider.type';

export interface IModuleMetadata {
  name?: string;
  router?: Router;
  providers?: Array<Provider>;
}
