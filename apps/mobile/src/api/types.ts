export type ProductSource = 'OPEN_FOOD_FACTS' | 'OPEN_BEAUTY_FACTS';

export interface ProductDto {
  barcode: string;
  name: string;
  category?: string;
  imageUrl?: string;
  source: ProductSource;
  brandName?: string;
}

export interface ExecutiveDto {
  name: string;
  role: string;
  startDate?: string;
}

export interface ShareholderDto {
  name: string;
  percentage: number;
  type: 'individual' | 'corporate';
}

export interface CompanyDto {
  siren: string;
  legalName: string;
  logoUrl?: string;
  executives: ExecutiveDto[];
  shareholders: ShareholderDto[];
  lastFetchedAt: string;
}

export interface ScanResultDto {
  product: ProductDto;
  company?: CompanyDto;
  dataFreshness: 'fresh' | 'cached' | 'unavailable';
  message?: string;
}
