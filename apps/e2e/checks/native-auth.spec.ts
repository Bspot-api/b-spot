import { expect, test } from '@playwright/test';
import { DEV_SCHEME, E2E_USERS } from '../env/e2e-env';
import { resetMutableState } from '../support/db';
import { fetchLatestMagicLink } from '../support/maildev';
import { sendNativeRequest } from '../support/native-client';

const APP_ORIGIN = `${DEV_SCHEME}://`;
const CALLBACK_URL = `${APP_ORIGIN}auth/callback`;
const EMAIL = E2E_USERS.nativeCheck;

/** Requests a magic link as the native app does and returns the emailed link. */
async function requestNativeMagicLink(): Promise<string> {
  const since = new Date(Date.now() - 1000);
  const response = await sendNativeRequest({
    method: 'POST',
    path: '/api/auth/sign-in/magic-link',
    body: { email: EMAIL, callbackURL: CALLBACK_URL },
  });
  expect(response.status, response.body).toBe(200);
  return fetchLatestMagicLink({ email: EMAIL, since });
}

/** Opens the link like a browser would, and returns the app redirect it answers. */
async function verifyLink(link: string): Promise<URL> {
  const response = await sendNativeRequest({ method: 'GET', path: link });
  expect(response.status, response.body).toBe(302);
  expect(response.location ?? '').toMatch(new RegExp(`^${CALLBACK_URL}\\?cookie=`));
  return new URL(response.location ?? '');
}

/** The session cookie, `name=value`, the app keeps from the redirect's `cookie` param. */
function readSessionCookie(redirect: URL): string {
  const setCookie = redirect.searchParams.get('cookie') ?? '';
  return setCookie.split(';')[0];
}

async function readSessionEmail(cookie: string): Promise<string | null> {
  const response = await sendNativeRequest({
    method: 'GET',
    path: '/api/auth/get-session',
    headers: { cookie },
  });
  expect(response.status).toBe(200);
  const session = JSON.parse(response.body) as { user: { email: string } } | null;
  return session?.user.email ?? null;
}

test('native auth — the magic link hands the session to the app, sign-out needs the app origin', async () => {
  await resetMutableState();
  const cookie = readSessionCookie(await verifyLink(await requestNativeMagicLink()));
  expect(await readSessionEmail(cookie)).toBe(EMAIL);

  const signOut = (headers: Record<string, string>) =>
    sendNativeRequest({ method: 'POST', path: '/api/auth/sign-out', headers, body: {} });

  const withoutOrigin = await signOut({ cookie });
  expect(withoutOrigin.status, 'origin checks are enforced').toBe(403);
  const foreignOrigin = await signOut({ cookie, 'expo-origin': 'evil://' });
  expect(foreignOrigin.status).toBe(403);

  const fromApp = await signOut({ cookie, 'expo-origin': APP_ORIGIN });
  expect(fromApp.status, fromApp.body).toBe(200);
  expect(await readSessionEmail(cookie)).toBeNull();
});

test('native auth — a callback outside the trusted origins is refused', async () => {
  const response = await sendNativeRequest({
    method: 'POST',
    path: '/api/auth/sign-in/magic-link',
    body: { email: EMAIL, callbackURL: 'evil://steal' },
  });
  expect(response.status).toBe(403);
});
