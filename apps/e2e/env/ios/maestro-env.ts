/**
 * Every value a Maestro flow uses, passed with `maestro test -e`, so no
 * port, scheme, email or fixture name is typed in YAML.
 */
import { API_URL, CONTROL_URL, DEV_SCHEME, E2E_USERS, IOS_BUNDLE_ID, METRO_URL } from '../e2e-env';
import {
  FERRERO_FIXTURE,
  KNOWN_FOOD,
  UNKNOWN_BRAND_PRODUCT,
} from '../../fixtures-server/catalogue';

/** A SIREN the Pappers fixture does not know (it answers 404). */
const UNKNOWN_SIREN = '000000000';

function buildDeepLink(pathname: string, params: Record<string, string> = {}): string {
  const query = new URLSearchParams(params).toString();
  return `${DEV_SCHEME}://${pathname}${query ? `?${query}` : ''}`;
}

/** The brand suggestion route, with the params the scanner pushes for an unknown brand. */
function buildSuggestionLink(): string {
  return buildDeepLink('brand-suggestion/new', {
    brandName: UNKNOWN_BRAND_PRODUCT.brand,
    barcode: UNKNOWN_BRAND_PRODUCT.barcode,
    productName: UNKNOWN_BRAND_PRODUCT.name,
    offBrandRaw: UNKNOWN_BRAND_PRODUCT.brand,
  });
}

/** The suggestions the moderation flow submits, then approves, edits, rejects and deletes. */
const MODERATION_SUGGESTIONS = {
  MODERATION_TO_APPROVE: 'Approve Fixture',
  MODERATION_TO_EDIT: 'Edit Fixture',
  MODERATION_EDITED: 'Edited Fixture',
  MODERATION_TO_REJECT: 'Reject Fixture',
  MODERATION_TO_DELETE: 'Delete Fixture',
} as const;

/** The `-e` variables of a Maestro run. */
export function buildMaestroEnv(): Record<string, string> {
  return {
    APP_ID: IOS_BUNDLE_ID,
    API_URL,
    CONTROL_URL,
    LOGIN_EMAIL: E2E_USERS.login,
    MODERATION_EMAIL: E2E_USERS.moderation,
    EXPIRY_EMAIL: E2E_USERS.expiry,
    ...MODERATION_SUGGESTIONS,
    DEV_CLIENT_LINK: `${DEV_SCHEME}://expo-development-client/?url=${encodeURIComponent(METRO_URL)}`,
    FOOD_COMPANY_LINK: buildDeepLink(`company/${FERRERO_FIXTURE.siren}`),
    FOOD_COMPANY_NAME: FERRERO_FIXTURE.legalName,
    FOOD_COMPANY_SIREN: FERRERO_FIXTURE.siren,
    FOOD_EXECUTIVE: `${FERRERO_FIXTURE.executives[0].firstName} ${FERRERO_FIXTURE.executives[0].lastName}`,
    FOOD_SHAREHOLDER: FERRERO_FIXTURE.shareholders[0].name,
    FOOD_HISTORY_LABEL: `${KNOWN_FOOD.name} — ${FERRERO_FIXTURE.legalName}`,
    UNKNOWN_COMPANY_LINK: buildDeepLink(`company/${UNKNOWN_SIREN}`),
    SUGGESTION_LINK: buildSuggestionLink(),
    SUGGESTION_BRAND: UNKNOWN_BRAND_PRODUCT.brand,
    SUGGESTION_BARCODE: UNKNOWN_BRAND_PRODUCT.barcode,
    SUGGESTION_NOTES: `Vu en rayon biscuits ${Date.now()}`,
  };
}
