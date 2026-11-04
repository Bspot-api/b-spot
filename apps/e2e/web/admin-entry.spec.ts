import { Page } from '@playwright/test';
import { API_URL, E2E_USERS } from '../env/e2e-env';
import { revokeAdminRole } from '../support/db';
import { loginAs } from '../support/login';
import { TEST_IDS } from '../support/test-ids';
import { expect, test } from '../support/test';

/** Reloads and waits until the app has asked the API whether the user is an admin. */
async function reloadAndAwaitAdminCheck(page: Page): Promise<number> {
  const adminCheck = page.waitForResponse(`${API_URL}/api/admin/me`);
  await page.reload();
  return (await adminCheck).status();
}

test('a logged-out visitor sees no admin entry', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByTestId(TEST_IDS.navLoginLink)).toHaveText('Se connecter');
  await expect(page.getByTestId(TEST_IDS.navAdminLink)).toHaveCount(0);
});

test('an admin sees the admin entry and reaches the admin screen', async ({ page }) => {
  await loginAs(page, E2E_USERS.login);

  await page.getByTestId(TEST_IDS.navAdminLink).click();

  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByTestId(TEST_IDS.adminProfileEmail)).toHaveText(E2E_USERS.login);
});

test('an admin demoted server-side loses the admin entry on reload', async ({ page }) => {
  await loginAs(page, E2E_USERS.regular);
  await expect(page.getByTestId(TEST_IDS.navAdminLink)).toBeVisible();

  await revokeAdminRole(E2E_USERS.regular);

  expect(await reloadAndAwaitAdminCheck(page)).toBe(403);
  await expect(page.getByTestId(TEST_IDS.navLoginLink)).toHaveText(E2E_USERS.regular);
  await expect(page.getByTestId(TEST_IDS.navAdminLink)).toHaveCount(0);
  await page.goto('/admin');
  await expect(page).toHaveURL(/\/$/);
});
