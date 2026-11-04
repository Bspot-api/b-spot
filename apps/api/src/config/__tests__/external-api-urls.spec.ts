import { readExternalApiUrls } from '../external-api-urls';

describe('readExternalApiUrls', () => {
  it('keeps the four production URLs when no variable is set', () => {
    expect(readExternalApiUrls({})).toEqual({
      openFoodFacts: 'https://world.openfoodfacts.org',
      openBeautyFacts: 'https://world.openbeautyfacts.org',
      rechercheEntreprises: 'https://recherche-entreprises.api.gouv.fr',
      pappers: 'https://api.pappers.fr',
    });
  });

  it('reads each base URL from its own variable', () => {
    const urls = readExternalApiUrls({
      OPEN_FOOD_FACTS_BASE_URL: 'http://localhost:4010/off',
      OPEN_BEAUTY_FACTS_BASE_URL: 'http://localhost:4010/obf',
      RECHERCHE_ENTREPRISES_BASE_URL: 'http://localhost:4010/recherche-entreprises',
      PAPPERS_BASE_URL: 'http://localhost:4010/pappers',
    });

    expect(urls).toEqual({
      openFoodFacts: 'http://localhost:4010/off',
      openBeautyFacts: 'http://localhost:4010/obf',
      rechercheEntreprises: 'http://localhost:4010/recherche-entreprises',
      pappers: 'http://localhost:4010/pappers',
    });
  });

  it('falls back to the production URL when a variable is blank', () => {
    expect(readExternalApiUrls({ PAPPERS_BASE_URL: '  ' }).pappers).toBe('https://api.pappers.fr');
  });

  it('strips a trailing slash', () => {
    const urls = readExternalApiUrls({ OPEN_FOOD_FACTS_BASE_URL: 'http://localhost:4010/off/' });
    expect(urls.openFoodFacts).toBe('http://localhost:4010/off');
  });
});
