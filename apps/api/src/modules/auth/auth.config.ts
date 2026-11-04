import { expo } from '@better-auth/expo';
import { betterAuth } from 'better-auth';
import { magicLink } from 'better-auth/plugins';
import { Pool } from 'pg';
import { buildTrustedOrigins, parseAppOrigins } from './trusted-origins';

export interface BetterAuthFactoryOptions {
  secret: string;
  baseURL: string;
  trustedOrigins: string[];
  pool: Pool;
  sendMagicLink?: (data: { email: string; url: string; token: string }) => Promise<void>;
}

export type BetterAuthInstance = ReturnType<typeof betterAuth>;
export type BetterAuthSession = Awaited<ReturnType<BetterAuthInstance['api']['getSession']>>;
export type LoggedInBetterAuthSession = NonNullable<BetterAuthSession>;

export function createBetterAuth(options: BetterAuthFactoryOptions): BetterAuthInstance {
  return betterAuth({
    secret: options.secret,
    baseURL: options.baseURL,
    trustedOrigins: options.trustedOrigins,
    database: options.pool,
    emailAndPassword: {
      enabled: false,
    },
    advanced: {
      database: {
        generateId: false,
      },
      // Better-Auth skips its origin and CSRF checks under NODE_ENV=test by
      // default. Forced on, every environment (e2e included) runs the
      // production rules: a cookie-carrying POST needs a trusted Origin.
      disableOriginCheck: false,
    },
    plugins: [
      magicLink({
        expiresIn: 86400,
        disableSignUp: true,
        sendMagicLink: async (data) => {
          if (!options.sendMagicLink) {
            return;
          }
          await options.sendMagicLink(data);
        },
      }),
      // Native app: a magic link verified in the browser redirects to the
      // trusted app scheme with the session cookie in `?cookie=`, and the
      // app's `expo-origin` header stands in for the Origin native fetch lacks.
      expo(),
    ],
  }) as unknown as BetterAuthInstance;
}

export function buildDatabaseConnectionString(): string {
  const host = process.env.DATABASE_HOST || 'localhost';
  const port = process.env.DATABASE_PORT || '5432';
  const user = encodeURIComponent(process.env.DATABASE_USER || 'postgres');
  const password = encodeURIComponent(process.env.DATABASE_PASSWORD || 'postgres');
  const dbName = process.env.DATABASE_NAME || 'b_spot';
  return `postgresql://${user}:${password}@${host}:${port}/${dbName}`;
}

export function getBetterAuthConfigFromEnv(): {
  secret: string;
  baseURL: string;
  trustedOrigins: string[];
  connectionString: string;
} {
  const secret = process.env.BETTER_AUTH_SECRET;
  const baseURL = process.env.BETTER_AUTH_URL;

  if (!secret) {
    throw new Error('BETTER_AUTH_SECRET is required');
  }
  if (!baseURL) {
    throw new Error('BETTER_AUTH_URL is required');
  }

  const trustedOrigins = buildTrustedOrigins({
    baseURL,
    corsOrigin: process.env.CORS_ORIGIN || '*',
    appOrigins: parseAppOrigins(process.env.AUTH_APP_ORIGINS),
  });

  return {
    secret,
    baseURL,
    trustedOrigins,
    connectionString: buildDatabaseConnectionString(),
  };
}
