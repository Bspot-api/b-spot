import { expect, test } from '@playwright/test';
import { API_URL, E2E_DATABASE_NAME, FIXTURES_URL } from '../env/e2e-env';
import { readCurrentDatabaseName } from '../support/db';
import {
  BRAND_SEARCH_NAME,
  BROVANE_FIXTURE,
  KNOWN_COSMETIC,
  KNOWN_FOOD,
  MISSING_PRODUCT_BARCODE,
} from '../fixtures-server/catalogue';

test('fixtures — Open Food Facts: found, then the real 404 not-found answer', async ({
  request,
}) => {
  const found = await request.get(`${FIXTURES_URL}/off/api/v2/product/${KNOWN_FOOD.barcode}`);
  expect(found.status()).toBe(200);
  expect(await found.json()).toMatchObject({ status: 1, product: { brands: KNOWN_FOOD.brand } });

  const missing = await request.get(
    `${FIXTURES_URL}/off/api/v2/product/${MISSING_PRODUCT_BARCODE}`,
  );
  expect(missing.status()).toBe(404);
  expect(await missing.json()).toMatchObject({ status: 0, status_verbose: 'product not found' });
});

test('fixtures — Open Beauty Facts knows the cosmetic', async ({ request }) => {
  const found = await request.get(`${FIXTURES_URL}/obf/api/v2/product/${KNOWN_COSMETIC.barcode}`);
  expect(await found.json()).toMatchObject({ status: 1 });
});

test('fixtures — recherche-entreprises: a hit, then an empty result page', async ({ request }) => {
  const hit = await request.get(`${FIXTURES_URL}/recherche-entreprises/search`, {
    params: { q: BRAND_SEARCH_NAME, per_page: '5', page: '1' },
  });
  expect(await hit.json()).toMatchObject({ results: [{ siren: BROVANE_FIXTURE.siren }] });

  const none = await request.get(`${FIXTURES_URL}/recherche-entreprises/search`, {
    params: { q: 'nothing-here' },
  });
  expect(await none.json()).toMatchObject({ results: [], total_results: 0 });
});

test('fixtures — Pappers: found, unknown SIREN 404, missing token 401', async ({ request }) => {
  const url = `${FIXTURES_URL}/pappers/v2/entreprise`;
  const found = await request.get(url, {
    params: { siren: BROVANE_FIXTURE.siren, api_token: 't' },
  });
  expect(await found.json()).toMatchObject({ denomination: BROVANE_FIXTURE.legalName });
  const unknown = await request.get(url, { params: { siren: '000000000', api_token: 't' } });
  expect(unknown.status()).toBe(404);
  const noToken = await request.get(url, { params: { siren: BROVANE_FIXTURE.siren } });
  expect(noToken.status()).toBe(401);
});

test('the API under test answers and the suite talks to the e2e database', async ({ request }) => {
  const health = await request.get(`${API_URL}/health`);
  expect(health.ok()).toBe(true);
  expect(await readCurrentDatabaseName()).toBe(E2E_DATABASE_NAME);
});
