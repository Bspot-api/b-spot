import { test as base, expect } from '@playwright/test';
import { EXTERNAL_API_HOSTS } from '../env/e2e-env';
import { resetMutableState } from './db';

interface JourneyFixtures {
  /** Uncaught errors thrown in the page; the journey fails when any occurred. */
  pageErrors: Error[];
}

/**
 * The journeys' `test`: every journey starts from the seeded state, cannot
 * reach the real external APIs from the browser, and fails on a page crash.
 */
export const test = base.extend<JourneyFixtures>({
  pageErrors: [
    async ({ page, context }, use) => {
      await resetMutableState();
      for (const host of EXTERNAL_API_HOSTS) {
        await context.route(`**://${host}/**`, (route) => route.abort('blockedbyclient'));
      }
      const errors: Error[] = [];
      page.on('pageerror', (error) => errors.push(error));
      await use(errors);
      expect(errors, 'uncaught errors in the page').toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };
