import { Router } from 'express';

import { IModuleMetadata } from '@shared/types/IModuleMetadata';

class ModulesContext {
  public metadata: IModuleMetadata[] = [];

  public getRoutes(): Router[] {
    const routes = this.metadata.map(module => module.router);

    const filteredRoutes = routes.filter(route => route !== undefined) as Router[];

    return filteredRoutes;
  }
}

const context = new ModulesContext();

export default context;
