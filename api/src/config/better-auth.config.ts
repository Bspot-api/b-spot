import { BetterAuthOptions } from 'better-auth';
import { mikroOrmAdapter } from 'better-auth-mikro-orm';

export const betterAuthConfig: BetterAuthOptions = {
  database: mikroOrmAdapter,
  secret:
    process.env.BETTER_AUTH_SECRET ||
    process.env.JWT_SECRET ||
    'your-secret-key',
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3001',
  basePath: process.env.BETTER_AUTH_BASE_PATH || '/api/auth',
};
