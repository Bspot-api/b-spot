/**
 * The fixed catalogue the fixture server answers for.
 * Barcodes and SIRENs of seeded brands are real; every company detail is
 * invented and visibly fictional ("Fixture"), so no fake fact is attached to
 * a real person.
 */

export interface FixtureProduct {
  barcode: string;
  name: string;
  brand: string;
  category: string;
}

export interface FixturePerson {
  firstName: string;
  lastName: string;
  role: string;
}

export interface FixtureShareholder {
  name: string;
  percentage: number;
  kind: 'morale' | 'physique';
}

export interface FixtureCompany {
  siren: string;
  legalName: string;
  executives: FixturePerson[];
  shareholders: FixtureShareholder[];
}

/** A brand that recherche-entreprises resolves to a company. */
export interface FixtureSearchHit {
  query: string;
  siren: string;
  name: string;
}

export const FERRERO_FIXTURE: FixtureCompany = {
  siren: '602018897',
  legalName: 'FERRERO FRANCE FIXTURE',
  executives: [
    { firstName: 'Camille', lastName: 'Fixture', role: 'Directeur Général' },
    { firstName: 'Dominique', lastName: 'Fixture', role: 'Président' },
  ],
  shareholders: [{ name: 'Holding Fixture', percentage: 100, kind: 'morale' }],
};

export const BROVANE_FIXTURE: FixtureCompany = {
  siren: '900000001',
  legalName: 'BROVANE FIXTURE',
  executives: [{ firstName: 'Alex', lastName: 'Fixture', role: 'Président' }],
  shareholders: [],
};

export const OMBRELIS_FIXTURE: FixtureCompany = {
  siren: '900000002',
  legalName: 'OMBRELIS FIXTURE',
  executives: [{ firstName: 'Sacha', lastName: 'Fixture', role: 'Directeur Général' }],
  shareholders: [{ name: 'Morgan Fixture', percentage: 60, kind: 'physique' }],
};

/** Food product of a seeded brand (Nutella → SIREN 602018897). */
export const KNOWN_FOOD: FixtureProduct = {
  barcode: '3017620422003',
  name: 'Pâte à tartiner Fixture',
  brand: 'Nutella',
  category: 'Pâtes à tartiner',
};

/** Cosmetic: unknown to Open Food Facts (404), found by Open Beauty Facts. */
export const KNOWN_COSMETIC: FixtureProduct = {
  barcode: '3600000000017',
  name: 'Crème Fixture',
  brand: 'Ombrelis',
  category: 'Soins du visage',
};

/** Product whose brand no source can resolve. */
export const UNKNOWN_BRAND_PRODUCT: FixtureProduct = {
  barcode: '3700000000014',
  name: 'Biscuit Fixture',
  brand: 'Zorbaq',
  category: 'Biscuits',
};

/** Unseeded brand name that recherche-entreprises resolves. */
export const BRAND_SEARCH_NAME = 'Brovane';

/** Barcode no source knows. */
export const MISSING_PRODUCT_BARCODE = '3000000000000';

export const FOOD_PRODUCTS: readonly FixtureProduct[] = [KNOWN_FOOD, UNKNOWN_BRAND_PRODUCT];
export const BEAUTY_PRODUCTS: readonly FixtureProduct[] = [KNOWN_COSMETIC];
export const COMPANIES: readonly FixtureCompany[] = [
  FERRERO_FIXTURE,
  BROVANE_FIXTURE,
  OMBRELIS_FIXTURE,
];
export const SEARCH_HITS: readonly FixtureSearchHit[] = [
  { query: 'brovane', siren: BROVANE_FIXTURE.siren, name: 'BROVANE' },
  { query: 'ombrelis', siren: OMBRELIS_FIXTURE.siren, name: 'OMBRELIS' },
];
