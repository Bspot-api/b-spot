import type { LoggedInBetterAuthSession } from './auth.config';

export interface AuthenticatedRequest {
  headers: Record<string, string | string[] | undefined>;
  session?: LoggedInBetterAuthSession | null;
  admin?: import('./admin.entity').Admin;
}
