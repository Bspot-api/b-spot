import { ApiError } from '../../../api/client';
import { useGetCompany } from '../../../api/hooks';
import type { CompanyDto, ExecutiveDto, ShareholderDto } from '../../../api/types';

interface UseCompanyDataResult {
  company: CompanyDto | undefined;
  executives: ExecutiveDto[];
  shareholders: ShareholderDto[];
  isLoading: boolean;
  errorMessage: string | undefined;
  retry: () => void;
}

export function useCompanyData(siren: string | undefined): UseCompanyDataResult {
  const query = useGetCompany(siren);
  const company = query.data;

  const executives = [...(company?.executives ?? [])].sort((a, b) => {
    return scoreExecutiveRole(b.role) - scoreExecutiveRole(a.role);
  });

  const shareholders = [...(company?.shareholders ?? [])].sort(
    (a, b) => b.percentage - a.percentage
  );

  return {
    company,
    executives,
    shareholders,
    isLoading: query.isLoading,
    errorMessage: resolveErrorMessage(query.error),
    retry: () => {
      void query.refetch();
    },
  };
}

function scoreExecutiveRole(role: string): number {
  const normalized = role.toLowerCase();
  if (
    normalized.includes('directeur général') ||
    normalized.includes('directrice générale') ||
    normalized.includes('ceo') ||
    normalized.includes('président-directeur général') ||
    normalized.includes('president-directeur general')
  ) {
    return 2;
  }
  if (normalized.includes('président') || normalized.includes('president')) {
    return 1;
  }
  return 0;
}

function resolveErrorMessage(error: unknown): string | undefined {
  if (!error) return undefined;
  if (error instanceof ApiError) {
    if (error.statusCode === 404) return 'Entreprise non disponible dans Pappers.';
    if (error.statusCode >= 500) return 'Erreur serveur. Réessayez dans un moment.';
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return 'Impossible de charger les données entreprise.';
}
