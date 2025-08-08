/* eslint-disable */
import { z } from 'zod';

import { StorageProvider } from '@shared/container/providers/StorageProvider/types/StorageProvider';
import { ORM } from '@shared/types/ORM';
import { MailProvider } from '@shared/container/providers/MailProvider/types/MailProvider';

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
const envVars = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  PORT: z.string().optional(),
  PRODUCTION: z.string().default('false'),
  ORM: z.nativeEnum(ORM),
  STORAGE_PROVIDER: z.nativeEnum(StorageProvider),
  JWT_SECRET: z.string(),
  DB_URL: z.string().url(),
  DOCS_AUTH_USER: z.string().optional(),
  DOCS_AUTH_PASSWORD: z.string().optional(),
  MAIL_PROVIDER: z.nativeEnum(MailProvider).optional(),
  EMAIL_FROM: z.string().default('no-reply@<empresa>.com.br'),
  EMAIL_NAME: z.string().default('Equipe <empresa>'),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_SESSION_TOKEN: z.string().optional(),
  FRONTEND_URL: z.string().url(),
});

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVars> {}
  }
}

let env: z.infer<typeof envVars> = process.env;

if (!!process.env.SKIP_ENV_VALIDATION == false) {
  const parsed = envVars.safeParse(env);

  if (parsed.success === false) {
    console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
    throw new Error(`Invalid environment variables: ${JSON.stringify(parsed.error.flatten().fieldErrors)}`);
  }

  env = parsed.data;
}

export { env };
