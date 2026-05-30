export interface ScanHistoryEntry {
  barcode: string;
  productName: string;
  brandName: string;
  companyName: string;
  companySiren: string;
  productSource: 'OFF' | 'OBF';
  scannedAt: string;
}
