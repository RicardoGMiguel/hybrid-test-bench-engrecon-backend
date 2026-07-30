import { container } from 'tsyringe';

import '../swagger';
import '@shared/container/providers';
import '@modules/users/users.module';
import '@modules/serial/serial.module';
import '@modules/reports/reports.module';
import '@modules/opcua/opcua.module';

import context from '@shared/container/modulesContext';
import { env } from '@config/env';

const isProduction = env.PRODUCTION === 'true';

context.metadata.forEach(module => {
  module.providers?.forEach(({ provideAs, useClass, registerAs = 'singleton' }) => {
    if (registerAs === 'singleton') {
      if (useClass?.production && isProduction) {
        container.registerSingleton(provideAs, useClass?.production);
      } else {
        if (useClass?.development && !isProduction) {
          container.registerSingleton(provideAs, useClass?.development);
        } else {
          container.registerSingleton(provideAs, useClass);
        }
      }
    } else {
      if (useClass?.production && isProduction) {
        const productionInstance = container.resolve(useClass?.production);

        container.registerInstance(provideAs, productionInstance);
      } else {
        if (useClass?.development && !isProduction) {
          const developmentInstance = container.resolve(useClass?.development);

          container.registerInstance(provideAs, developmentInstance);
        } else {
          const defaultInstance = container.resolve(useClass);

          container.registerInstance(provideAs, defaultInstance);
        }
      }
    }
  });
});
