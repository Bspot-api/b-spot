/**
 * How a native request authenticates: the stored session cookie in a
 * `cookie` header, and the app's origin in `expo-origin` (native fetch sends
 * no Origin; the API's `expo()` plugin reads this header instead, and
 * Better-Auth checks it against its trusted origins). `credentials: 'omit'`
 * keeps iOS's own cookie jar out of the way. The web build uses
 * authTransport.web.ts.
 */
import Constants from 'expo-constants';
import { getSessionCookie } from '../features/auth/sessionStore';

export interface AuthRequestInit {
  credentials: RequestCredentials;
  headers: Record<string, string>;
}

/** `bspot-dev` in the dev build (APP_VARIANT=development), `bspot` in production. */
function getAppScheme(): string {
  const scheme = Constants.expoConfig?.scheme;
  const first = Array.isArray(scheme) ? scheme[0] : scheme;
  return first ?? 'bspot';
}

export async function getAuthRequestInit(): Promise<AuthRequestInit> {
  const cookie = await getSessionCookie();
  return {
    credentials: 'omit',
    headers: {
      'expo-origin': `${getAppScheme()}://`,
      ...(cookie ? { cookie } : {}),
    },
  };
}

/** Where the emailed link sends the browser once verified: the app's callback route. */
export function getMagicLinkCallbackURL(): string | undefined {
  return `${getAppScheme()}://auth/callback`;
}
