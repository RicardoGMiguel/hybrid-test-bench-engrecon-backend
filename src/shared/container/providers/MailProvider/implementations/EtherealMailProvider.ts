import nodemailer, { Transporter } from 'nodemailer';
import { inject, injectable } from 'tsyringe';

import ISendMailDTO from '@shared/container/providers/MailProvider/dtos/ISendMailDTO';
import IMailTemplateProvider from '@shared/container/providers/MailTemplateProviders/models/IMailTemplateProvider';
import mailConfig from '@config/mail';

import IMailProvider from '../models/IMailProvider';

@injectable()
export default class EtherealMailProvider implements IMailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    // nodemailer.createTestAccount().then(account => {
    //   const transporter = nodemailer.createTransport({
    //     host: account.smtp.host,
    //     port: account.smtp.port,
    //     secure: account.smtp.secure,
    //     auth: {
    //       user: account.user,
    //       pass: account.pass,
    //     },
    //   });
    //   this.client = transporter;
    // });
  }

  public async sendMail({ to, from, subject, templateData }: ISendMailDTO): Promise<void> {
    const { email, name } = mailConfig.defaults.from;
    const html = await this.mailTemplateProvider.parse(templateData);

    this.client.sendMail(
      {
        from: {
          address: from?.email || email,
          name: from?.name || name,
        },
        to: {
          name: to.name,
          address: to.email,
        },
        subject,
        html,
      },
      (err, info) => {
        if (err) console.log('Error when sending test mail:', err);

        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      },
    );
  }
}
