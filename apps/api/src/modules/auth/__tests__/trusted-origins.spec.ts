import { DEFAULT_APP_ORIGINS, buildTrustedOrigins, parseAppOrigins } from '../trusted-origins';

describe('parseAppOrigins', () => {
  it('defaults to the production app scheme when unset or blank', () => {
    expect(parseAppOrigins(undefined)).toEqual([...DEFAULT_APP_ORIGINS]);
    expect(parseAppOrigins('  ')).toEqual(['bspot://']);
  });

  it('parses a comma-separated list and trims each entry', () => {
    expect(parseAppOrigins(' bspot:// , bspot-dev://,')).toEqual(['bspot://', 'bspot-dev://']);
  });
});

describe('buildTrustedOrigins', () => {
  const baseURL = 'https://api.example.test';

  it('trusts the base URL and the app origins when CORS is open', () => {
    expect(buildTrustedOrigins({ baseURL, corsOrigin: '*', appOrigins: ['bspot://'] })).toEqual([
      baseURL,
      'bspot://',
    ]);
  });

  it('keeps the CORS origins and adds the app origins', () => {
    expect(
      buildTrustedOrigins({
        baseURL,
        corsOrigin: 'https://web.example.test,https://admin.example.test',
        appOrigins: ['bspot://', 'bspot-dev://'],
      }),
    ).toEqual([
      baseURL,
      'https://web.example.test',
      'https://admin.example.test',
      'bspot://',
      'bspot-dev://',
    ]);
  });
});
