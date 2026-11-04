import { E2E_USERS } from '../env/e2e-env';
import { expireSessionsOf } from '../support/db';
import { loginAs } from '../support/login';
import { TEST_IDS } from '../support/test-ids';
import { expect, test } from '../support/test';

test('an expired session sends the user back to logged-out, without a crash', async ({ page }) => {
  await loginAs(page, E2E_USERS.expiry);
  await page.goto('/admin/suggestions');
  await expect(page.getByTestId(TEST_IDS.suggestionsEmpty)).toBeVisible();

  expect(await expireSessionsOf(E2E_USERS.expiry)).toBeGreaterThan(0);
  await page.getByTestId(TEST_IDS.suggestionsTab('approved')).click();

  await expect(page.getByText('Votre session a expirée. Reconnectez-vous.')).toBeVisible();
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByTestId(TEST_IDS.loginEmailInput)).toBeVisible();

  await page.goto('/');
  await expect(page.getByTestId(TEST_IDS.navLoginLink)).toHaveText('Se connecter');
  await expect(page.getByTestId(TEST_IDS.navAdminLink)).toHaveCount(0);
});
