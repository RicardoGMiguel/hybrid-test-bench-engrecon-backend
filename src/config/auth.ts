import { env } from './env';

export default {
  jwt: {
    secret: env.JWT_SECRET || 'secret@123',
    expiresIn: '1d',
  },
};
