/**
 * Preloaded into the API process under test (NODE_OPTIONS --import), never
 * shipped: any fetch to one of the four real external APIs fails loudly, so a
 * leaking base URL turns into a failed journey.
 */
import { EXTERNAL_API_HOSTS } from './e2e-env';

const realFetch = globalThis.fetch;

function hostOf(input: Parameters<typeof fetch>[0]): string {
  if (typeof input === 'string') return new URL(input).hostname;
  if (input instanceof URL) return input.hostname;
  return new URL(input.url).hostname;
}

globalThis.fetch = (input, init) => {
  const host = hostOf(input);
  if (EXTERNAL_API_HOSTS.includes(host)) {
    console.error(`[e2e-guard] BLOCKED outbound call to ${host}`);
    return Promise.reject(new Error(`[e2e-guard] outbound call to ${host} is blocked`));
  }
  return realFetch(input, init);
};
