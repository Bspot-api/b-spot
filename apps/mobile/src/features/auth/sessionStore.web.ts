/**
 * Web session storage: none. The browser's cookie jar keeps the session
 * (`credentials: 'include'`), as before the native callback existed.
 */

export function getSessionCookie(): Promise<string | null> {
  return Promise.resolve(null);
}

export function saveSessionCookie(_cookie: string): Promise<void> {
  return Promise.resolve();
}

export function clearSessionCookie(): Promise<void> {
  return Promise.resolve();
}
