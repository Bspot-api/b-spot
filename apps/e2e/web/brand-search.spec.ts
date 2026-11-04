import { BRAND_SEARCH_NAME, BROVANE_FIXTURE } from '../fixtures-server/catalogue';
import { searchBrand } from '../support/search';
import { TEST_IDS } from '../support/test-ids';
import { expect, test } from '../support/test';

test('searching an unreferenced brand name finds its company and adds the brand', async ({
  page,
}) => {
  await searchBrand(page, BRAND_SEARCH_NAME);

  await expect(page).toHaveURL(new RegExp(`/company/${BROVANE_FIXTURE.siren}`));
  await expect(page.getByTestId(TEST_IDS.companyLegalName)).toHaveText(BROVANE_FIXTURE.legalName);
  await expect(page.getByText('on a ajouté cette marque grâce à ton scan')).toBeVisible();
});

test('a brand name no registry knows asks for a more precise name', async ({ page }) => {
  await searchBrand(page, 'Qwyxzt');

  await expect(page.getByTestId(TEST_IDS.searchError)).toHaveText(
    'Aucune entreprise candidate trouvée pour cette marque',
  );
  await expect(page).toHaveURL(/\/$/);
});
