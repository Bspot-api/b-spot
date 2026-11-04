import { E2E_USERS, WEB_URL } from '../env/e2e-env';
import { loginAs, openMagicLink, requestMagicLink } from '../support/login';
import { TEST_IDS } from '../support/test-ids';
import { expect, test } from '../support/test';

test('a magic link logs the user in', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId(TEST_IDS.navLoginLink)).toHaveText('Se connecter');

  await loginAs(page, E2E_USERS.login);

  await expect(page).toHaveURL(/\/$/);
});

test('a magic link already used does not log another browser in', async ({ page, browser }) => {
  const link = await requestMagicLink(page, E2E_USERS.login);
  await openMagicLink(page, link);
  await expect(page.getByTestId(TEST_IDS.navLoginLink)).toHaveText(E2E_USERS.login);

  const otherContext = await browser.newContext({ baseURL: WEB_URL });
  const otherPage = await otherContext.newPage();
  await otherPage.goto(link);
  await otherPage.goto('/');
  await expect(otherPage.getByTestId(TEST_IDS.navLoginLink)).toHaveText('Se connecter');
  await otherContext.close();
});
