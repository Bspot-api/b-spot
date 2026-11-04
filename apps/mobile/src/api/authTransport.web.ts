/**
 * Web requests authenticate with the browser's cookie jar. The magic link
 * calls back to the web app's own origin: without a callback, Better-Auth
 * redirects to `/` on the API's origin, which has no page. That origin must
 * be trusted by the API (`CORS_ORIGIN`, see apps/api/.env.example).
 */
import type { AuthRequestInit } from './authTransport';

export function getAuthRequestInit(): Promise<AuthRequestInit> {
  return Promise.resolve({ credentials: 'include', headers: {} });
}

export function getMagicLinkCallbackURL(): string | undefined {
  return `${window.location.origin}/`;
}
