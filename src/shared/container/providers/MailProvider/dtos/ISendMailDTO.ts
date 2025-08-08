import IparseMailTemplateDTO from '@shared/container/providers/MailTemplateProviders/dtos/IParseMailTemplateDTO';

interface IMailContact {
  name: string;
  email: string;
}

export default interface iSendMailDTO {
  to: IMailContact;
  from?: IMailContact;
  subject: string;
  templateData: IparseMailTemplateDTO;
}
