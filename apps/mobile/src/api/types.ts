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
  brandResolution?: 'existing' | 'auto_active' | 'auto_pending' | 'needs_user_input';
  brandStatus?: 'active' | 'pending' | 'deleted';
  discoveryConfidence?: number;
  userActionRequired?: 'submit_brand_suggestion';
  brandSuggestionId?: number;
}

export interface BrandScanResultDto {
  company?: CompanyDto;
  dataFreshness: 'fresh' | 'cached' | 'unavailable';
  message?: string;
  brandResolution?: 'existing' | 'auto_active' | 'auto_pending' | 'needs_user_input';
  brandStatus?: 'active' | 'pending' | 'deleted';
  discoveryConfidence?: number;
  userActionRequired?: 'submit_brand_suggestion';
  brandSuggestionId?: number;
}

export interface CreateBrandSuggestionDto {
  brandName: string;
  barcode?: string;
  productName?: string;
  productImageUrl?: string;
  notes?: string;
  offBrandRaw?: string;
}

export type SuggestionStatus = 'new' | 'reviewed' | 'approved' | 'rejected';

export interface BrandSuggestionDto {
  id: number;
  brandName: string;
  barcode?: string;
  productName?: string;
  productImageUrl?: string;
  notes?: string;
  offBrandRaw?: string;
  status: SuggestionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BrandSuggestionListDto {
  items: BrandSuggestionDto[];
  total: number;
}

export interface UpdateSuggestionStatusDto {
  status: SuggestionStatus;
}

export interface SessionDto {
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface AdminProfileDto {
  adminId: string;
  userId: string;
  email: string;
  name: string;
  promotedAt: string;
}
