import type { StoredScanEntry } from '../env/simulator';
import { FERRERO_FIXTURE, KNOWN_FOOD } from '../fixtures-server/catalogue';

/** A past lookup of the known food product, as the app stores it after a scan. */
export const STORED_FOOD_SCAN: StoredScanEntry = {
  barcode: KNOWN_FOOD.barcode,
  productName: KNOWN_FOOD.name,
  brandName: KNOWN_FOOD.brand,
  companyName: FERRERO_FIXTURE.legalName,
  companySiren: FERRERO_FIXTURE.siren,
  productSource: 'OFF',
  scannedAt: new Date().toISOString(),
};
