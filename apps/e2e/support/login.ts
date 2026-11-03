import { Page } from '@playwright/test';
import { expect } from './test';
import { fetchLatestMagicLink } from './maildev';
import { TEST_IDS } from './test-ids';

/** Asks for a magic link on the login screen and returns it from MailDev. */
export async function requestMagicLink(page: Page, email: string): Promise<string> {
  const since = new Date(Date.now() - 1000);
  await page.goto('/login');
  await page.getByTestId(TEST_IDS.loginEmailInput).fill(email);
  await page.getByTestId(TEST_IDS.loginSubmit).click();
  await expect(page.getByTestId(TEST_IDS.loginSent)).toBeVisible();
  return fetchLatestMagicLink({ email, since });
}

/** Opens a magic link in another tab of the same browser, like a mail client would. */
export async function openMagicLink(page: Page, link: string): Promise<void> {
  const mailTab = await page.context().newPage();
  await mailTab.goto(link);
  await mailTab.close();
}

/** Logs `email` in through the real magic-link flow and waits for the logged-in state. */
export async function loginAs(page: Page, email: string): Promise<void> {
  const link = await requestMagicLink(page, email);
  await openMagicLink(page, link);
  await expect(page).not.toHaveURL(/\/login/);
  await expect(page.getByTestId(TEST_IDS.navLoginLink)).toHaveText(email);
}
