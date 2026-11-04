import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { describeApiUrlMismatch, findBundledApiUrls } from './bundle-api-url';

const E2E_API_URL = 'http://localhost:3101';
const LOCAL_API_URL = 'http://localhost:3001';

/** Excerpts copied from a served dev bundle (Expo 54). */
const inputPrelude =
  '/* HMR env vars from Expo CLI (dev-only) */ process.env=Object.defineProperties(process.env, ' +
  '{"EXPO_PUBLIC_API_URL": { enumerable: true, value: "http://localhost:3101" },' +
  '"EXPO_PUBLIC_APP_ENV": { enumerable: true, value: "e2e" }});';
const inputDotEnvModule = `  var _default = {
    "EXPO_PUBLIC_API_URL": "http://localhost:3001"
  };
},1545,[],".env");`;
const inputClientFallback =
  "var API_URL = (_process$env$EXPO_PUB = _expoVirtualEnv.env.EXPO_PUBLIC_API_URL) != null ? _process$env$EXPO_PUB : 'http://localhost:3001';";

describe('findBundledApiUrls', () => {
  it('reads the value of the Expo CLI prelude', () => {
    const inputBundle = `${inputPrelude}\n${inputClientFallback}`;

    const actualUrls = findBundledApiUrls(inputBundle);

    assert.deepEqual(actualUrls, [E2E_API_URL]);
  });

  it('also reads the value of a bundled .env module', () => {
    const inputBundle = `${inputPrelude}\n${inputDotEnvModule}`;

    const actualUrls = findBundledApiUrls(inputBundle);

    assert.deepEqual(actualUrls, [E2E_API_URL, LOCAL_API_URL]);
  });

  it('finds nothing in a bundle without the variable', () => {
    const actualUrls = findBundledApiUrls(inputClientFallback);

    assert.deepEqual(actualUrls, []);
  });
});

describe('describeApiUrlMismatch', () => {
  it('accepts a bundle carrying only the e2e URL', () => {
    const actualMessage = describeApiUrlMismatch([E2E_API_URL], E2E_API_URL);

    assert.equal(actualMessage, null);
  });

  it('names the other URL and the .env cause', () => {
    const inputUrls = [E2E_API_URL, LOCAL_API_URL];

    const actualMessage = describeApiUrlMismatch(inputUrls, E2E_API_URL) ?? '';

    assert.match(actualMessage, /http:\/\/localhost:3001/);
    assert.match(actualMessage, /apps\/mobile\/\.env/);
  });

  it('says the bundle format changed when no URL is found', () => {
    const actualMessage = describeApiUrlMismatch([], E2E_API_URL) ?? '';

    assert.match(actualMessage, /format/);
  });
});
