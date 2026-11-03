import {
  BEAUTY_PRODUCTS,
  COMPANIES,
  FOOD_PRODUCTS,
  FixtureCompany,
  FixtureProduct,
  SEARCH_HITS,
} from './catalogue';

/** A fixture answer: HTTP status and JSON body, shaped like the real API's. */
export interface FixtureAnswer {
  status: number;
  body: unknown;
}

const SEARCH_PAGE = { page: 1, per_page: 5 };

function factsAnswer(products: readonly FixtureProduct[], barcode: string): FixtureAnswer {
  const product = products.find((candidate) => candidate.barcode === barcode);
  if (!product) {
    return { status: 404, body: { code: barcode, status: 0, status_verbose: 'product not found' } };
  }
  return {
    status: 200,
    body: {
      code: barcode,
      status: 1,
      status_verbose: 'product found',
      product: {
        code: barcode,
        product_name: product.name,
        brands: product.brand,
        categories: product.category,
      },
    },
  };
}

/** Open Food Facts' answer for a barcode: the product, or its real 404 not-found body. */
export function openFoodFactsAnswer(barcode: string): FixtureAnswer {
  return factsAnswer(FOOD_PRODUCTS, barcode);
}

/** Open Beauty Facts' answer for a barcode, same shapes as Open Food Facts. */
export function openBeautyFactsAnswer(barcode: string): FixtureAnswer {
  return factsAnswer(BEAUTY_PRODUCTS, barcode);
}

function normalize(value: string): string {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

/** recherche-entreprises' result page for a query; empty when nothing matches. */
export function rechercheEntreprisesAnswer(query: string): FixtureAnswer {
  const hits = SEARCH_HITS.filter((hit) => hit.query === normalize(query));
  const results = hits.map((hit) => ({
    siren: hit.siren,
    nom_complet: hit.name,
    nom_raison_sociale: hit.name,
    etat_administratif: 'A',
  }));
  return {
    status: 200,
    body: {
      results,
      total_results: results.length,
      ...SEARCH_PAGE,
      total_pages: results.length > 0 ? 1 : 0,
    },
  };
}

function pappersBody(company: FixtureCompany): Record<string, unknown> {
  return {
    siren: company.siren,
    denomination: company.legalName,
    nom_entreprise: company.legalName,
    representants: company.executives.map((person) => ({
      prenom: person.firstName,
      nom: person.lastName,
      qualite: person.role,
      date_debut: '2020-01-01',
    })),
    beneficiaires_effectifs: company.shareholders.map((holder) => ({
      nom: holder.name,
      pourcentages_parts: holder.percentage,
      type_personne: holder.kind,
    })),
  };
}

/** Pappers' company answer: 401 without token, 404 for an unknown SIREN. */
export function pappersAnswer(siren: string, apiToken: string | null): FixtureAnswer {
  if (!apiToken) {
    return {
      status: 401,
      body: { statusCode: 401, error: 'Unauthorized', message: 'Votre api_token est incorrect' },
    };
  }
  const company = COMPANIES.find((candidate) => candidate.siren === siren);
  if (!company) {
    return {
      status: 404,
      body: { statusCode: 404, error: 'Not Found', message: 'Entreprise non trouvée' },
    };
  }
  return { status: 200, body: pappersBody(company) };
}
