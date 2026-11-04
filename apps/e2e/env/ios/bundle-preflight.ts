import { API_URL, METRO_URL } from '../e2e-env';
import { describeApiUrlMismatch, findBundledApiUrls } from './bundle-api-url';

/** The headers the iOS dev client sends to read Metro's manifest. */
const MANIFEST_HEADERS = {
  'expo-platform': 'ios',
  accept: 'application/expo+json,application/json',
};

/** `launchAsset.url` of a manifest answer, or `null` when it has none. */
function extractLaunchAssetUrl(manifest: unknown): string | null {
  if (typeof manifest !== 'object' || manifest === null) return null;
  const launchAsset: unknown = (manifest as { launchAsset?: unknown }).launchAsset;
  if (typeof launchAsset !== 'object' || launchAsset === null) return null;
  const url: unknown = (launchAsset as { url?: unknown }).url;
  return typeof url === 'string' && url.length > 0 ? url : null;
}

/** The bundle URL the dev build loads, as Metro's manifest gives it. */
async function readLaunchBundleUrl(): Promise<string> {
  const response = await fetch(METRO_URL, { headers: MANIFEST_HEADERS });
  if (!response.ok) throw new Error(`[e2e] Metro manifest answered ${response.status}`);
  const url = extractLaunchAssetUrl(await response.json());
  if (!url) throw new Error('[e2e] Metro manifest has no launchAsset.url');
  return url;
}

/** Same bundle, served as JS text rather than Hermes bytecode, so it can be read. */
function stripBytecodeParam(launchUrl: string): string {
  const url = new URL(launchUrl);
  url.searchParams.delete('transform.bytecode');
  return url.toString();
}

/**
 * Fails the run before any flow when the bundle the dev build loads carries
 * another API URL than the e2e one. Also warms the bundle for the first flow.
 */
export async function assertBundleUsesApiUrl(): Promise<void> {
  const bundleUrl = stripBytecodeParam(await readLaunchBundleUrl());
  const response = await fetch(bundleUrl);
  if (!response.ok) throw new Error(`[e2e] iOS bundle answered ${response.status}: ${bundleUrl}`);
  const mismatch = describeApiUrlMismatch(findBundledApiUrls(await response.text()), API_URL);
  if (mismatch) throw new Error(mismatch);
  console.log(`[e2e] iOS bundle uses EXPO_PUBLIC_API_URL=${API_URL}`);
}
