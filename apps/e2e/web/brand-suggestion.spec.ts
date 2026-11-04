import { API_URL } from '../env/e2e-env';
import { UNKNOWN_BRAND_PRODUCT } from '../fixtures-server/catalogue';
import { findSuggestionsByNotes } from '../support/db';
import { searchBarcode } from '../support/search';
import { TEST_IDS } from '../support/test-ids';
import { expect, test } from '../support/test';

test('a product with an unknown brand leads to a submitted brand suggestion', async ({ page }) => {
  await searchBarcode(page, UNKNOWN_BRAND_PRODUCT.barcode);

  await expect(page).toHaveURL(/\/brand-suggestion\/new/);
  await expect(page.getByTestId(TEST_IDS.suggestionBrandInput)).toHaveValue(
    UNKNOWN_BRAND_PRODUCT.brand,
  );
  const notes = `Vu en rayon biscuits ${Date.now()}`;
  await page.getByTestId(TEST_IDS.suggestionNotesInput).fill(notes);

  const created = page.waitForResponse(
    (response) =>
      response.url() === `${API_URL}/api/brand-suggestions` &&
      response.request().method() === 'POST',
  );
  await page.getByTestId(TEST_IDS.suggestionSubmit).click();
  expect((await created).status()).toBe(201);

  // Web shows no confirmation (Alert.alert is a no-op there): check what was stored.
  expect(await findSuggestionsByNotes(notes)).toEqual([
    { brandName: UNKNOWN_BRAND_PRODUCT.brand, barcode: UNKNOWN_BRAND_PRODUCT.barcode, notes },
  ]);
});
