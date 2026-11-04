/**
 * Web requests authenticate with the browser's cookie jar, and the magic
 * link keeps its default callback: web login is unchanged.
 */
import type { AuthRequestInit } from './authTransport';

export function getAuthRequestInit(): Promise<AuthRequestInit> {
  return Promise.resolve({ credentials: 'include', headers: {} });
}

export function getMagicLinkCallbackURL(): string | undefined {
  return undefined;
}
