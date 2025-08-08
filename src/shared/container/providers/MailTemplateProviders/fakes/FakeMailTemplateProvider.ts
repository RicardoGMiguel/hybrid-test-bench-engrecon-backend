import IMailTemplateProvider from '@shared/container/providers/MailTemplateProviders/models/IMailTemplateProvider';

class FakeMailTemplateProvider implements IMailTemplateProvider {
  public async parse(): Promise<string> {
    return 'mail Content';
  }
}

export default FakeMailTemplateProvider;
