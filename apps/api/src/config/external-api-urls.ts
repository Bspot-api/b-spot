/** Base URLs (origin plus optional path prefix) of the four external APIs the API calls. */
export interface ExternalApiUrls {
  openFoodFacts: string;
  openBeautyFacts: string;
  rechercheEntreprises: string;
  pappers: string;
}

export const DEFAULT_EXTERNAL_API_URLS: ExternalApiUrls = {
  openFoodFacts: 'https://world.openfoodfacts.org',
  openBeautyFacts: 'https://world.openbeautyfacts.org',
  rechercheEntreprises: 'https://recherche-entreprises.api.gouv.fr',
  pappers: 'https://api.pappers.fr',
};

const ENV_VARIABLES: Record<keyof ExternalApiUrls, string> = {
  openFoodFacts: 'OPEN_FOOD_FACTS_BASE_URL',
  openBeautyFacts: 'OPEN_BEAUTY_FACTS_BASE_URL',
  rechercheEntreprises: 'RECHERCHE_ENTREPRISES_BASE_URL',
  pappers: 'PAPPERS_BASE_URL',
};

function readBaseUrl(env: NodeJS.ProcessEnv, key: keyof ExternalApiUrls): string {
  const value = env[ENV_VARIABLES[key]]?.trim();
  if (!value) return DEFAULT_EXTERNAL_API_URLS[key];
  return value.replace(/\/+$/, '');
}

/**
 * Reads the external API base URLs from the environment.
 * An unset or blank variable keeps the production URL.
 */
export function readExternalApiUrls(env: NodeJS.ProcessEnv = process.env): ExternalApiUrls {
  return {
    openFoodFacts: readBaseUrl(env, 'openFoodFacts'),
    openBeautyFacts: readBaseUrl(env, 'openBeautyFacts'),
    rechercheEntreprises: readBaseUrl(env, 'rechercheEntreprises'),
    pappers: readBaseUrl(env, 'pappers'),
  };
}
