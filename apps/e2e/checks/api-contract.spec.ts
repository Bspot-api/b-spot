import { expect, test } from '@playwright/test';
import { API_URL } from '../env/e2e-env';
import { PRODUCT_SOURCES } from '../../mobile/src/api/types';

interface EnumProperty {
  enum?: string[];
}

interface OpenApiDocument {
  components: { schemas: Record<string, { properties: Record<string, EnumProperty> }> };
}

/** The enum values the schema declares for `schema.property`, sorted; undefined when absent. */
function readSortedEnum(
  document: OpenApiDocument,
  schema: string,
  property: string,
): string[] | undefined {
  return document.components.schemas[schema]?.properties[property]?.enum?.slice().sort();
}

test('contract — the app’s product sources are the ones the API’s OpenAPI schema declares', async ({
  request,
}) => {
  const expectedSources = [...PRODUCT_SOURCES].sort();

  const response = await request.get(`${API_URL}/api-json`);
  expect(response.ok()).toBe(true);
  const actualDocument = (await response.json()) as OpenApiDocument;

  expect(readSortedEnum(actualDocument, 'ProductDto', 'source'), 'ProductDto.source').toEqual(
    expectedSources,
  );
  expect(
    readSortedEnum(actualDocument, 'ScanHistoryItemDto', 'productSource'),
    'ScanHistoryItemDto.productSource',
  ).toEqual(expectedSources);
});
