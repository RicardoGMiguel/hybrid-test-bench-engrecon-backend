import EtherealMailProvider from '@shared/container/providers/MailProvider/implementations/EtherealMailProvider';
import SESMailProvider from '@shared/container/providers/MailProvider/implementations/SESMailProvider';
import HandleBarsMailTemplateProvider from '@shared/container/providers/MailTemplateProviders/implementations/HandleBarsMailTemplateProvider';
import DiskStorageProvider from '@shared/container/providers/StorageProvider/implementations/DiskStorageProvider';
import S3StorageProvider from '@shared/container/providers/StorageProvider/implementations/S3StorageProvider';
import Module from '@shared/decorators/Module';

@Module({
  name: 'ContainerProviders',
  providers: [
    {
      provideAs: 'StorageProvider',
      useClass: {
        development: DiskStorageProvider,
        production: S3StorageProvider,
      },
    },
    { provideAs: 'MailTemplateProvider', useClass: HandleBarsMailTemplateProvider },
    {
      provideAs: 'MailProvider',
      useClass: {
        development: EtherealMailProvider,
        production: SESMailProvider,
      },
      registerAs: 'instance',
    },
  ],
})
export default class Providers {}
