// import { SendRawEmailCommand, SES } from '@aws-sdk/client-ses';
import { Transporter } from 'nodemailer';
import { inject, injectable } from 'tsyringe';

import ISendMailDTO from '@shared/container/providers/MailProvider/dtos/ISendMailDTO';
import IMailTemplateProvider from '@shared/container/providers/MailTemplateProviders/models/IMailTemplateProvider';
import mailConfig from '@config/mail';

import IMailProvider from '../models/IMailProvider';

@injectable()
export default class SESMailProvider implements IMailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    // const ses = new SES({
    //   region: 'us-east-2',
    // });
    // this.client = nodemailer.createTransport({
    //   SES: {
    //     ses,
    //     aws: { SendRawEmailCommand },
    //   },
    // });
  }

  public async sendMail({ to, from, subject, templateData }: ISendMailDTO): Promise<void> {
    const { email, name } = mailConfig.defaults.from;

    await this.client.sendMail({
      from: {
        name: from?.name || name,
        address: from?.email || email,
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await this.mailTemplateProvider.parse(templateData),
    });
  }
}
