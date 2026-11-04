import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { describeApiUrlMismatch, findBundledApiUrls } from './bundle-api-url';

const E2E_API_URL = 'http://localhost:3101';

/** Excerpts copied from a served dev bundle (Expo 54). */
const PRELUDE =
  '/* HMR env vars from Expo CLI (dev-only) */ process.env=Object.defineProperties(process.env, ' +
  '{"EXPO_PUBLIC_API_URL": { enumerable: true, value: "http://localhost:3101" },' +
  '"EXPO_PUBLIC_APP_ENV": { enumerable: true, value: "e2e" }});';
const DOTENV_MODULE = `  var _default = {
    "EXPO_PUBLIC_API_URL": "http://localhost:3001"
  };
},1545,[],".env");`;
const CLIENT_FALLBACK =
  "var API_URL = (_process$env$EXPO_PUB = _expoVirtualEnv.env.EXPO_PUBLIC_API_URL) != null ? _process$env$EXPO_PUB : 'http://localhost:3001';";

describe('findBundledApiUrls', () => {
  it('reads the value of the Expo CLI prelude', () => {
    assert.deepEqual(findBundledApiUrls(`${PRELUDE}\n${CLIENT_FALLBACK}`), [E2E_API_URL]);
  });

  it('also reads the value of a bundled .env module', () => {
    assert.deepEqual(findBundledApiUrls(`${PRELUDE}\n${DOTENV_MODULE}`), [
      E2E_API_URL,
      'http://localhost:3001',
    ]);
  });

  it('finds nothing in a bundle without the variable', () => {
    assert.deepEqual(findBundledApiUrls(CLIENT_FALLBACK), []);
  });
});

describe('describeApiUrlMismatch', () => {
  it('accepts a bundle carrying only the e2e URL', () => {
    assert.equal(describeApiUrlMismatch([E2E_API_URL], E2E_API_URL), null);
  });

  it('names the other URL and the .env cause', () => {
    const message = describeApiUrlMismatch([E2E_API_URL, 'http://localhost:3001'], E2E_API_URL);
    assert.match(message ?? '', /http:\/\/localhost:3001/);
    assert.match(message ?? '', /apps\/mobile\/\.env/);
  });

  it('says the bundle format changed when no URL is found', () => {
    assert.match(describeApiUrlMismatch([], E2E_API_URL) ?? '', /format/);
  });
});
