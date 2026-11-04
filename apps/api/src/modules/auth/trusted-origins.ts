/**
 * The origins Better-Auth trusts: the API itself, the web origins allowed by
 * CORS, and the native app's custom schemes. A trusted app scheme is where a
 * magic link may redirect with the session cookie (see the `expo()` plugin in
 * auth.config.ts), so production trusts only `bspot://` unless
 * `AUTH_APP_ORIGINS` says otherwise (dev and e2e add `bspot-dev://`).
 */
export const DEFAULT_APP_ORIGINS: readonly string[] = ['bspot://'];

/** Parses `AUTH_APP_ORIGINS` ("a://,b://"); unset or blank gives the default. */
export function parseAppOrigins(raw: string | undefined): string[] {
  const origins = (raw ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
  return origins.length > 0 ? origins : [...DEFAULT_APP_ORIGINS];
}

export interface TrustedOriginsInput {
  baseURL: string;
  /** `CORS_ORIGIN`: `*` or a comma-separated list of web origins. */
  corsOrigin: string;
  appOrigins: readonly string[];
}

/** Base URL, then the CORS web origins (none when CORS is `*`), then the app origins. */
export function buildTrustedOrigins(input: TrustedOriginsInput): string[] {
  const webOrigins = input.corsOrigin === '*' ? [] : input.corsOrigin.split(',');
  return [input.baseURL, ...webOrigins, ...input.appOrigins];
}
