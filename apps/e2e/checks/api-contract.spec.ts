import { expect, test } from '@playwright/test';
import { API_URL } from '../env/e2e-env';
import { PRODUCT_SOURCES } from '../../mobile/src/api/types';

interface EnumProperty {
  enum?: string[];
}

interface OpenApiDocument {
  components: { schemas: Record<string, { properties: Record<string, EnumProperty> }> };
}

function readEnum(document: OpenApiDocument, schema: string, property: string): string[] {
  return document.components.schemas[schema]?.properties[property]?.enum ?? [];
}

test('contract — the app’s product sources are the ones the API’s OpenAPI schema declares', async ({
  request,
}) => {
  const response = await request.get(`${API_URL}/api-json`);
  expect(response.ok()).toBe(true);
  const document = (await response.json()) as OpenApiDocument;

  expect(readEnum(document, 'ProductDto', 'source')).toEqual([...PRODUCT_SOURCES]);
  expect(readEnum(document, 'ScanHistoryItemDto', 'productSource')).toEqual([...PRODUCT_SOURCES]);
});
