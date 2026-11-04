/**
 * The native app's view of the Better-Auth session cookie. The API's
 * `expo()` plugin hands the cookie to the app in the magic link's redirect
 * (`<scheme>://auth/callback?cookie=<Set-Cookie value>`); the app keeps only
 * `name=value` and sends it back in a `cookie` header.
 */

/** `better-auth.session_token`, or `__Secure-better-auth.session_token` over https. */
const SESSION_COOKIE_NAME = /^(?:__Secure-)?[\w.-]*session_token$/;
/** Splits a Set-Cookie value holding several cookies, without splitting `Expires` dates. */
const COOKIE_SEPARATOR = /,\s*(?=[^;,=\s]+=)/;
const MAX_AGE = /^max-age=(-?\d+)$/i;

function isDeleted(attributes: string[]): boolean {
  return attributes.some((attribute) => {
    const match = MAX_AGE.exec(attribute.trim());
    return match !== null && Number(match[1]) <= 0;
  });
}

/** `name=value` of the session cookie in a Set-Cookie value; null when absent, empty or deleted. */
export function extractSessionCookie(setCookie: string): string | null {
  for (const cookie of setCookie.split(COOKIE_SEPARATOR)) {
    const [pair, ...attributes] = cookie.split(';');
    const separator = pair.indexOf('=');
    if (separator <= 0) continue;
    const name = pair.slice(0, separator).trim();
    const value = pair.slice(separator + 1).trim();
    if (!SESSION_COOKIE_NAME.test(name)) continue;
    return value && !isDeleted(attributes) ? `${name}=${value}` : null;
  }
  return null;
}

export type AuthCallback =
  | { kind: 'session'; cookie: string }
  | { kind: 'error'; code: string }
  | { kind: 'invalid' };

type SearchParam = string | string[] | undefined;

export interface AuthCallbackParams {
  cookie?: SearchParam;
  error?: SearchParam;
}

function firstValue(param: SearchParam): string | undefined {
  return Array.isArray(param) ? param[0] : param;
}

/** What the `auth/callback` deep link carries: a session, Better-Auth's error code, or nothing usable. */
export function readAuthCallback(params: AuthCallbackParams): AuthCallback {
  const error = firstValue(params.error);
  if (error) return { kind: 'error', code: error };
  const cookie = extractSessionCookie(firstValue(params.cookie) ?? '');
  return cookie ? { kind: 'session', cookie } : { kind: 'invalid' };
}
