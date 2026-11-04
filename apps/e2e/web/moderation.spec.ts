import { Locator, Page } from '@playwright/test';
import { API_URL, E2E_USERS } from '../env/e2e-env';
import { loginAs } from '../support/login';
import { TEST_IDS } from '../support/test-ids';
import { expect, test } from '../support/test';

const TO_APPROVE = 'Approve Fixture';
const TO_EDIT = 'Edit Fixture';
const EDITED = 'Edited Fixture';
const TO_REJECT = 'Reject Fixture';
const TO_DELETE = 'Delete Fixture';

function findCard(page: Page, brandName: string): Locator {
  return page.getByTestId(TEST_IDS.suggestionCard).filter({ hasText: brandName });
}

test.beforeEach(async ({ page, request }) => {
  for (const brandName of [TO_APPROVE, TO_EDIT, TO_REJECT, TO_DELETE]) {
    const response = await request.post(`${API_URL}/api/brand-suggestions`, {
      data: { brandName },
    });
    expect(response.status()).toBe(201);
  }
  await loginAs(page, E2E_USERS.moderation);
  await page.goto('/admin/suggestions');
  await expect(findCard(page, TO_APPROVE)).toBeVisible();
});

test('an admin approves a suggestion', async ({ page }) => {
  await findCard(page, TO_APPROVE).getByTestId(TEST_IDS.suggestionApprove).click();

  await expect(findCard(page, TO_APPROVE)).toHaveCount(0);
  await page.getByTestId(TEST_IDS.suggestionsTab('approved')).click();
  await expect(findCard(page, TO_APPROVE)).toBeVisible();
});

test('an admin edits a suggestion', async ({ page }) => {
  await findCard(page, TO_EDIT).getByTestId(TEST_IDS.suggestionEdit).click();
  await page.getByTestId(TEST_IDS.suggestionEditBrandInput).fill(EDITED);
  await page.getByTestId(TEST_IDS.suggestionEditSave).click();

  await expect(findCard(page, EDITED)).toBeVisible();
  await expect(findCard(page, TO_EDIT)).toHaveCount(0);
});

// On web the confirmation is window.confirm, which Playwright dismisses unless accepted.
test('an admin rejects a suggestion', async ({ page }) => {
  page.once('dialog', (dialog) => dialog.accept());
  await findCard(page, TO_REJECT).getByTestId(TEST_IDS.suggestionReject).click();

  await expect(findCard(page, TO_REJECT)).toHaveCount(0);
  await page.getByTestId(TEST_IDS.suggestionsTab('rejected')).click();
  await expect(findCard(page, TO_REJECT)).toBeVisible();
});

test('an admin deletes a suggestion', async ({ page }) => {
  page.once('dialog', (dialog) => dialog.accept());
  await findCard(page, TO_DELETE).getByTestId(TEST_IDS.suggestionDelete).click();

  await expect(findCard(page, TO_DELETE)).toHaveCount(0);
  await page.reload();
  await expect(findCard(page, TO_APPROVE)).toBeVisible();
  await expect(findCard(page, TO_DELETE)).toHaveCount(0);
});
