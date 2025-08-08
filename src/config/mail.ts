import { env } from './env';

interface IMailConfig {
  driver: 'ethereal' | 'ses';
  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: env.MAIL_PROVIDER || 'ethereal',
  defaults: {
    from: {
      email: env.EMAIL_FROM,
      name: env.EMAIL_NAME,
    },
  },
} as IMailConfig;
