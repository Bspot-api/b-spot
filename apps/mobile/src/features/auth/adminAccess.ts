/** What an admin-only screen should do with the current auth state. */
export type AdminAccess = 'pending' | 'login' | 'home' | 'granted';

export interface AdminAuthState {
  isLoading: boolean;
  hasSession: boolean;
  isAdmin: boolean;
}

/** Decides whether an admin screen waits, redirects, or shows its data. */
export function resolveAdminAccess(auth: AdminAuthState): AdminAccess {
  if (auth.isLoading) return 'pending';
  if (!auth.hasSession) return 'login';
  if (!auth.isAdmin) return 'home';
  return 'granted';
}

const LOGIN_ROUTE = '/login';
const HOME_ROUTE = '/';

export type AdminRedirect = typeof LOGIN_ROUTE | typeof HOME_ROUTE | null;

/**
 * Where an admin screen redirects, or null to stay. A visitor who arrives
 * logged out goes to the login screen; someone whose session ended while on
 * the screen (sign-out) goes home, as before this guard existed.
 */
export function resolveAdminRedirect({
  access,
  hadSession,
}: {
  access: AdminAccess;
  hadSession: boolean;
}): AdminRedirect {
  if (access === 'home') return HOME_ROUTE;
  if (access === 'login') return hadSession ? HOME_ROUTE : LOGIN_ROUTE;
  return null;
}
