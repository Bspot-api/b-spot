import { IGNORE_DOTENV_FILES_VARIABLE } from '../e2e-env';

/**
 * Reads which `EXPO_PUBLIC_API_URL` a served Expo dev bundle carries. Two
 * forms exist in an Expo 54 dev bundle:
 * - the "HMR env vars from Expo CLI" prelude, from Metro's process env:
 *   `"EXPO_PUBLIC_API_URL": { enumerable: true, value: "…" }`;
 * - a bundled `apps/mobile/.env*` module, whose values win at runtime:
 *   `"EXPO_PUBLIC_API_URL": "…"`.
 */
const API_URL_VALUE =
  /"EXPO_PUBLIC_API_URL":\s*(?:\{\s*enumerable:\s*true,\s*value:\s*)?"([^"]*)"/g;

/** Every literal value the bundle gives to `EXPO_PUBLIC_API_URL`, in order. */
export function findBundledApiUrls(bundle: string): string[] {
  return Array.from(bundle.matchAll(API_URL_VALUE), (match) => match[1]);
}

/** `null` when the bundle carries the expected URL and no other; else the failure message. */
export function describeApiUrlMismatch(urls: readonly string[], expected: string): string | null {
  if (urls.length === 0) {
    return (
      `[e2e] the iOS bundle carries no EXPO_PUBLIC_API_URL value: Expo's dev bundle format ` +
      `changed, update apps/e2e/env/ios/bundle-api-url.ts.`
    );
  }
  const others = Array.from(new Set(urls.filter((url) => url !== expected)));
  if (others.length === 0) return null;
  return (
    `[e2e] the iOS bundle carries EXPO_PUBLIC_API_URL=${others.join(', ')}, not ${expected}. ` +
    `Expo bundles apps/mobile/.env* in development and its values win; the e2e Metro must ` +
    `hide them (${IGNORE_DOTENV_FILES_VARIABLE} in apps/mobile/metro.config.js).`
  );
}
