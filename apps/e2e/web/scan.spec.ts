import {
  FERRERO_FIXTURE,
  KNOWN_COSMETIC,
  KNOWN_FOOD,
  MISSING_PRODUCT_BARCODE,
  OMBRELIS_FIXTURE,
} from '../fixtures-server/catalogue';
import { searchBarcode } from '../support/search';
import { PRODUCT_SOURCE_LABELS } from '../support/product-source-labels';
import { TEST_IDS } from '../support/test-ids';
import { expect, test } from '../support/test';

test('scanning a known food product shows its owner, executives and shareholders', async ({
  page,
}) => {
  await searchBarcode(page, KNOWN_FOOD.barcode);

  await expect(page).toHaveURL(new RegExp(`/company/${FERRERO_FIXTURE.siren}`));
  await expect(page.getByTestId(TEST_IDS.companyLegalName)).toHaveText(FERRERO_FIXTURE.legalName);
  await expect(page.getByTestId(TEST_IDS.companySiren)).toHaveText(
    `SIREN ${FERRERO_FIXTURE.siren}`,
  );
  await expect(page.getByTestId(TEST_IDS.executiveItem)).toHaveCount(2);
  await expect(page.getByTestId(TEST_IDS.executiveItem).first()).toContainText('Camille Fixture');
  await expect(page.getByTestId(TEST_IDS.shareholderItem)).toHaveCount(1);
  await expect(page.getByTestId(TEST_IDS.shareholderItem)).toContainText('Holding Fixture');
  await expect(page.getByTestId(TEST_IDS.companyProductSource)).toHaveText(
    PRODUCT_SOURCE_LABELS.food,
  );
});

test('scanning a known cosmetic falls back to Open Beauty Facts', async ({ page }) => {
  await searchBarcode(page, KNOWN_COSMETIC.barcode);

  await expect(page).toHaveURL(new RegExp(`/company/${OMBRELIS_FIXTURE.siren}`));
  await expect(page.getByTestId(TEST_IDS.companyLegalName)).toHaveText(OMBRELIS_FIXTURE.legalName);
  await expect(page.getByTestId(TEST_IDS.executiveItem)).toContainText('Sacha Fixture');
});

test('a cosmetic is labelled as a cosmetic product on its company page', async ({ page }) => {
  await searchBarcode(page, KNOWN_COSMETIC.barcode);

  await expect(page).toHaveURL(new RegExp(`/company/${OMBRELIS_FIXTURE.siren}`));
  await expect(page.getByTestId(TEST_IDS.companyProductSource)).toHaveText(
    PRODUCT_SOURCE_LABELS.cosmetic,
  );
});

test('a barcode no source knows says the product was not found', async ({ page }) => {
  await searchBarcode(page, MISSING_PRODUCT_BARCODE);

  await expect(page.getByTestId(TEST_IDS.searchError)).toHaveText(
    'Produit introuvable dans notre base de données.',
  );
  await expect(page).toHaveURL(/\/$/);
});
