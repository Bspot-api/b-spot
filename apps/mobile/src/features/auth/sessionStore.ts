/**
 * Native session storage: the Better-Auth session cookie (`name=value`) in
 * the Keychain through expo-secure-store, never in AsyncStorage. Read once,
 * then served from memory. The web build uses sessionStore.web.ts instead.
 */
import * as SecureStore from 'expo-secure-store';

const SESSION_COOKIE_KEY = 'bspot.session_cookie';

let cached: Promise<string | null> | null = null;

/** The stored session cookie, or null when logged out. A failed read is retried next time. */
export function getSessionCookie(): Promise<string | null> {
  cached ??= SecureStore.getItemAsync(SESSION_COOKIE_KEY).catch((error: unknown) => {
    console.warn('[auth] could not read the stored session', error);
    cached = null;
    return null;
  });
  return cached;
}

/** Keeps the session cookie the auth callback received. */
export async function saveSessionCookie(cookie: string): Promise<void> {
  cached = Promise.resolve(cookie);
  await SecureStore.setItemAsync(SESSION_COOKIE_KEY, cookie);
}

/** Forgets the session (sign-out). */
export async function clearSessionCookie(): Promise<void> {
  cached = Promise.resolve(null);
  await SecureStore.deleteItemAsync(SESSION_COOKIE_KEY);
}
