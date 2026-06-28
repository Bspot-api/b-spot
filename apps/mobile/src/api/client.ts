import type {
  AdminProfileDto,
  BrandScanResultDto,
  BrandSuggestionDto,
  BrandSuggestionListDto,
  CompanyDto,
  CreateBrandSuggestionDto,
  ScanResultDto,
  SessionDto,
  SuggestionStatus,
  UpdateSuggestionFieldsDto,
} from './types';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001';
const API_TIMEOUT = parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT ?? '10000', 10);

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      credentials: 'include',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const body = (await response.json().catch(() => ({}))) as { message?: string };
      throw new ApiError(response.status, body?.message ?? `HTTP ${response.status}`);
    }

    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function scanProduct(barcode: string): Promise<ScanResultDto> {
  return apiFetch<ScanResultDto>('/api/scan', {
    method: 'POST',
    body: JSON.stringify({ barcode }),
  });
}

export async function getCompany(siren: string): Promise<CompanyDto> {
  return apiFetch<CompanyDto>(`/api/companies/${siren}`);
}

export async function scanByBrand(brandName: string): Promise<BrandScanResultDto> {
  return apiFetch<BrandScanResultDto>('/api/scan/brand', {
    method: 'POST',
    body: JSON.stringify({ brandName }),
  });
}

export async function createBrandSuggestion(
  payload: CreateBrandSuggestionDto
): Promise<BrandSuggestionDto> {
  return apiFetch<BrandSuggestionDto>('/api/brand-suggestions', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getSession(): Promise<SessionDto | null> {
  return apiFetch<SessionDto | null>('/api/auth/get-session');
}

export async function signInMagicLink(email: string): Promise<void> {
  await apiFetch<unknown>('/api/auth/sign-in/magic-link', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function signOut(): Promise<void> {
  await apiFetch<unknown>('/api/auth/sign-out', { method: 'POST' });
}

export async function getAdminMe(): Promise<AdminProfileDto> {
  return apiFetch<AdminProfileDto>('/api/admin/me');
}

export async function listAdminSuggestions(
  status?: SuggestionStatus
): Promise<BrandSuggestionListDto> {
  const query = status ? `?status=${status}` : '';
  return apiFetch<BrandSuggestionListDto>(`/api/admin/brand-suggestions${query}`);
}

export async function updateSuggestionStatus(
  id: number,
  status: SuggestionStatus
): Promise<BrandSuggestionDto> {
  return apiFetch<BrandSuggestionDto>(`/api/admin/brand-suggestions/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function deleteSuggestion(id: number): Promise<void> {
  await apiFetch<void>(`/api/admin/brand-suggestions/${id}`, { method: 'DELETE' });
}

export async function updateSuggestionFields(
  id: number,
  fields: UpdateSuggestionFieldsDto
): Promise<BrandSuggestionDto> {
  return apiFetch<BrandSuggestionDto>(`/api/admin/brand-suggestions/${id}/fields`, {
    method: 'PATCH',
    body: JSON.stringify(fields),
  });
}
