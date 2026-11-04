import {
  FERRERO_FIXTURE,
  KNOWN_COSMETIC,
  KNOWN_FOOD,
  OMBRELIS_FIXTURE,
} from '../fixtures-server/catalogue';
import { searchBarcode } from '../support/search';
import { PRODUCT_SOURCE_LABELS } from '../support/product-source-labels';
import { TEST_IDS } from '../support/test-ids';
import { expect, test } from '../support/test';

test('the history lists the product just looked up and leads back to its company', async ({
  page,
}) => {
  await page.goto('/history');
  await expect(page.getByTestId(TEST_IDS.historyEmpty)).toBeVisible();

  await searchBarcode(page, KNOWN_FOOD.barcode);
  await expect(page).toHaveURL(new RegExp(`/company/${FERRERO_FIXTURE.siren}`));

  // The web navbar has no history entry: the screen is reached by its URL.
  await page.goto('/history');
  const item = page.getByTestId(TEST_IDS.historyItem);
  await expect(item).toHaveCount(1);
  await expect(item).toHaveAccessibleName(`${KNOWN_FOOD.name} — ${FERRERO_FIXTURE.legalName}`);

  await item.click();
  await expect(page).toHaveURL(new RegExp(`/company/${FERRERO_FIXTURE.siren}`));
  await expect(page.getByTestId(TEST_IDS.companyLegalName)).toHaveText(FERRERO_FIXTURE.legalName);
});

test('a cosmetic reopened from the history keeps its cosmetic label', async ({ page }) => {
  await searchBarcode(page, KNOWN_COSMETIC.barcode);
  await expect(page).toHaveURL(new RegExp(`/company/${OMBRELIS_FIXTURE.siren}`));

  await page.goto('/history');
  await page.getByTestId(TEST_IDS.historyItem).click();

  await expect(page).toHaveURL(new RegExp(`/company/${OMBRELIS_FIXTURE.siren}`));
  await expect(page.getByTestId(TEST_IDS.companyProductSource)).toHaveText(
    PRODUCT_SOURCE_LABELS.cosmetic,
  );
});
