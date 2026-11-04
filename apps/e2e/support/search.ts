import { Page } from '@playwright/test';
import { TEST_IDS } from './test-ids';

/** Looks a product up by barcode from the web home screen. */
export async function searchBarcode(page: Page, barcode: string): Promise<void> {
  await page.goto('/');
  await page.getByTestId(TEST_IDS.searchModeBarcode).click();
  await page.getByTestId(TEST_IDS.searchInput).fill(barcode);
  await page.getByTestId(TEST_IDS.searchSubmit).click();
}

/** Looks a company up by brand name from the web home screen. */
export async function searchBrand(page: Page, brandName: string): Promise<void> {
  await page.goto('/');
  await page.getByTestId(TEST_IDS.searchModeBrand).click();
  await page.getByTestId(TEST_IDS.searchInput).fill(brandName);
  await page.getByTestId(TEST_IDS.searchSubmit).click();
}
