import { betterAuth } from 'better-auth';
import { mikroOrmAdapter } from 'better-auth-mikro-orm';
import { MikroORM } from '@mikro-orm/core';

let authInstance: ReturnType<typeof betterAuth>;

export const createBetterAuthInstance = (orm: MikroORM) => {
  if (!authInstance) {
    authInstance = betterAuth({
      database: mikroOrmAdapter(orm),
      secret: process.env.BETTER_AUTH_SECRET || process.env.JWT_SECRET,
      session: {
        expiresIn: 60 * 60 * 24 * 7,
        updateAge: 60 * 60 * 24,
        cookieCache: {
          enabled: true,
          maxAge: 5 * 60,
        },
      },
      emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
      },
      user: {
        additionalFields: {
          avatar: {
            type: 'string',
            required: false,
          },
        },
      },
      trustedOrigins: [
        process.env.FRONTEND_URL || 'http://localhost:5173',
        process.env.BETTER_AUTH_URL || 'http://localhost:3001',
      ],
    });
  }
  return authInstance;
};

export const getBetterAuthInstance = () => {
  if (!authInstance) {
    throw new Error('Better Auth instance not initialized. Call createBetterAuthInstance first.');
  }
  return authInstance;
};
