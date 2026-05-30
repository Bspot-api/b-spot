export interface ScanHistoryEntry {
  barcode: string;
  productName: string;
  brandName: string;
  companyName: string;
  companySiren: string;
  productSource: 'OFF' | 'OBF';
  scannedAt: string;
  brandStatus?: 'active' | 'pending' | 'deleted';
  brandResolution?: 'existing' | 'auto_active' | 'auto_pending' | 'needs_user_input';
}
