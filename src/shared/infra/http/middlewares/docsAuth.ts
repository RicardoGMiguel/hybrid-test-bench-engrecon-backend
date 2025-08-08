import expressBasicAuth from 'express-basic-auth';

const docsAuthUser = process.env.DOCS_AUTH_USER || 'admin';
const docsAuthPassword = process.env.DOCS_AUTH_PASSWORD || 'admin';

export const docsAuthMiddleware = expressBasicAuth({
  users: { [docsAuthUser]: docsAuthPassword },
  challenge: true,
});
