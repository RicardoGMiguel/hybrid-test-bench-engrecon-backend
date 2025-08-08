import fs from 'fs';
import handlebars from 'handlebars';

import IMailTemplateProvider from '@shared/container/providers/MailTemplateProviders/models/IMailTemplateProvider';

import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';

class HandlebarsMailProvider implements IMailTemplateProvider {
  public async parse({ file, variables }: IParseMailTemplateDTO): Promise<string> {
    const fileContent = await fs.promises.readFile(file, {
      encoding: 'utf-8',
    });
    const parseTemplate = handlebars.compile(fileContent);

    return parseTemplate(variables);
  }
}

export default HandlebarsMailProvider;
